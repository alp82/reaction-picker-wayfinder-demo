import { useEffect, useRef, useState } from "react";
import { provider, type Gif } from "./provider";

export const DEBOUNCE_MS = 300;
export const PAGE_SIZE = 24;

export type SearchStatus = "idle" | "loading" | "ok" | "error";

export type GifSearch = {
  query: string;
  setQuery: (q: string) => void;
  gifs: Gif[];
  status: SearchStatus;
  retry: () => void;
};

/** One query at a time, searched as you type with a debounce and a stale-response guard. */
export function useGifSearch(): GifSearch {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    const term = query.trim();
    const mine = ++latest.current;
    if (!term) {
      setGifs([]);
      setStatus("idle");
      return;
    }
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const results = await provider.search(term);
        if (mine !== latest.current) return; // a newer query superseded this one
        setGifs(results.slice(0, PAGE_SIZE));
        setStatus("ok");
      } catch {
        if (mine !== latest.current) return;
        setStatus("error");
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, attempt]);

  return { query, setQuery, gifs, status, retry: () => setAttempt((n) => n + 1) };
}
