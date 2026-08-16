# CivicShield Judge-Readiness Audit

## Critical acceptance finding

The official rules make Gemini 3.5 or newer, at least one Google Agent Framework, and at least one Google Cloud infrastructure service mandatory for every category. The rules also require the demonstration video to show the backend running on Google Cloud. A free built-in LLM-only submission is therefore useful for product development and recording rehearsal, but it is not sufficient for Stage One acceptance unless the final submission includes the required Google stack and proof.

## Current strengths

CivicShield has a distinctive “deadline rescue under uncertainty” twist, a concrete messy case, a visible approval gate, persistent evidence citations, a dynamic action graph, a durable case model, and a compact four-minute story. It maps most naturally to **Taskmaster** because it completes a multi-step workflow rather than merely answering questions.

## Highest-leverage gaps

| Rubric area | Current state | Judge-facing change needed |
|---|---|---|
| Stage One viability | Core UI and free-path workflow are functional, but mandatory Google stack is optional in the current configuration. | Connect a real Gemini 3.5+ model, one Google Agent Framework, and one Google Cloud service before final submission; show proof in the video. |
| Innovation & operational utility | Strong case narrative and approval gate. | Make the “before / after” measurable in the demo: three conflicting dates reduced to one safe date, four required artifacts tracked, and one outbound action safely paused. |
| Architectural discipline | Persistent schema and action dependencies are visible. | Show an unedited trace plus a database/state change or terminal/API evidence, and document failure/retry and tool-scope boundaries. |
| Demo & production readiness | Good UI and script, but no public video or repository URL yet. | Record the first 30 seconds around the friction, keep the run unedited, show the Google Cloud proof, and provide reproducible setup instructions. |
| Bonus contributions | In-app build log and social-share draft exist. | Publish the build log and social post publicly with the exact hashtag; only claim bonus points after publication. |

## Recommended category

Submit under **Taskmaster**. The strongest framing is that CivicShield intercepts a bureaucratic case, performs evidence-grounded planning asynchronously, prepares artifacts, and stops only at a consequential action. Do not frame the project as a generic legal chatbot.

## Judge narrative

The strongest one-sentence claim is: “CivicShield turns contradictory administrative notices into a deadline-safe action graph, produces cited artifacts, and pauses outbound action at a human safety gate.” The twist is not document summarization; it is safe execution under conflicting evidence.

## Final gate

Do not submit until the final video visibly proves the required Google stack. If that proof cannot be obtained, submit only if the organizer confirms an exception; otherwise the current prototype should be treated as a rehearsal/demo build, not a compliant final entry.
