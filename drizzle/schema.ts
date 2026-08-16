import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 255 }).notNull(),
  caseType: varchar("caseType", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  status: mysqlEnum("status", ["active", "awaiting_approval", "resolved", "archived"]).default("active").notNull(),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"]).default("medium").notNull(),
  nextDeadline: timestamp("nextDeadline"),
  progress: int("progress").default(0).notNull(),
  draftLetter: text("draftLetter"),
  checklistJson: text("checklistJson"),
  isDemo: boolean("isDemo").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const evidence = mysqlTable("evidence", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  userId: int("userId"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  storageKey: text("storageKey").notNull(),
  storageUrl: text("storageUrl").notNull(),
  extractedText: text("extractedText"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const deadlines = mysqlTable("deadlines", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  dueAt: timestamp("dueAt").notNull(),
  status: mysqlEnum("status", ["open", "at_risk", "met", "conflicted"]).default("open").notNull(),
  confidence: int("confidence").default(90).notNull(),
  sourceCitation: varchar("sourceCitation", { length: 255 }),
  note: text("note"),
});

export const actions = mysqlTable("actions", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  kind: varchar("kind", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["queued", "in_progress", "pending_approval", "completed", "blocked"]).default("queued").notNull(),
  priority: int("priority").default(50).notNull(),
  dependsOn: varchar("dependsOn", { length: 255 }),
  dueAt: timestamp("dueAt"),
  requiresApproval: boolean("requiresApproval").default(false).notNull(),
  sourceCitation: varchar("sourceCitation", { length: 255 }),
  completedAt: timestamp("completedAt"),
});

export const approvals = mysqlTable("approvals", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  actionId: int("actionId").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  rationale: text("rationale").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export const traceEvents = mysqlTable("traceEvents", {
  id: int("id").autoincrement().primaryKey(),
  caseId: int("caseId").notNull(),
  step: varchar("step", { length: 120 }).notNull(),
  agent: varchar("agent", { length: 120 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["running", "complete", "waiting", "warning"]).default("running").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Case = typeof cases.$inferSelect;
export type Evidence = typeof evidence.$inferSelect;
export type Deadline = typeof deadlines.$inferSelect;
export type Action = typeof actions.$inferSelect;
export type Approval = typeof approvals.$inferSelect;
export type TraceEvent = typeof traceEvents.$inferSelect;
