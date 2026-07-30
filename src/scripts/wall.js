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

const rows = document.querySelectorAll(".reveal");
if (rows.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  rows.forEach((row) => io.observe(row));
}

// ---- load more ----
const BATCH = 9;
const allRows = [...document.querySelectorAll(".work")];
const loadMoreBtn = document.querySelector(".load-more");
let shown = BATCH;

function applyLoadMore() {
  allRows.forEach((row, i) => {
    row.dataset.beyond = i >= shown ? "true" : "false";
  });
  if (loadMoreBtn) loadMoreBtn.hidden = shown >= allRows.length;
}

if (allRows.length > BATCH) {
  applyLoadMore();
  loadMoreBtn?.addEventListener("click", () => {
    const prevShown = shown;
    shown += BATCH;
    applyLoadMore();
    // mark newly-revealed rows so only THEY animate
    allRows.forEach((row, i) => {
      if (i >= prevShown && i < shown) row.classList.add("load-reveal");
    });
  });
}

// ---- filters ----
const pills = document.querySelectorAll(".pill");
const data = window.__FILTERS || [];

const specialRules = {
  all: () => true,
  web: (w) => w.medium === "web",
  live: (w) => w.live,
  brand: (w) => w.medium === "brand",
};

function matches(key, w) {
  if (specialRules[key]) return specialRules[key](w);
  return w.tags.includes(key);
}

function applyFilter(key, updateURL = true, forceReveal = true) {
  let visibleCount = 0;
  data.forEach((w) => {
    const row = document.getElementById(`work-${w.id}`);
    if (row) {
      const show = matches(key, w);
      row.hidden = !show;
      if (show) {
        visibleCount++;
        if (forceReveal) row.classList.add("is-visible");
      }
    }
  });

  const empty = document.querySelector(".wall-empty");
  if (empty) empty.hidden = visibleCount > 0;

  if (loadMoreBtn) {
    if (key === "all") {
      shown = BATCH;
      applyLoadMore();
    } else {
      allRows.forEach((row) => (row.dataset.beyond = "false"));
      loadMoreBtn.hidden = true;
    }
  }

  pills.forEach((p) => {
    const active = p.dataset.filter === key;
    p.classList.toggle("is-active", active);
    p.setAttribute("aria-pressed", String(active));
  });
  if (updateURL) {
    const url = key === "all" ? location.pathname : `?filter=${key}`;
    history.replaceState(null, "", url);
  }
}

pills.forEach((p) => {
  p.addEventListener("click", () => applyFilter(p.dataset.filter));
});

// restore filter from URL — handles fresh load AND back/forward cache
function restoreFromURL() {
  const initial = new URLSearchParams(location.search).get("filter");
  if (
    initial &&
    (specialRules[initial] || data.some((w) => w.tags.includes(initial)))
  ) {
    applyFilter(initial, false, false);
  } else {
    applyFilter("all", false, false);
  }
}

restoreFromURL();
addEventListener("pageshow", restoreFromURL);
