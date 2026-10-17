"use client";

/** Coordena a abertura (Preloader) com as animações de entrada do hero. */
const EVENT = "lq:intro-done";
let done = false;

export function markIntroDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(callback: () => void) {
  if (done) {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}
