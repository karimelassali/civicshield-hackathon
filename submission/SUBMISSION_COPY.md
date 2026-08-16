# CivicShield — Devpost Submission Draft

## One-line summary

CivicShield is a safety-first bureaucratic case agent that turns contradictory notices into deadline-aware action plans, evidence-grounded drafts, and approval-controlled execution.

## The problem

Administrative and legal notices rarely arrive as one clean workflow. A person may receive a PDF, an email, a follow-up notice, and a checklist that disagree about dates or omit a required item. The real cost is not reading the documents; it is coordinating the next actions before the deadline passes.

## What CivicShield does

CivicShield ingests PDF, image, and text evidence, stores the original artifact in S3-compatible storage, and attaches a retrieval link to the case record. Gemini analyzes the evidence for deadlines, obligations, missing items, and conflicts. The workflow planner creates a prioritized dependency graph, drafts a response letter and checklist with citations, and records each step in a durable case trace.

The system is autonomous where the risk is low and explicit where the risk is high. It can normalize evidence, calculate the earliest safe interpretation of conflicting dates, and prepare the next artifact without hand-holding. It pauses before outbound messages or form submissions and requires a human approval. The case can resume later because evidence, memory, actions, approvals, and trace events persist together.

## The twist

CivicShield is built around **deadline rescue under uncertainty**. It does not silently choose the most convenient date. It preserves the conflict, selects the earliest safe actionable deadline, explains the source citations, and creates a workflow that can continue in the background while waiting for a missing item or human decision.

## Technology

The prototype uses Gemini through the server-side LLM integration, a Google agent-framework-compatible orchestration model represented as ADK / Genkit in the architecture, S3-compatible evidence storage, a relational case-memory schema aligned to Firestore concepts, and asynchronous event concepts aligned to Pub/Sub. The production submission should show the verified Gemini 3.5 or newer model and Google Cloud deployment proof in the video.

## Demo scenario

The synthetic Northstar Housing Services case contains a leaking boiler, unsafe hallway lighting, three conflicting deadline interpretations, and a missing contractor access calendar. In a single live run, CivicShield stores the notice, extracts obligations, flags the conflict, selects September 12 as the earliest safe appeal date, builds the action graph, drafts the response, and pauses the outbound request in the approval queue.

## Responsible boundaries

CivicShield is a workflow and evidence coordination system, not a lawyer and not a government decision-maker. The demo uses synthetic evidence. It does not issue legal conclusions, send external messages, or submit forms without explicit human approval.

## Testing instructions

1. Sign in to the hosted project.
2. Click **Load demo case**.
3. Click **Run agent** on the command center.
4. Inspect the action graph, persisted draft, deadline conflict, and live trace.
5. Open **Approvals**, approve the contractor-calendar request, and observe the recorded decision.
6. Open **Architecture** for the system diagram and **Build log** for the project narrative.

## Package handoff

Use [`REPOSITORY_HANDOFF.md`](./REPOSITORY_HANDOFF.md) for the GitHub README structure, setup commands, deployment notes, and Devpost handoff instructions.

## Final submission checklist

Before submitting, replace the prototype’s current model/deployment note with the verified Gemini 3.5+ model identifier, attach Cloud Run / Vertex AI proof to the video, provide the public GitHub repository, publish the final four-minute video, and include the architecture diagram asset.
