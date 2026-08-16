# CivicShield Repository Handoff

## Repository

Create a public GitHub repository named `civicshield` or `civicshield-deadline-rescue`. Replace this line with the final URL before submitting to Devpost:

`Repository URL: [paste public GitHub URL here]`

## README sections to include

The repository README should contain the one-line summary, the problem statement, the four-minute demo steps, the architecture diagram, the safety boundaries, the local setup instructions, the test commands, and a note that the demo case uses synthetic evidence.

Link the submission assets from this directory:

- `submission/SUBMISSION_COPY.md` — Devpost narrative.
- `submission/DEMO_SCRIPT.md` — timed recording walkthrough.
- `submission/ARCHITECTURE.mmd` — editable architecture source.
- `submission/ARCHITECTURE.png` — rendered architecture image.

## Local setup

Run `pnpm install`, configure the managed project environment, then run `pnpm dev`. Validate with `pnpm check`, `pnpm test`, and `pnpm build`. Sign in through the project’s OAuth flow, load the synthetic demo case, and follow the steps in `DEMO_SCRIPT.md`.

## Deployment notes

The project is designed for managed Cloud Run-style deployment. Do not commit `.env` files, service-account keys, user documents, or private credentials. The no-cost demo does not require Google Cloud credentials, billing, Gemini 3.5+/Vertex AI verification, or Cloud Run proof. If those optional adapters are added later, document them separately without changing the free-path setup. The architecture page intentionally names ADK / Genkit, Cloud Run, Firestore, and Pub/Sub so the production mapping is explicit.

## Devpost handoff

Paste the final public repository URL into the Devpost submission, attach the public demo video, upload `ARCHITECTURE.png`, and use the copy in `SUBMISSION_COPY.md`. Confirm that the video shows the live trace, evidence citations, approval gate, persisted draft, and architecture page. Google Cloud deployment proof is optional and should not be described as part of the no-cost path. Do not claim that a message was sent or a form was submitted unless the action was actually approved and executed in the connected environment.

## Failure and safety behavior

If extraction returns malformed JSON, CivicShield keeps a safe empty fallback rather than inventing facts, records the extraction trace, and leaves the case available for retry. If evidence storage fails, the upload mutation returns an error and does not attach an incomplete case artifact. Generated outbound actions are isolated behind an approval record; rejection marks the action blocked and preserves the decision in the audit trace. Action dependencies are stored explicitly, so the planner can resume from the last durable node instead of repeating every step.
