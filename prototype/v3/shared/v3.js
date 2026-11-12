// v3 の共通部品（使い捨て）。v2 の shared/data.js・common.js の上に足す。
// - identicon: GitHub がアバター未設定の人に付ける「左右対称の 5×5 の模様」と同じ作り方。
//   本番では持ち主の本物のアバター（github.com/{owner}.png）を使う。仮データなのでここでは模様で代える
// - 順位の変動: 前日の記録と比べる（前日に無ければ「NEW」）
(function () {
  const P = window.PROTO;
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }

  function identicon(name, size, radius) {
    const h = hash(name);
    const hue = h % 360, sat = 45 + (h >>> 9) % 25, lig = 48 + (h >>> 14) % 12;
    const fg = `hsl(${hue} ${sat}% ${lig}%)`;
    const cell = size / 6, pad = cell / 2;
    const s = P.svg("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, "aria-hidden": "true", class: "ident" });
    s.append(P.svg("rect", { width: size, height: size, rx: radius ?? size * 0.22, fill: "#f0f0f0" }));
    let bits = h ^ hash(name + "#");
    for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) {
      const on = (bits >>> (y * 3 + x)) & 1;
      if (!on) continue;
      for (const xx of x === 2 ? [2] : [x, 4 - x]) s.append(P.svg("rect", { x: pad + xx * cell, y: pad + y * cell, width: cell + 0.5, height: cell + 0.5, fill: fg }));
    }
    return s;
  }
  const owner = (repo) => repo.split("/")[0];
  const name = (repo) => repo.split("/")[1];

  // 前日の順位との差: 正＝上がった
  function change(repo) {
    const i = P.data.DATES.indexOf(P.date);
    if (i <= 0) return { kind: "new" };
    const prev = P.data.days[P.data.DATES[i - 1]].trending.items.find((x) => x.repo === repo);
    const cur = P.day.trending.items.find((x) => x.repo === repo);
    if (!prev || !cur) return { kind: "new" };
    const d = prev.rank - cur.rank;
    return d > 0 ? { kind: "up", n: d } : d < 0 ? { kind: "down", n: -d } : { kind: "same" };
  }
  function changeEl(repo, cls) {
    const c = change(repo);
    const t = c.kind === "new" ? "NEW" : c.kind === "up" ? "▲" + c.n : c.kind === "down" ? "▼" + c.n : "―";
    return P.el("span", { class: (cls || "chg") + " " + c.kind, title: c.kind === "new" ? "前日の Trending に無かった" : "前日からの順位の変化" }, t);
  }

  // 数字のカウントアップ（reduced-motion では即表示）
  function countUp(node, to, prefix, ms) {
    const text = (v) => (prefix || "") + P.fmt(Math.round(v));
    if (P.reduced()) { node.textContent = text(to); return; }
    const t0 = performance.now(), dur = ms || 700;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      node.textContent = text(to * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // GitHub の言語の色（linguist の実際の色）
  const LANG = { Python: "#3572A5", TypeScript: "#3178c6", JavaScript: "#f1e05a", Rust: "#dea584", Go: "#00ADD8", Zig: "#ec915c", Markdown: "#083fa1", Shell: "#89e051", HTML: "#e34c26" };
  const langColor = (l) => LANG[l] || "#8b949e";

  window.V3 = { identicon, owner, name, change, changeEl, countUp, langColor, hash };
})();
