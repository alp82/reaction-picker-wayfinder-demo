# Reaction picker — live starter

A static landing page with Vite, React, TypeScript, `gif-picker-react` 2.0.0 and bundled Emoji Mart data. Dependencies and provider configuration are prepared; search, results, clipboard behavior and the audience's design are live work. The landing page's colors are presentation styling, not a resolved visual decision.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:5175. `pnpm build` checks TypeScript and builds the app. Prepare `.env.local` using `.env.example` for a KLIPY client key with ads disabled. This static starter makes no provider requests.

Use the standalone checkout at `/home/alp/dev/reaction-picker-wayfinder-demo` for the live session, with its own GitHub origin. Start Claude Code there. `CLAUDE.md` points to standing demo context and tracker conventions. The source template in the slides repository is for preparation; running tracker commands there would target the presentation repository.

Presenter prompts live in the presentation repository at `docs/demo/runbook.md`. In the standalone checkout, `PRESENTER.md` contains the same prepared runbook. Read it before starting the live chart; the chart itself is intentionally not pre-created.

The completed POC stays in the presentation repository under `demo/reaction-picker-prototype`, running separately on port 5174. It is an openly prebuilt reference. A fresh clone of the demo repository restores the committed starter without overwriting live work.
