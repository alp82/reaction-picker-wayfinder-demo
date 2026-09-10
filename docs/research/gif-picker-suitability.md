# Research: is gif-picker-react suitable for search and copy?

Ticket: https://github.com/alp82/reaction-picker-wayfinder-demo/issues/2

## Findings

**Installed picker (`gif-picker-react@2.0.0`).** The `<GifPicker>` component owns its search input; the only external hook is `initialSearchTerm`, which seeds state once (`dist/index.mjs`, `F()`/`I()`). Search runs on a fixed 800 ms `setTimeout` with no stale-response guard, and `onGifClick` only hands back a `Gif` object (`imageUrl`, `preview`, `raw`). It has no clipboard behaviour. So a single query shared with emoji cannot drive the picker without wrapping/forking it.

**KLIPY adapter (`gif-picker-react/providers/klipy`).** `Klipy(appKey)` is a standalone `GifProvider`: `search(term)` calls `GET {baseUrl}/{appKey}/gifs/search?q=&page=1&per_page=50&format_filter=gif`, filters out `type: "ad"`, and returns `Gif[]` with `imageUrl` = the `md` `.gif` variant; `raw.file[hd|md|sm|xs]` also exposes `webp`, `mp4`, `webm`, `jpg`. `onClick` posts the KLIPY share trigger. It is importable and usable without the UI (`dist/providers/klipy/index.mjs`).

**Fetching bytes.** `static.klipy.com` GIF URLs respond with `access-control-allow-origin: *` (checked with `curl -I` and an `Origin` header), so a browser `fetch()` of the original animated bytes works from the local dev origin.

**Clipboard (MDN, WebKit, Chrome primary docs).**
- Spec-mandatory `ClipboardItem` types are `text/plain`, `text/html`, `image/png` only; `image/gif` is not mandatory ([MDN supports()](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem/supports_static)).
- Chromium: standard write is PNG-only; since Chrome 104 a `"web image/gif"` custom format writes unsanitized GIF bytes, readable only by apps that understand web custom formats ([Chrome blog](https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api)). `supports()` since 121, must run inside a user gesture since 107 (MDN BCD).
- Firefox: `clipboard.write()`/`ClipboardItem`/`supports()` since 127, gesture required (MDN BCD); no GIF support documented.
- Safari: `write()` since 13.1 with `text/plain`, `text/html`, `text/uri-list`, `image/png`; gesture required ([WebKit blog](https://webkit.org/blog/10855/async-clipboard-api/)).
- Requires a secure context; `localhost`/`127.0.0.1` qualifies ([MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)).

**Fallback.** `navigator.clipboard.writeText(gif.imageUrl)` works in all three browsers; feedback must say "link copied" vs "GIF copied".

## Recommendation

Build a custom gallery over the `Klipy()` adapter (one shared input, own debounce + stale guard, click-to-copy), not the `<GifPicker>` UI. Copy path: gate on `ClipboardItem.supports("web image/gif")`, else copy the media URL with accurate feedback.
