// PROTOTYPE (ticket #4): three variants of the GIF search-and-copy screen,
// switchable via ?variant=A|B|C, mounted on the existing landing route.
import { useEffect, useState } from "react";
import type { Gif } from "gif-picker-react";
import { canCopyAnimated, useGifSearch } from "./useGifSearch";
import "./prototype.css";

type Search = ReturnType<typeof useGifSearch>;

function feedback(s: Search, gif: Gif) {
  if (s.copied?.id !== gif.id) return null;
  return s.copied.outcome === "gif" ? "GIF copied" : "Link copied";
}

function Notes({ s }: { s: Search }) {
  return (
    <>
      {!canCopyAnimated() && (
        <p className="p-note">This browser copies GIF links, not animated GIFs.</p>
      )}
      {s.status === "error" && (
        <p className="p-error">
          Search failed. <button onClick={s.retry}>Retry</button>
        </p>
      )}
    </>
  );
}

/** A: the grilled spec verbatim. Full-width input, uniform 150px grid, feedback on the tile. */
export function VariantA({ s }: { s: Search }) {
  return (
    <div className="pA">
      <input
        autoFocus
        className="pA-input"
        placeholder="Search GIFs…"
        value={s.query}
        onChange={(e) => s.setQuery(e.target.value)}
      />
      <Notes s={s} />
      {s.status === "idle" && <p className="p-hint">Type to find a GIF. Click one to copy it.</p>}
      <div className="pA-grid">
        {s.gifs.map((g) => (
          <button key={g.id} className="pA-tile" onClick={() => s.copy(g)} title={g.description}>
            <img src={g.preview?.imageUrl ?? g.imageUrl} alt={g.description ?? ""} />
            {feedback(s, g) && <span className="p-badge">{feedback(s, g)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** B: stage + strip. One big hovered/last GIF on stage, results as a horizontal filmstrip. */
export function VariantB({ s }: { s: Search }) {
  const [focus, setFocus] = useState<Gif | null>(null);
  const stage = focus ?? s.gifs[0] ?? null;
  return (
    <div className="pB">
      <div className="pB-stage" onClick={() => stage && s.copy(stage)}>
        {stage ? (
          <>
            <img src={stage.imageUrl} alt={stage.description ?? ""} />
            <span className="pB-cta">{feedback(s, stage) ?? "Click to copy"}</span>
          </>
        ) : (
          <span className="p-hint">{s.status === "idle" ? "Search below to fill the stage." : "Searching…"}</span>
        )}
      </div>
      <input
        autoFocus
        className="pB-input"
        placeholder="Search GIFs…"
        value={s.query}
        onChange={(e) => s.setQuery(e.target.value)}
      />
      <Notes s={s} />
      <div className="pB-strip">
        {s.gifs.map((g) => (
          <button
            key={g.id}
            className={"pB-thumb" + (g === stage ? " is-on" : "")}
            onMouseEnter={() => setFocus(g)}
            onClick={() => s.copy(g)}
          >
            <img src={g.preview?.imageUrl ?? g.imageUrl} alt="" />
            {feedback(s, g) && <span className="p-badge">{feedback(s, g)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** C: sidebar + masonry. Query and status live in a sticky left rail; results keep aspect ratio; feedback is a toast. */
export function VariantC({ s }: { s: Search }) {
  return (
    <div className="pC">
      <aside className="pC-rail">
        <p className="eyebrow">REACTION PICKER</p>
        <input
          autoFocus
          className="pC-input"
          placeholder="Search…"
          value={s.query}
          onChange={(e) => s.setQuery(e.target.value)}
        />
        <p className="p-hint">
          {s.status === "idle" && "Type to search."}
          {s.status === "loading" && "Searching…"}
          {s.status === "ok" && `${s.gifs.length} results · click to copy`}
        </p>
        <Notes s={s} />
      </aside>
      <div className="pC-masonry">
        {s.gifs.map((g) => (
          <button key={g.id} className="pC-tile" onClick={() => s.copy(g)}>
            <img src={g.preview?.imageUrl ?? g.imageUrl} alt={g.description ?? ""} />
          </button>
        ))}
      </div>
      {s.copied && (
        <div className="pC-toast">{s.copied.outcome === "gif" ? "GIF copied" : "Link copied"}</div>
      )}
    </div>
  );
}

const VARIANTS = { A: ["Grid (grilled spec)", VariantA], B: ["Stage + strip", VariantB], C: ["Rail + masonry", VariantC] } as const;
type Key = keyof typeof VARIANTS;

export function GifSearchPrototype() {
  const [key, setKey] = useState<Key>(() => {
    const v = new URLSearchParams(location.search).get("variant") as Key | null;
    return v && v in VARIANTS ? v : "A";
  });
  const s = useGifSearch();
  const keys = Object.keys(VARIANTS) as Key[];
  const go = (d: number) => setKey(keys[(keys.indexOf(key) + d + keys.length) % keys.length]);

  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set("variant", key);
    history.replaceState(null, "", u);
  }, [key]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,[contenteditable]")) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  });

  const [name, Comp] = VARIANTS[key];
  return (
    <>
      <Comp s={s} />
      {import.meta.env.MODE !== "production" && (
        <div className="p-switcher">
          <button onClick={() => go(-1)}>←</button>
          <span>
            {key} ({name})
          </span>
          <button onClick={() => go(1)}>→</button>
        </div>
      )}
    </>
  );
}
