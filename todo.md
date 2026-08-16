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

- [ ] Connect and verify a Gemini 3.5+ / Vertex AI model identifier and Google Cloud credentials before final submission
- [ ] Replace polling-only trace refresh with SSE or WebSocket streaming if the final judging rubric requires strict streaming semantics
- [ ] Record and attach a public four-minute demo video, repository URL, and Cloud Run / Vertex AI proof
