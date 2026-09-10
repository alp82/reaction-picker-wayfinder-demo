// PROTOTYPE (ticket #4): throwaway. Shared search + copy logic so the three
// UI variants only disagree about layout, not behaviour.
import { useEffect, useRef, useState } from "react";
import { Klipy, KlipyQuality } from "gif-picker-react/providers/klipy";
import type { Gif } from "gif-picker-react";

const provider = Klipy(import.meta.env.VITE_GIF_API_KEY ?? "", {
  quality: KlipyQuality.HD,
  previewQuality: KlipyQuality.SM,
});

export type CopyOutcome = "gif" | "link";
export type Status = "idle" | "loading" | "ok" | "error";

export function canCopyAnimated(): boolean {
  const CI = (globalThis as any).ClipboardItem;
  return !!CI?.supports?.("web image/gif");
}

export function useGifSearch() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState<{ id: string; outcome: CopyOutcome } | null>(null);
  const seq = useRef(0);
  const [tick, setTick] = useState(0); // Retry bumps this

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setGifs([]);
      setStatus("idle");
      return;
    }
    const my = ++seq.current;
    const t = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await provider.search(term);
        if (my !== seq.current) return; // stale
        setGifs(res.slice(0, 24));
        setStatus("ok");
      } catch {
        if (my !== seq.current) return;
        setStatus("error");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, tick]);

  async function copy(gif: Gif) {
    let outcome: CopyOutcome = "link";
    try {
      if (canCopyAnimated()) {
        const blob = fetch(gif.imageUrl).then((r) => r.blob());
        await navigator.clipboard.write([
          new ClipboardItem({ "web image/gif": blob } as any),
        ]);
        outcome = "gif";
      } else {
        await navigator.clipboard.writeText(gif.imageUrl);
      }
    } catch {
      await navigator.clipboard.writeText(gif.imageUrl);
    }
    setCopied({ id: gif.id, outcome });
    setTimeout(() => setCopied((c) => (c?.id === gif.id ? null : c)), 1200);
  }

  return { query, setQuery, gifs, status, copied, copy, retry: () => setTick((n) => n + 1) };
}
