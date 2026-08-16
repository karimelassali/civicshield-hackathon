# CivicShield — Four-Minute Demo Script

## 0:00–0:25 — The friction and the measurable stakes

Open the command center on the Northstar housing repair case. Point to the proof counters: **3 conflicting dates, 4 required artifacts, 1 safety hold, 0 unapproved sends**. Say: “A resident has a repair notice, a follow-up email, and a tenant guide. They disagree about the deadline, and one required document is missing. A chatbot can summarize this. CivicShield must rescue the case.”

## 0:25–1:00 — Evidence intake

Open **Case evidence** and show the stored notice with its S3-compatible retrieval link. Explain that PDF, image, and text artifacts remain attached to the case, and every output retains a source citation.

## 1:00–1:55 — Autonomous extraction and conflict detection

Return to the command center and click **Run agent**. Show the live trace as the extractor identifies obligations, missing items, and contradictory dates. Point to the “earliest safe appeal deadline” and explain that the system chooses the conservative date rather than silently guessing.

## 1:55–2:45 — The action graph

Show the action graph. Explain the dependency edges: conflict resolution precedes the outbound request; the evidence-grounded packet follows the conflict check; the checklist tracks every required item. The response letter and checklist are persisted as case artifacts, not merely displayed as chat text.

## 2:45–3:30 — Safety gate and backend proof

Open **Approvals**. Explain that requesting the contractor access calendar is a consequential outbound action, so CivicShield pauses. Approve it and show the action history and updated readiness. Without cutting the recording, briefly show the browser network/API trace or server log entry for the approval mutation and the updated persisted case state. The key product behavior is not “maximum autonomy”; it is “maximum useful autonomy inside an explicit safety boundary.”

## 3:30–4:00 — Proof and architecture

Open **Architecture**. Show the built-in LLM path and the clearly labeled optional Gemini 3.5, ADK / Genkit, Cloud Run, Firestore, and Pub/Sub adapters. Close with: “CivicShield turns bureaucratic uncertainty into a visible, resumable workflow. It acts in the background, cites its evidence, and knows when a human must decide.”

## Final recording gate

For rehearsal, the free path is recordable without Google Cloud credentials: show the hosted CivicShield dashboard, synthetic evidence, persisted trace, generated draft, approval gate, backend/API state change, and architecture page. For the actual hackathon submission, do not submit this rehearsal alone. The official rules require a real Gemini 3.5+ model, at least one Google Agent Framework, at least one Google Cloud infrastructure service, and a visible Google Cloud proof shot in the video. Before submission, record one continuous proof segment showing the Cloud Run or Google Cloud Console backend, the Gemini / Vertex AI execution, and the persisted state change. Keep the final video public, in English or with English subtitles, and under four minutes.
