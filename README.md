# CivicShield — Deadline Rescue Agent

CivicShield turns contradictory bureaucratic notices into a deadline-safe action graph, evidence-grounded drafts, and approval-controlled execution. It is designed for the **Taskmaster** category: a complete workflow rather than a chat loop.

## What the demo proves

The synthetic Northstar Housing Services case contains three conflicting deadline interpretations, four required artifacts, one missing contractor access calendar, and one consequential outbound request. CivicShield stores the source, extracts obligations, selects the earliest safe date, creates dependent actions, drafts a response and checklist, and pauses before the outbound action until a human approves it.

## Run locally

Run `pnpm install`, then `pnpm dev`. Sign in through the managed OAuth flow, click **Load demo case**, and follow `submission/DEMO_SCRIPT.md`. Validation commands are `pnpm check`, `pnpm test`, and `pnpm build`.

## Architecture

The free path uses the built-in server-side LLM integration, S3-compatible evidence storage, a durable relational case-memory schema, and persisted trace events. The project also documents optional production adapters for Gemini 3.5 / Vertex AI, ADK / Genkit, Cloud Run, Firestore, and Pub/Sub in `submission/ARCHITECTURE.mmd` and `submission/ARCHITECTURE.png`.

## Safety model

CivicShield is not a lawyer or government decision-maker. It does not issue legal conclusions. Evidence is retained with citations, malformed model output falls back safely, and outbound messages or form submissions remain behind explicit human approval. The demo uses synthetic evidence only.

## Submission package

- `submission/SUBMISSION_COPY.md` — Devpost narrative, category framing, and judging map.
- `submission/DEMO_SCRIPT.md` — four-minute recording plan.
- `submission/ARCHITECTURE.mmd` — editable architecture source.
- `submission/ARCHITECTURE.png` — rendered architecture diagram.
- `submission/REPOSITORY_HANDOFF.md` — GitHub and Devpost handoff instructions.
- `submission/JUDGE_READINESS_AUDIT.md` — rubric audit and final acceptance gate.

## Final compliance gate

The official hackathon rules require Gemini 3.5 or newer, a Google Agent Framework, and a Google Cloud infrastructure service, and require the final video to show the backend running on Google Cloud. The current free path is a working rehearsal and product prototype. Before a final compliant submission, connect and verify those required services or obtain organizer confirmation that an exception applies. Do not claim compliance without proof.
