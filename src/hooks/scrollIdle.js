// Lets heavy decorative loops pause while the page is scrolling and resume when it settles.
const subs = new Set();
let scrolling = false;
let timer;

if (typeof window !== "undefined") {
  window.addEventListener(
    "scroll",
    () => {
      if (!scrolling) {
        scrolling = true;
        subs.forEach((fn) => fn(true));
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        scrolling = false;
        subs.forEach((fn) => fn(false));
      }, 160);
    },
    { passive: true }
  );
}

export const onScrollingChange = (fn) => {
  subs.add(fn);
  return () => subs.delete(fn);
};
