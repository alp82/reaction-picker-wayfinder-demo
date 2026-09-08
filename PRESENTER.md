# Live reaction-picker prompts

Use Claude Code in `/home/alp/dev/reaction-picker-wayfinder-demo`, with the separate [demo repository](https://github.com/alp82/reaction-picker-wayfinder-demo) as its GitHub origin. The source starter is `demo/reaction-picker-starter`; the prebuilt POC is `demo/reaction-picker-prototype` (`pnpm demo`, port 5174).

Start the starter with `pnpm dev` in the standalone checkout (port 5175). `CLAUDE.md` carries the standing demo context: prepared dependencies, KLIPY, four ticket types, scope-change rules, and the execution override to record in the map's Notes. The starter has no picker behavior and no pre-created map.

## Copy prompts

The blocks use Claude Code's `/wayfinder` invocation. Replace `<map URL>` and ticket-title placeholders with the actual issues created live. Each numbered step starts a fresh session. Answer human questions in that step's session; the agent cannot make the audience's decisions for them.

### 1. Chart

```text
/wayfinder I want to build a fun little reaction picker for finding and copying GIFs and emoji into conversations—help me figure it out, explore the design with me, and build it. This is a live demo: create exactly one research, one grilling, one prototype, and one execution task ticket, and keep grilling short.
```

Let charting finish. It may launch the research worker; inspect that ticket's outcome instead of starting a duplicate. The research question is real: whether the installed picker supplies the interaction we need, and what copying GIFs actually supports. Research and grilling are independent; prototype waits for both.

### 2. Grill with the audience

```text
/wayfinder <map URL> Work “<grilling ticket title>” with me; let's ask the audience what the smallest useful find-and-copy interaction should be.
```

Invite input and give the presenter's own answer. The reference chose shared search and one-click copy without a separate preview; the room can inform the live decision. Wait for both research and grilling to resolve before the scope change.

### 3. Change scope halfway through

```text
Update <map URL> for this audience-selected change: <change>. Keep the same four tickets, revise affected tickets and dependencies, and explicitly amend affected resolutions while preserving their history; stop before prototyping.
```

Invite suggestions freely and choose one manageable change that affects the prototype and execution. Concrete examples from the POC include putting emoji above GIFs or loading more GIFs as you scroll; use one only if it changes the live map's current decision. If a resolution's question needs reopening, finish that decision in its own session before advancing.

### 4. Prototype the revised idea

```text
/wayfinder <map URL> Work “<prototype ticket title>”: show us visual options for the revised scope and let me react before recording the choice.
```

Show the result, invite reactions, and make the final design choice. This is the visual highlight. The ticket should preserve its runnable artifact and decision for the next session.

### 5. Execute during Q&A

```text
/wayfinder <map URL> Work “<execution ticket title>”: build the agreed reaction picker from the reviewed prototype, check the core interactions, and record the result and any limitations.
```

Start after the prototype resolves, immediately before Q&A. It may continue past the end of the talk; completion on stage is not required.

## Interleave the slides

Use about eight minutes of slides and seventeen minutes of live work in aggregate, followed by five minutes Q&A. Explain skills and the harness around charting; ticket types and dependencies around research/grilling; saved context and amended decisions around the scope change; return to the app for prototyping. These are placements, not a consecutive timing script. No additional research/prototype checkpoints are prepared.

## Preparation and verification

The starter is deliberately separate from the completed POC. The reference's actual work supplies the prompts: testing an existing picker, narrowing interaction scope, choosing a visual composition, handling GIF copy limits, and refining ordering/pagination. The full POC design is not a predetermined answer for the live audience.

Starter dependency installation and production build are checked during preparation. No live chart, research worker, audience exchange, or end-to-end prompt run has been rehearsed or timed. Claude Code authentication, skill discovery inside a live session, workspace trust, embedded-terminal launch/fallback, clipboard paste into the intended destination, and projector behavior remain checks for terminal/final integration.

The reference README records successful live KLIPY search/media loading and the remaining native animated-GIF clipboard limits. The starter consumes its own ignored `.env.local`; the landing page cannot validate provider access. If GIF access fails in the eventual app, retain independent local emoji and show an honest unavailable state with Retry.

Terminal setup belongs to [Prepare and validate the chosen live terminal surface](https://github.com/alp82/slides-agentic-project-manager/issues/12). Final assembly belongs to [Finish the interleaved deck and demo package](https://github.com/alp82/slides-agentic-project-manager/issues/13). Rehearsal and timing are out of scope.
