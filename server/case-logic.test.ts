import { describe, expect, it } from "vitest";
import { buildActionGraph, chooseEarliestSafeDeadline, progressAfterApproval, requiresHumanApproval, summarizeTraceState } from "./case-logic";

describe("CivicShield case policy", () => {
  it("chooses the earliest safe deadline when notices conflict", () => {
    const chosen = chooseEarliestSafeDeadline([
      { label: "repair date", dueAt: new Date("2026-09-14T00:00:00Z"), sourceCitation: "notice p. 1" },
      { label: "appeal date", dueAt: new Date("2026-09-12T00:00:00Z"), sourceCitation: "email p. 2" },
    ]);
    expect(chosen?.label).toBe("appeal date");
    expect(chosen?.sourceCitation).toBe("email p. 2");
  });

  it("requires a human gate for consequential actions", () => {
    expect(requiresHumanApproval("outbound_message")).toBe(true);
    expect(requiresHumanApproval("conflict_check")).toBe(false);
    expect(requiresHumanApproval("form_submission")).toBe(true);
  });

  it("advances only after approval and does not overstate rejection progress", () => {
    expect(progressAfterApproval("approved", 12)).toBe(84);
    expect(progressAfterApproval("approved", 92)).toBe(92);
    expect(progressAfterApproval("rejected", 84)).toBe(40);
  });

  it("builds a prioritized graph from extracted signals", () => {
    const graph = buildActionGraph(["submit appeal"], ["contractor access calendar"], ["September 12 vs September 14"]);
    expect(graph).toHaveLength(4);
    expect(graph[0]?.title).toContain("1 deadline conflict");
    expect(graph[1]?.requiresApproval).toBe(true);
    expect(graph[1]?.dependsOn).toBe("conflict_check");
    expect(graph[3]?.dependsOn).toBe("draft_packet");
  });

  it("summarizes the visible audit state", () => {
    expect(summarizeTraceState(["complete", "waiting"])).toBe("awaiting_human");
    expect(summarizeTraceState(["complete", "warning"])).toBe("needs_attention");
    expect(summarizeTraceState(["complete", "complete"])).toBe("autonomous");
  });
});
