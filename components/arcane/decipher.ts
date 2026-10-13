// Text "deciphers" from runes into letters, left to right. Works on an element
// whose real text lives in data-decipher; screen readers get a separate
// sr-only copy, so the element itself is aria-hidden.

const POOL = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ✦◎⟠";
const running = new WeakMap<HTMLElement, number>();

export function decipher(el: HTMLElement, duration = 900) {
  const text = el.dataset.decipher ?? el.textContent ?? "";
  const prev = running.get(el);
  if (prev) cancelAnimationFrame(prev);
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const settled = Math.floor(t * text.length);
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (i < settled || c === " " || c === "'") out += c;
      else out += POOL[(Math.random() * POOL.length) | 0];
    }
    el.textContent = out;
    if (t < 1) running.set(el, requestAnimationFrame(step));
    else {
      el.textContent = text;
      running.delete(el);
    }
  };
  running.set(el, requestAnimationFrame(step));
}
