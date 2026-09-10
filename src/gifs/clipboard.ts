import type { Gif } from "./provider";

/** Which of the two copy outcomes happened (see CONTEXT.md, "Copy"). */
export type CopyOutcome = "gif" | "link";

const ANIMATED_GIF_TYPE = "web image/gif";

/** True only where the clipboard accepts animated GIF bytes (Chromium 104+). */
export function canCopyAnimatedGif(): boolean {
  const item = globalThis.ClipboardItem as
    | (typeof ClipboardItem & { supports?: (type: string) => boolean })
    | undefined;
  return item?.supports?.(ANIMATED_GIF_TYPE) === true;
}

/**
 * Copies the original rendition: animated bytes where supported, else the media URL.
 * Falls back to the URL if the byte copy fails. Throws only if even that fails.
 */
export async function copyGif(gif: Gif): Promise<CopyOutcome> {
  if (canCopyAnimatedGif()) {
    try {
      // Pass the promise, not the awaited blob: the write must stay inside the click gesture.
      const bytes = fetch(gif.imageUrl).then((r) => {
        if (!r.ok) throw new Error(`GIF fetch failed: ${r.status}`);
        return r.blob();
      });
      await navigator.clipboard.write([
        new ClipboardItem({ [ANIMATED_GIF_TYPE]: bytes } as Record<string, Promise<Blob>>),
      ]);
      return "gif";
    } catch {
      // fall through to the link
    }
  }
  await navigator.clipboard.writeText(gif.imageUrl);
  return "link";
}
