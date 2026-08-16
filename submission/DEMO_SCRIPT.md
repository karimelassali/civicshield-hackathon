# CivicShield — Four-Minute Demo Script

## 0:00–0:25 — The friction

Open the command center on the Northstar housing repair case. Say: “A resident has a repair notice, a follow-up email, and a tenant guide. They disagree about the deadline, and one required document is missing. A chatbot can summarize this. CivicShield must rescue the case.”

## 0:25–1:00 — Evidence intake

Open **Case evidence** and show the stored notice with its S3-compatible retrieval link. Explain that PDF, image, and text artifacts remain attached to the case, and every output retains a source citation.

## 1:00–1:55 — Autonomous extraction and conflict detection

Return to the command center and click **Run agent**. Show the live trace as the extractor identifies obligations, missing items, and contradictory dates. Point to the “earliest safe appeal deadline” and explain that the system chooses the conservative date rather than silently guessing.

## 1:55–2:45 — The action graph

Show the action graph. Explain the dependency edges: conflict resolution precedes the outbound request; the evidence-grounded packet follows the conflict check; the checklist tracks every required item. The response letter and checklist are persisted as case artifacts, not merely displayed as chat text.

## 2:45–3:30 — Safety gate

Open **Approvals**. Explain that requesting the contractor access calendar is a consequential outbound action, so CivicShield pauses. Approve it and show the action history and updated readiness. The key product behavior is not “maximum autonomy”; it is “maximum useful autonomy inside an explicit safety boundary.”

## 3:30–4:00 — Proof and architecture

Open **Architecture**. Show the required chain: Gemini 3.5, ADK / Genkit, Cloud Run, Firestore, and Pub/Sub. Close with: “CivicShield turns bureaucratic uncertainty into a visible, resumable workflow. It acts in the background, cites its evidence, and knows when a human must decide.”

## Recording checklist

Record the Google Cloud deployment proof in the same video: the Cloud Run URL or Cloud Console, the Gemini / Vertex AI execution, and the persistent case state. Keep the final video public, in English or with English subtitles, and under four minutes.
