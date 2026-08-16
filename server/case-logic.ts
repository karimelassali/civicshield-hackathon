export type CaseSignal = {
  label: string;
  dueAt: Date;
  sourceCitation: string;
};

export function chooseEarliestSafeDeadline(signals: CaseSignal[]) {
  return [...signals].sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())[0] ?? null;
}

export function requiresHumanApproval(kind: string) {
  return ["outbound_message", "form_submission", "benefits_filing", "external_payment"].includes(kind);
}

export function progressAfterApproval(decision: "approved" | "rejected", currentProgress: number) {
  if (decision === "approved") return Math.max(currentProgress, 84);
  return Math.min(currentProgress, 40);
}

export function summarizeTraceState(statuses: string[]) {
  if (statuses.includes("waiting")) return "awaiting_human" as const;
  if (statuses.includes("warning")) return "needs_attention" as const;
  return "autonomous" as const;
}

export function buildActionGraph(obligations: string[], missingItems: string[], conflicts: string[]) {
  const graph: Array<{ title: string; kind: string; priority: number; dependsOn: string | null; requiresApproval: boolean }> = [{ title: "Resolve deadline conflicts", kind: "conflict_check", priority: 10, dependsOn: null, requiresApproval: false }];
  if (missingItems.length) graph.push({ title: `Request ${missingItems[0]}`, kind: "outbound_message", priority: 20, dependsOn: "conflict_check", requiresApproval: true });
  graph.push({ title: "Draft evidence-grounded response", kind: "draft_packet", priority: 30, dependsOn: "conflict_check", requiresApproval: false });
  graph.push({ title: `Track ${obligations.length || 1} obligations`, kind: "checklist", priority: 40, dependsOn: "draft_packet", requiresApproval: false });
  if (conflicts.length) graph[0].title = `Resolve ${conflicts.length} deadline conflicts`;
  return graph;
}
