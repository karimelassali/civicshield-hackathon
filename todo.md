# Project TODO

- [x] Document ingestion for PDF, image, and text evidence with S3-compatible storage metadata and persisted retrieval links
- [x] Structured case data model for cases, evidence, deadlines, obligations, actions, approvals, trace events, and memory
- [x] Gemini-powered extraction procedure for deadlines, obligations, missing items, and conflicting dates (model verification remains pending)
- [x] Live trace panel with persisted events and 3-second polling for extraction, planning, tool calls, and decisions
- [x] Autonomous dependency-graph workflow that queues prioritized actions
- [x] Evidence-grounded response letters and checklists with source citations
- [x] Human approval gates for high-stakes submissions and outbound messages
- [x] Persistent case memory and action history across sessions
- [x] Case dashboard with active cases, deadline countdowns, approval counts, and completed actions
- [x] Synthetic housing-repair / benefits-appeal demo case with contradictory dates and missing document
- [x] Under-four-minute demo flow covering ingestion, extraction, planning, approval, and completion
- [x] Architecture diagram page naming Gemini, ADK/Genkit, Cloud Run, Firestore, and Pub/Sub
- [x] Social share button with exact hashtag #AllThingsAgenticHackathon
- [x] Public build-log page suitable for optional content bonus
- [x] Hackathon-ready visual design with accessible responsive layout
- [x] Vitest coverage for core case workflow, approval gates, extraction normalization, and demo data
- [x] Run typecheck, tests, and visual verification before checkpoint
- [x] Prepare submission copy, demo script, architecture asset, and repository instructions (repository/video/cloud proof remain external submission steps)

- [x] Defer Gemini 3.5+ / Vertex AI model verification and Google Cloud credentials because the no-cost built-in LLM path is the selected submission scope
- [x] Keep persisted trace polling as the no-cost implementation; strict SSE/WebSocket streaming remains an optional enhancement
- [x] Prepare the no-cost four-minute demo handoff; public video and repository URL remain user-owned external publishing steps, while Cloud Run / Vertex AI proof is optional

- [x] Switch final submission scope to the built-in LLM path with no Google Cloud billing or private credentials
- [x] Update architecture and Devpost copy to label Gemini 3.5 / Vertex AI / Cloud Run / Firestore / Pub/Sub as optional production adapters
- [x] Remove the blocked credential and cloud-proof requirements from the no-cost demo handoff

- [x] Select Taskmaster category and update all submission copy to frame CivicShield as a complete workflow, not a legal chatbot
- [x] Defer mandatory Gemini 3.5+ model, Google Agent Framework, and Google Cloud service verification because the user selected rehearsal-only option B
- [x] Add an unedited proof-of-action recording plan showing backend execution, persisted state changes, and the required Google Cloud proof gate
- [x] Add measurable demo counters for conflicting dates resolved, obligations tracked, and high-stakes actions held
- [x] Add explicit failure/retry and scoped-tool documentation for architectural discipline
- [x] Defer public build-log and social-post publication; they remain optional user-owned actions outside the rehearsal build

- [x] Lock the final free-path rehearsal language across README, UI, demo script, Devpost copy, and repository handoff without implying hackathon compliance
- [x] Add a rehearsal-mode proof banner or disclosure so judges are not misled about the missing Google-stack integration
- [x] Add a compact judge handoff card with the demo sequence, measurable outcomes, and safe-action boundary
