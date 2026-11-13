// 4案で共通の小さな部品（使い捨てのプロトタイプ用）。
// - 文字は必ず textContent で入れる（説明に HTML が混ざっても文字として出す: AC-37）
// - お気に入りはブラウザの保存領域。使えない環境でも画面は壊さない（AC-27）
(function () {
  const D = window.PROTO_DATA;
  const params = new URLSearchParams(location.search);
  const state = params.get("state") === "stale" ? "stale" : "ok";
  let current = D.DATES.includes(params.get("d")) ? params.get("d") : D.DATES[D.DATES.length - 1];
  const listeners = [];

  function setDate(d) {
    if (!D.DATES.includes(d) || d === current) return;
    current = d;
    params.set("d", d);
    try { history.replaceState(null, "", "?" + params.toString()); } catch (e) { /* file:// で失敗しても続ける */ }
    listeners.forEach((fn) => fn(d));
  }
  function step(n) {
    const i = D.DATES.indexOf(current) + n;
    if (i >= 0 && i < D.DATES.length) setDate(D.DATES[i]);
  }

  const KEY = "gr-proto-v2-fav";
  let favMem = [];
  let storageOk = true;
  try { favMem = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { storageOk = false; }
  const fav = {
    available: () => storageOk,
    has: (repo) => favMem.includes(repo),
    toggle(repo) {
      favMem = favMem.includes(repo) ? favMem.filter((r) => r !== repo) : favMem.concat(repo);
      try { localStorage.setItem(KEY, JSON.stringify(favMem)); } catch (e) { storageOk = false; }
      return favMem.includes(repo);
    },
    count: () => favMem.length,
  };

  // el("div", { class: "x", onclick: fn }, "文字", el(...))
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat()) {
      if (c == null || c === false) continue;
      n.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return n;
  }
  function svg(tag, attrs, ...kids) {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) n.setAttribute(k, v);
    for (const c of kids.flat()) if (c != null) n.append(c instanceof Node ? c : document.createTextNode(String(c)));
    return n;
  }

  const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));
  const WD = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = (d) => WD[new Date(d + "T00:00:00+09:00").getDay()];
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.PROTO = {
    data: D,
    state,
    get date() { return current; },
    get day() { return D.days[current]; },
    setDate, step,
    onDate: (fn) => listeners.push(fn),
    hasPrev: () => D.DATES.indexOf(current) > 0,
    hasNext: () => D.DATES.indexOf(current) < D.DATES.length - 1,
    history: (repo, stars) => D.history(repo, stars, current),
    fav, el, svg, fmt, weekday, reduced,
  };
})();
