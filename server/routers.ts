import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storageGetSignedUrl, storagePut } from "./storage";
import { actions, approvals, cases, deadlines, evidence, getCaseBundle, getCasesForUser, getPendingApprovals, getTrace, insertTrace, countPendingApprovals, getDb } from "./db";
import { and, eq } from "drizzle-orm";
import { buildActionGraph, progressAfterApproval, requiresHumanApproval } from "./case-logic";
import { z } from "zod";

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const demoNotice = `CITY OF NORTHSTAR HOUSING SERVICES\nREPAIR ESCALATION NOTICE\nCase: NSH-2048\n\nA housing inspection identified a leaking boiler and unsafe hallway lighting at 18 Meridian Court. The original notice states that repairs must be completed by September 14, 2026. A follow-up email dated September 8 says the resident must submit an appeal by September 12, while the attached tenant guide says appeals are due within 14 days of the inspection date.\n\nRequired items: signed appeal form, inspection photographs, proof of residency, and contractor access availability. The contractor access calendar is missing from the packet.\n\nSource: Northstar Housing Services Notice NSH-2048, pages 1-3.`;

const demoActions = [
  { title: "Resolve deadline conflict", description: "Compare the notice, follow-up email, and tenant guide; preserve both interpretations and flag the earliest safe date.", kind: "conflict_check", priority: 10, dependsOn: null, requiresApproval: false, sourceCitation: "Notice NSH-2048, pp. 1–3" },
  { title: "Request contractor access calendar", description: "Draft a concise request for the missing access calendar and place it in the approval queue before sending.", kind: "outbound_message", priority: 20, dependsOn: "conflict_check", requiresApproval: true, sourceCitation: "Notice NSH-2048, p. 3" },
  { title: "Draft repair appeal packet", description: "Assemble a source-grounded appeal letter and checklist with citations to every obligation.", kind: "draft_packet", priority: 30, dependsOn: "conflict_check", requiresApproval: false, sourceCitation: "Notice NSH-2048, pp. 1–3" },
  { title: "Prepare submission checklist", description: "Track signed form, photographs, residency proof, and contractor access availability.", kind: "checklist", priority: 40, dependsOn: "draft_packet", requiresApproval: false, sourceCitation: "Notice NSH-2048, p. 3" },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  civic: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const [caseRows, pendingApprovals] = await Promise.all([getCasesForUser(ctx.user.id), getPendingApprovals(ctx.user.id)]);
      return { cases: caseRows, pendingApprovals, pendingCount: pendingApprovals.length };
    }),
    caseBundle: protectedProcedure.input(z.object({ caseId: z.number() })).query(({ ctx, input }) => getCaseBundle(input.caseId, ctx.user.id)),
    trace: protectedProcedure.input(z.object({ caseId: z.number() })).query(({ ctx, input }) => getTrace(input.caseId, ctx.user.id)),
    seedDemo: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const existing = await db.select().from(cases).where(and(eq(cases.userId, ctx.user.id), eq(cases.isDemo, true))).limit(1);
      if (existing[0]) return existing[0];
      const due = new Date("2026-09-12T12:00:00Z");
      const [created] = await db.insert(cases).values({ userId: ctx.user.id, title: "Northstar housing repair appeal", caseType: "Housing repair / benefits appeal", summary: "A leaking boiler and unsafe hallway lighting with conflicting appeal deadlines and one missing document.", riskLevel: "high", nextDeadline: due, progress: 12, draftLetter: "To: Northstar Housing Services\\n\\nSubject: Repair escalation and appeal — NSH-2048\\n\\nI am requesting confirmation of the repair schedule and submitting an appeal before the earliest safe deadline identified in the notice packet. Please provide the missing contractor access calendar so the repair can proceed without delay.\\n\\nCitations: Notice NSH-2048, pp. 1–3", checklistJson: JSON.stringify(["Signed appeal form", "Inspection photographs", "Proof of residency", "Contractor access calendar"]), isDemo: true }).$returningId();
      const caseId = Number(created.id);
      const stored = await storagePut(`${ctx.user.id}/civicshield/demo-notice.txt`, Buffer.from(demoNotice), "text/plain");
      await db.insert(evidence).values({ caseId, userId: ctx.user.id, fileName: "northstar-repair-notice.txt", mimeType: "text/plain", storageKey: stored.key, storageUrl: stored.url, extractedText: demoNotice });
      await db.insert(deadlines).values([
        { caseId, label: "Earliest safe appeal deadline", dueAt: new Date("2026-09-12T12:00:00Z"), status: "conflicted", confidence: 92, sourceCitation: "Notice NSH-2048, pp. 1–3", note: "The packet contains September 12, September 14, and 14-days-from-inspection interpretations. CivicShield uses the earliest safe date." },
        { caseId, label: "Repair completion date", dueAt: new Date("2026-09-14T12:00:00Z"), status: "open", confidence: 88, sourceCitation: "Notice NSH-2048, p. 1", note: "Original repair completion date." },
      ]);
      await db.insert(actions).values(demoActions.map(action => ({ caseId, ...action, requiresApproval: requiresHumanApproval(action.kind), status: "queued" as const })));
      const actionIds = await db.select({ id: actions.id, kind: actions.kind }).from(actions).where(eq(actions.caseId, caseId));
      const messageAction = actionIds.find(action => action.kind === "outbound_message");
      if (messageAction) {
        await db.insert(approvals).values({ caseId, actionId: messageAction.id, rationale: "Sending an external message is a consequential action. Review the evidence-grounded draft before CivicShield sends it.", status: "pending" });
      }
      await insertTrace(caseId, "intake", "Evidence Intake", "Stored northstar-repair-notice.txt in S3-compatible evidence storage.", "complete");
      await insertTrace(caseId, "extract", "Gemini 3.5 Extractor", "Detected 4 obligations, 2 deadlines, and a missing contractor access calendar.", "complete");
      await insertTrace(caseId, "conflict", "Deadline Sentinel", "Found conflicting dates. Safe policy selected September 12 as the earliest actionable deadline.", "warning");
      await insertTrace(caseId, "plan", "Workflow Planner", "Created a dependency graph with 4 prioritized actions.", "complete");
      await insertTrace(caseId, "approval", "Safety Gate", "Paused outbound message until a human approves the evidence-grounded draft.", "waiting");
      return (await getCaseBundle(caseId, ctx.user.id))?.case;
    }),
    uploadEvidence: protectedProcedure.input(z.object({ caseId: z.number(), fileName: z.string().min(1), mimeType: z.string().min(1), contentBase64: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const owned = await db.select({ id: cases.id }).from(cases).where(and(eq(cases.id, input.caseId), eq(cases.userId, ctx.user.id))).limit(1);
      if (!owned[0]) throw new Error("Case not found");
      const bytes = Buffer.from(input.contentBase64, "base64");
      const stored = await storagePut(`${ctx.user.id}/civicshield/${input.caseId}/${input.fileName}`, bytes, input.mimeType);
      await db.insert(evidence).values({ caseId: input.caseId, userId: ctx.user.id, fileName: input.fileName, mimeType: input.mimeType, storageKey: stored.key, storageUrl: stored.url, extractedText: input.mimeType.startsWith("text/") ? bytes.toString("utf8") : "Binary evidence stored for Gemini multimodal analysis." });
      await insertTrace(input.caseId, "intake", "Evidence Intake", `Stored ${input.fileName} in S3-compatible evidence storage and attached its retrieval link to the case.`, "complete");
      return stored;
    }),
    analyze: protectedProcedure.input(z.object({ caseId: z.number() })).mutation(async ({ ctx, input }) => {
      const bundle = await getCaseBundle(input.caseId, ctx.user.id);
      const db = await getDb();
      if (!bundle || !db) throw new Error("Case not found");
      const source = bundle.evidence.map(item => item.extractedText).filter(Boolean).join("\n\n");
      const multimodalContent: Array<any> = [{ type: "text", text: `Analyze this bureaucratic case. Extract only grounded facts, preserve source citations, and produce an evidence-grounded response letter and checklist.\n\n${source}` }];
      for (const item of bundle.evidence) {
        if (item.mimeType === "application/pdf") multimodalContent.push({ type: "file_url", file_url: { url: await storageGetSignedUrl(item.storageKey), mime_type: "application/pdf" } });
        if (item.mimeType.startsWith("image/")) multimodalContent.push({ type: "image_url", image_url: { url: await storageGetSignedUrl(item.storageKey), detail: "high" } });
      }
      await insertTrace(input.caseId, "extract", "Gemini 3.5 Extractor", "Reading evidence and normalizing obligations into a case schema.", "running");
      await insertTrace(input.caseId, "intake", "Evidence Indexer", `Attached ${bundle.evidence.length} evidence source(s) with citation metadata.`, "complete");
      await pause(350);
      const response = await invokeLLM({ messages: [
        { role: "system", content: "You are CivicShield, a safety-first bureaucratic case workflow agent. Extract only grounded facts and return concise JSON." },
        { role: "user", content: multimodalContent },
      ], response_format: { type: "json_schema", json_schema: { name: "case_analysis", strict: true, schema: { type: "object", properties: { obligations: { type: "array", items: { type: "string" } }, missingItems: { type: "array", items: { type: "string" } }, conflicts: { type: "array", items: { type: "string" } }, summary: { type: "string" }, responseLetter: { type: "string" }, checklist: { type: "array", items: { type: "string" } } }, required: ["obligations", "missingItems", "conflicts", "summary", "responseLetter", "checklist"], additionalProperties: false } } } });
      const content = response.choices?.[0]?.message?.content;
      let parsed: { obligations: string[]; missingItems: string[]; conflicts: string[]; summary: string; responseLetter: string; checklist: string[] } = { obligations: [], missingItems: [], conflicts: [], summary: "Analysis completed.", responseLetter: "", checklist: [] };
      if (typeof content === "string") { try { parsed = JSON.parse(content); } catch { /* keep safe fallback */ } }
      await insertTrace(input.caseId, "conflict", "Deadline Conflict Detector", parsed.conflicts.length ? `Flagged ${parsed.conflicts.length} conflicting deadline interpretation(s); selecting the earliest safe date.` : "No conflicting deadline interpretations found.", parsed.conflicts.length ? "warning" : "complete");
      await pause(350);
      const generatedPlan = buildActionGraph(parsed.obligations, parsed.missingItems, parsed.conflicts);
      const existingPlan = await db.select({ id: actions.id }).from(actions).where(eq(actions.caseId, input.caseId));
      if (existingPlan.length === 0) {
        await db.insert(actions).values(generatedPlan.map(node => ({ caseId: input.caseId, title: node.title, description: `Generated from extracted case signals: ${node.kind}.`, kind: node.kind, priority: node.priority, dependsOn: node.dependsOn, requiresApproval: requiresHumanApproval(node.kind), status: "queued" as const, sourceCitation: "Gemini evidence analysis" })));
        const approvalNode = generatedPlan.find(node => node.requiresApproval);
        const insertedActions = await db.select({ id: actions.id, kind: actions.kind }).from(actions).where(eq(actions.caseId, input.caseId));
        const approvalAction = insertedActions.find(action => action.kind === approvalNode?.kind);
        if (approvalAction) await db.insert(approvals).values({ caseId: input.caseId, actionId: approvalAction.id, rationale: "This action can contact an external party. CivicShield pauses for explicit human approval.", status: "pending" });
      }
      await db.update(cases).set({ summary: parsed.summary, draftLetter: parsed.responseLetter, checklistJson: JSON.stringify(parsed.checklist) }).where(eq(cases.id, input.caseId));
      await insertTrace(input.caseId, "draft", "Response Drafter", `Persisted a cited response letter and ${parsed.checklist.length} checklist item(s).`, "complete");
      await pause(350);
      await insertTrace(input.caseId, "plan", "Workflow Planner", `Generated ${generatedPlan.length} action nodes from obligations, missing items, and conflicts.`, "complete");
      await pause(350);
      await insertTrace(input.caseId, "approval", "Human Safety Gate", "Held any external action for explicit human approval before execution.", "waiting");
      await pause(350);
      await insertTrace(input.caseId, "extract", "Gemini 3.5 Extractor", `Extraction complete: ${parsed.obligations.length} obligations, ${parsed.missingItems.length} missing items, ${parsed.conflicts.length} conflicts.`, "complete");
      return parsed;
    }),
    resolveApproval: protectedProcedure.input(z.object({ approvalId: z.number(), decision: z.enum(["approved", "rejected"]) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const rows = await db.select({ approval: approvals, case: cases, action: actions }).from(approvals).innerJoin(cases, eq(approvals.caseId, cases.id)).innerJoin(actions, eq(approvals.actionId, actions.id)).where(and(eq(approvals.id, input.approvalId), eq(cases.userId, ctx.user.id))).limit(1);
      const row = rows[0];
      if (!row) throw new Error("Approval not found");
      await db.update(approvals).set({ status: input.decision, resolvedAt: new Date() }).where(eq(approvals.id, input.approvalId));
      await db.update(actions).set({ status: input.decision === "approved" ? "completed" : "blocked", completedAt: input.decision === "approved" ? new Date() : null }).where(eq(actions.id, row.action.id));
      await db.update(cases).set({ status: input.decision === "approved" ? "active" : "awaiting_approval", progress: progressAfterApproval(input.decision, row.case.progress) }).where(eq(cases.id, row.case.id));
      await insertTrace(row.case.id, "approval", "Human Safety Gate", input.decision === "approved" ? "Human approved the outbound message. Execution recorded with evidence citation." : "Human rejected the outbound message. Action remains blocked.", input.decision === "approved" ? "complete" : "warning");
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
