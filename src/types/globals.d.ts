export {};

declare global {
  interface Window {
    /** Google AdSense render queue — each `<ins class="adsbygoogle">` needs one push. */
    adsbygoogle: Record<string, unknown>[];
  }
}
