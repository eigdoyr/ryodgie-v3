function smoothScrollTo(targetY, duration = 2000) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrollTo(0, targetY);
    return;
  }
  const start = scrollY;
  const distance = targetY - start;
  const startTime = performance.now();
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    scrollTo(0, start + distance * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href").slice(1);
    const target = id === "top" ? null : document.getElementById(id);

    if (id !== "top" && !target) return;

    e.preventDefault();
    const targetY =
      id === "top" ? 0 : target.getBoundingClientRect().top + scrollY;
    smoothScrollTo(targetY);
  });
});
