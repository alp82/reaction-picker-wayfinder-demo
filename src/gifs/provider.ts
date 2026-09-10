import { Klipy, KlipyQuality } from "gif-picker-react/providers/klipy";
import type { Gif, GifProvider } from "gif-picker-react";

export type { Gif };

/** KLIPY search adapter from gif-picker-react, used without its `<GifPicker>` UI.
 *  HD is the copy rendition; SM is the tile preview. */
export const provider: GifProvider = Klipy(import.meta.env.VITE_GIF_API_KEY ?? "", {
  quality: KlipyQuality.HD,
  previewQuality: KlipyQuality.SM,
});

export const hasApiKey = Boolean(import.meta.env.VITE_GIF_API_KEY);
