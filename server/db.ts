import { and, asc, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { actions, approvals, cases, deadlines, evidence, traceEvents, users, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getCasesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cases).where(eq(cases.userId, userId)).orderBy(asc(cases.nextDeadline), desc(cases.updatedAt));
}

export async function getCaseBundle(caseId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const found = await db.select().from(cases).where(and(eq(cases.id, caseId), eq(cases.userId, userId))).limit(1);
  if (!found[0]) return null;
  const [caseEvidence, caseDeadlines, caseActions, caseApprovals, trace] = await Promise.all([
    db.select().from(evidence).where(eq(evidence.caseId, caseId)).orderBy(desc(evidence.createdAt)),
    db.select().from(deadlines).where(eq(deadlines.caseId, caseId)).orderBy(asc(deadlines.dueAt)),
    db.select().from(actions).where(eq(actions.caseId, caseId)).orderBy(asc(actions.priority), asc(actions.id)),
    db.select().from(approvals).where(eq(approvals.caseId, caseId)).orderBy(desc(approvals.createdAt)),
    db.select().from(traceEvents).where(eq(traceEvents.caseId, caseId)).orderBy(asc(traceEvents.createdAt), asc(traceEvents.id)),
  ]);
  return { case: found[0], evidence: caseEvidence, deadlines: caseDeadlines, actions: caseActions, approvals: caseApprovals, trace };
}

export async function getPendingApprovals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ approval: approvals, action: actions, case: cases })
    .from(approvals)
    .innerJoin(actions, eq(approvals.actionId, actions.id))
    .innerJoin(cases, eq(approvals.caseId, cases.id))
    .where(and(eq(approvals.status, "pending"), eq(cases.userId, userId)))
    .orderBy(desc(approvals.createdAt));
}

export async function insertTrace(caseId: number, step: string, agent: string, message: string, status: "running" | "complete" | "waiting" | "warning" = "running") {
  const db = await getDb();
  if (!db) return;
  await db.insert(traceEvents).values({ caseId, step, agent, message, status });
}

export async function getTrace(caseId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  const owned = await db.select({ id: cases.id }).from(cases).where(and(eq(cases.id, caseId), eq(cases.userId, userId))).limit(1);
  if (!owned[0]) return [];
  return db.select().from(traceEvents).where(eq(traceEvents.caseId, caseId)).orderBy(asc(traceEvents.createdAt), asc(traceEvents.id));
}

export async function countPendingApprovals(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ count: sql<number>`count(*)` }).from(approvals).innerJoin(cases, eq(approvals.caseId, cases.id)).where(and(eq(approvals.status, "pending"), eq(cases.userId, userId)));
  return Number(rows[0]?.count ?? 0);
}

export { actions, approvals, cases, deadlines, evidence, traceEvents };
