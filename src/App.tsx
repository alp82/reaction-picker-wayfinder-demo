import { useEffect, useRef, useState } from "react";
import { canCopyAnimatedGif, copyGif, type CopyOutcome } from "./gifs/clipboard";
import { hasApiKey, type Gif } from "./gifs/provider";
import { useGifSearch, type GifSearch } from "./gifs/useGifSearch";

const TOAST_MS = 1400;
const copiesLinksOnly = !canCopyAnimatedGif();

function statusLine(s: GifSearch): string {
  switch (s.status) {
    case "idle":
      return "Type to search.";
    case "loading":
      return "Searching…";
    case "ok":
      return s.gifs.length ? `${s.gifs.length} results · click to copy` : "No GIFs for that.";
    case "error":
      return "";
  }
}

function Rail({ search }: { search: GifSearch }) {
  return (
    <aside className="rail">
      <p className="eyebrow">REACTION PICKER</p>
      <input
        autoFocus
        className="query"
        type="search"
        placeholder="Search GIFs…"
        aria-label="Search GIFs"
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
      />
      <p className="status" role="status">
        {statusLine(search)}
      </p>
      {copiesLinksOnly && (
        <p className="note">This browser copies GIF links, not animated GIFs.</p>
      )}
      {!hasApiKey && (
        <p className="error">No KLIPY key. Set VITE_GIF_API_KEY in .env.local and restart Vite.</p>
      )}
      {search.status === "error" && (
        <p className="error" role="alert">
          Search failed.{" "}
          <button type="button" onClick={search.retry}>
            Retry
          </button>
        </p>
      )}
    </aside>
  );
}

function Gallery({ gifs, onCopy }: { gifs: Gif[]; onCopy: (gif: Gif) => void }) {
  return (
    <section className="gallery" aria-label="GIF results">
      {gifs.map((gif) => {
        const src = gif.preview ?? gif;
        return (
          <button
            key={gif.id}
            type="button"
            className="tile"
            title={gif.description ?? "Copy GIF"}
            onClick={() => onCopy(gif)}
          >
            <img
              src={src.imageUrl}
              width={src.width}
              height={src.height}
              alt={gif.description ?? ""}
              loading="lazy"
            />
          </button>
        );
      })}
    </section>
  );
}

function Toast({ outcome }: { outcome: CopyOutcome | "failed" }) {
  const text =
    outcome === "gif" ? "GIF copied" : outcome === "link" ? "Link copied" : "Copy failed";
  return (
    <div className={"toast" + (outcome === "failed" ? " toast-failed" : "")} role="status">
      {text}
    </div>
  );
}

export function App() {
  const search = useGifSearch();
  const [toast, setToast] = useState<CopyOutcome | "failed" | null>(null);
  const hide = useRef<number | undefined>(undefined);

  useEffect(() => () => clearTimeout(hide.current), []);

  async function copy(gif: Gif) {
    let outcome: CopyOutcome | "failed";
    try {
      outcome = await copyGif(gif);
    } catch {
      outcome = "failed";
    }
    setToast(outcome);
    clearTimeout(hide.current);
    hide.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }

  return (
    <div className="layout">
      <Rail search={search} />
      <Gallery gifs={search.gifs} onCopy={copy} />
      {toast && <Toast outcome={toast} />}
    </div>
  );
}
