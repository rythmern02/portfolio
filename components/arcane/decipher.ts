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
  // Runes are wider or narrower than letters; hold the box still so the
  // scramble never reflows the rest of the page.
  const holder = getComputedStyle(el).display === "inline" ? (el.parentElement ?? el) : el;
  const box = holder.getBoundingClientRect();
  holder.style.minHeight = `${box.height}px`;
  holder.style.minWidth = `${box.width}px`;

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
      holder.style.minHeight = "";
      holder.style.minWidth = "";
      running.delete(el);
    }
  };
  running.set(el, requestAnimationFrame(step));
}
