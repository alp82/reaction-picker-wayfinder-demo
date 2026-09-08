# Standing demo context

## Preparation boundary

The starter supplies Vite, React, TypeScript, `gif-picker-react` and bundled Emoji Mart data, plus a static landing page. KLIPY is the prepared provider; its client key belongs in `.env.local`. The finished reference uses a custom gallery backed by the library's KLIPY adapter; the installed picker is a candidate to investigate, not a required UI.

Search, result rendering, clipboard handling, and the audience's chosen change are live work. Product interaction and visual composition remain human decisions. Keep this a local POC; accounts, backend, uploads, GIF editing, and chat integrations are outside the demo destination.

## Four-ticket map

Put these standing constraints in the map's Notes when charting:

- Execution is explicitly in scope: the destination includes implementing the agreed prototype as a working local POC.
- Keep exactly four child tickets: one research, one grilling, one prototype, and one execution task. This is a presentation constraint.
- Research investigates the installed GIF/emoji picker options and their suitability for finding and copying reactions. It can run during charting; avoid duplicate research workers.
- Grilling determines the smallest useful interaction through brief live discussion with the presenter and audience. Research and grilling are independently takeable. Prototype depends on both; execution depends on prototype.
- After research and grilling resolve, pause for the presenter's audience-selected scope change before prototyping. Revise the existing tickets and dependencies, explicitly amend any affected resolution while preserving its original history, and keep the four-ticket map. Reopen a resolved ticket only if its question needs more work.
- Prototype is a live visual discussion; record the presenter's response before resolving it. Execution starts in a new session during Q&A after that decision resolves.
- Charting and work use separate sessions; resolve at most one non-research ticket per work session. Research is the exception. Completing execution before the talk ends is not required.

## Facts from the reference build

The reference found that shared search and direct click-to-copy can keep the interaction small. Its implementation uses debounced KLIPY requests, stale-response protection, local emoji independent of GIF failures, and Retry. GIF clipboard support varies: preserve original animated bytes where supported and otherwise copy the media URL, with accurate feedback. These facts inform research and discussion; the live map records the choices made here.

The reference's later refinements include emoji above the gallery and loading more GIFs on scroll. They are examples to discuss, not requirements imposed on the audience's prototype.
