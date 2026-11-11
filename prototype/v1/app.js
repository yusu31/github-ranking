// 星の朝刊 — プロトタイプ v1（使い捨て）。本番に流用しない。
// 外から来た文字（説明・要約）は textContent だけで入れる（AC-37）。innerHTML は使わない。
(function () {
  "use strict";
  const { DATES, START, days, history } = window.PROTO_DATA;
  const $ = (s) => document.querySelector(s);

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat()) if (c != null && c !== false) n.append(c instanceof Node ? c : document.createTextNode(String(c)));
    return n;
  }
  const SVG = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs) => { const n = document.createElementNS(SVG, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const fmt = (n) => n.toLocaleString("ja-JP");
  const LANG_COLOR = { Python: "#3572A5", Rust: "#dea584", TypeScript: "#3178c6", JavaScript: "#e3c341", Go: "#00ADD8", Zig: "#ec915c", HTML: "#e34c26", GLSL: "#5686a5", Markdown: "#6b6b6b", Shell: "#89e051" };

  // ── 保存領域（AC-26〜29）。使えない環境では null を返し、☆を出さない ──
  const store = (() => {
    try {
      const k = "__probe__"; localStorage.setItem(k, "1"); localStorage.removeItem(k);
      return {
        get: (key, def) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } },
        set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* 容量超過など: 黙って諦める */ } },
      };
    } catch { return null; }
  })();
  const KEY = { clips: "gr.clips", lastSent: "gr.lastSent", vault: "gr.vault" };

  // ── 状態 ──
  const params = new URLSearchParams(location.search);
  let state = params.get("state") || "ok";
  let date = DATES.includes(params.get("date")) ? params.get("date") : DATES[DATES.length - 1];
  let topicId = "shadcn";
  let showAll = false;

  function view() {
    const d = structuredClone(days[date]);
    if (state === "stopped") d.trending = { status: "stopped", reason: "robots.txt で /trending が許可されていないため、今日は読みませんでした", items: [] };
    if (state === "failed") d.trending = { status: "failed", reason: "ページの形が変わり、0件しか読めませんでした", items: [] };
    if (state === "nosummary") {
      const strip = (it) => ({ ...it, summary: null });
      d.trending.items = d.trending.items.map(strip);
      d.topics = d.topics.map((t) => ({ ...t, items: t.items.map(strip) }));
      d.summaryNote = "今日は要約の無料枠の上限に達したため、英語の説明を載せています";
    }
    if (state === "stale") d.updatedAt = new Date(Date.now() - 40 * 3600 * 1000).toISOString();
    return d;
  }

  // ── 部品 ──
  function repoLink(repo, cls) {
    const [owner, name] = repo.split("/");
    return el("a", { href: `https://github.com/${repo}`, target: "_blank", rel: "noopener", class: cls }, el("span", { class: "row__owner" }, owner + "/"), name);
  }
  function summary(it) {
    if (it.summary) return el("p", { class: "row__summary" }, el("span", { class: "badge badge--ai", title: "GitHub Models による AI の要約" }, "AI"), it.summary);
    return el("p", { class: "row__summary row__summary--en" }, el("span", { class: "badge badge--none", title: "要約なし。英語の説明を載せています" }, "EN"), it.desc);
  }
  function lang(l) { return el("span", { class: "lang", style: `--dot:${LANG_COLOR[l] || "var(--ink-3)"}` }, l); }

  function starButton(it) {
    if (!store) return null;
    const on = clips().some((c) => c.repo === it.repo);
    return el("button", {
      type: "button", class: "star-btn", "aria-pressed": String(on),
      "aria-label": `${it.repo} を${on ? "切り抜きから外す" : "切り抜く"}`, title: on ? "切り抜きから外す" : "切り抜く（お気に入り）",
      onclick: (e) => { toggleClip(it); const b = e.currentTarget; const now = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(now)); b.textContent = now ? "★" : "☆"; },
    }, on ? "★" : "☆");
  }

  function historyPanel(it) {
    const pts = history(it.repo, it.stars, date);
    const W = 600, H = 96, P = 4;
    const vals = pts.filter((p) => p.stars != null).map((p) => p.stars);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const x = (i) => P + (i / (pts.length - 1)) * (W - P * 2);
    const y = (v) => H - P - ((v - lo) / Math.max(1, hi - lo)) * (H - P * 2);
    const s = svg("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", role: "img", "aria-label": `${it.repo} の★の推移（${START} から）` });
    // 欠けた日は線を切る（うめない: AC-19）
    let dpath = "", pen = false;
    pts.forEach((p, i) => { if (p.stars == null) { pen = false; return; } dpath += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.stars).toFixed(1)}`; pen = true; });
    s.append(svg("path", { d: dpath, fill: "none", stroke: "var(--accent)", "stroke-width": 2, "vector-effect": "non-scaling-stroke", "stroke-linejoin": "round" }));
    pts.forEach((p, i) => {
      if (p.stars == null) s.append(svg("line", { x1: x(i), x2: x(i), y1: P, y2: H - P, stroke: "var(--ink-3)", "stroke-dasharray": "3 3", "vector-effect": "non-scaling-stroke" }));
    });
    const missing = pts.filter((p) => p.stars == null).map((p) => p.date.slice(5).replace("-", "/"));
    return el("div", { class: "history" }, s,
      el("div", { class: "history__cap" },
        el("span", {}, `${START.slice(5).replace("-", "/")} 記録開始 → ${fmt(it.stars)}★`),
        missing.length ? el("span", {}, `点線 = 記録が欠けた日（${missing.join("・")}）`) : null,
        el("a", { href: `https://star-history.com/#${it.repo}&Date`, target: "_blank", rel: "noopener" }, "それより前は star-history で ↗")));
  }

  function row(it, i, kind) {
    const li = el("li", { class: "row", style: `--i:${i}` });
    let open = false, panel = null;
    const histBtn = el("button", { type: "button", class: "hist-btn", "aria-expanded": "false", onclick: () => {
      open = !open; histBtn.setAttribute("aria-expanded", String(open));
      if (open) { panel = historyPanel(it); li.append(panel); } else panel?.remove();
    } }, "★の推移");

    const gain = kind === "topic"
      ? (it.delta == null ? el("span", { class: "badge badge--new", title: "前日の記録が無い" }, "新顔") : el("span", { class: "row__gain" }, `+${fmt(it.delta)}`, el("small", {}, "前日比")))
      : el("span", { class: "row__gain" }, `+${fmt(it.today)}`, el("small", {}, "今日"));

    li.append(
      el("span", { class: "row__rank" }, kind === "topic" ? "" : it.rank),
      el("div", {},
        el("h3", { class: "row__title" }, repoLink(it.repo)),
        summary(it),
        el("div", { class: "row__meta" }, lang(it.lang), el("span", {}, `★ ${fmt(it.stars)}`), histBtn),
        kind === "topic" && it.delta != null ? el("div", { class: "bar", "aria-hidden": "true" }, el("i", { style: `width:${Math.min(100, it.delta / 4.2)}%` })) : null),
      el("div", { class: "row__side" }, gain, starButton(it)),
    );
    return li;
  }

  // ── 描画 ──
  function render() {
    const d = view();
    const updated = new Date(d.updatedAt);
    $("#issue-no").textContent = `第 ${d.issueNo} 号`;
    $("#updated").textContent = `最終更新 ${updated.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;

    const sel = $("#date-select");
    sel.replaceChildren(...DATES.slice().reverse().map((ds) => el("option", { value: ds, selected: ds === date },
      new Date(ds + "T12:00:00+09:00").toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo" }))));
    $("#prev").disabled = DATES.indexOf(date) === 0;
    $("#next").disabled = DATES.indexOf(date) === DATES.length - 1;

    // お知らせ（AC-24・AC-36）
    const notes = [];
    if (Date.now() - updated.getTime() > 36 * 3600 * 1000) notes.push(["更新が止まっています", "最後の更新から36時間を超えました。定期実行が止まっていないか確かめてください（runbook）。"]);
    if (d.trending.status !== "ok") notes.push([d.trending.status === "stopped" ? "Trending 停止" : "Trending 取得失敗", d.trending.reason + "。代わりに公式 API の「最近作られた★急上昇」を載せています。"]);
    if (d.summaryNote) notes.push(["要約なし", d.summaryNote + "。"]);
    $("#notices").replaceChildren(...notes.map(([t, m]) => el("div", { class: "notice", role: "status" }, el("b", {}, t), el("span", {}, m))));

    // Trending（読めない日は代わりのデータ）
    const ok = d.trending.status === "ok";
    const list = ok ? d.trending.items : d.fallback;
    $("#trend-h").firstChild.textContent = ok ? "Trending " : "最近作られた★急上昇 ";
    $("#trend-h small").textContent = ok ? "全言語・今日" : "公式 API・代わり";
    $("#trend-note").textContent = ok ? `${list.length}件` : "Trending の代わり";

    const top = list[0];
    $("#lead-h").textContent = ok ? "一面 ／ Trending 第1位" : "一面 ／ 代わりの第1位";
    const [owner, name] = top.repo.split("/");
    $("#lead-body").replaceChildren(el("article", { class: "lead-story" },
      el("div", { class: "lead-story__rank", "aria-hidden": "true" }, "1"),
      el("div", {},
        el("div", { class: "lead-story__owner" }, owner + " /"),
        el("h3", { class: "lead-story__name" }, el("a", { href: `https://github.com/${top.repo}`, target: "_blank", rel: "noopener" }, name)),
        el("p", { class: "lead-story__deck" }, top.summary || top.desc)),
      el("div", { class: "lead-story__stats" },
        el("div", { class: "lead-story__today" }, `+${fmt(top.today)}`, el("small", {}, "今日の★")),
        el("div", { class: "row__meta" }, lang(top.lang), el("span", {}, `★ ${fmt(top.stars)}`)),
        starButton(top))));

    const rest = list.slice(1);
    const shown = showAll ? rest : rest.slice(0, 9);
    $("#trend-list").replaceChildren(...shown.map((it, i) => row(it, i, "trend")));
    $("#trend-more").hidden = showAll || rest.length <= 9;
    $("#trend-more").textContent = `残り ${rest.length - 9} 件も見る`;

    // 関心領域（AC-07・AC-08）
    $("#topic-tabs").replaceChildren(...d.topics.map((t) => el("button", {
      type: "button", class: "tab", role: "tab", "aria-selected": String(t.id === topicId),
      onclick: () => { topicId = t.id; render(); },
    }, t.label)));
    const t = d.topics.find((x) => x.id === topicId);
    $("#topic-list").replaceChildren(...t.items.slice(0, 10).map((it, i) => row(it, i, "topic")));

    renderClipFab();
  }

  // ── 切り抜き（F-06・F-07） ──
  const clips = () => (store ? store.get(KEY.clips, []) : []);
  function toggleClip(it) {
    const list = clips();
    const i = list.findIndex((c) => c.repo === it.repo);
    if (i >= 0) list.splice(i, 1); else list.push({ repo: it.repo, summary: it.summary || it.desc, addedAt: new Date().toISOString() });
    store.set(KEY.clips, list);
    renderClipFab(true);
  }
  function unsent() {
    const last = store.get(KEY.lastSent, null);
    return clips().filter((c) => !last || c.addedAt > last);
  }
  function renderClipFab(bump) {
    if (!store) return;
    const fab = $("#clip-open");
    fab.hidden = false;
    $("#clip-count").textContent = unsent().length;
    if (bump) { fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump"); }
  }

  function isoWeek(dt) {
    const d = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day);
    const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `${d.getUTCFullYear()}-W${String(Math.ceil(((d - y) / 86400000 + 1) / 7)).padStart(2, "0")}`;
  }
  function noteBody(items) {
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    return ["---", `date: ${today}`, "tags: [github-ranking, 切り抜き]", "---", "",
      `# 切り抜き ${isoWeek(new Date())}`, "",
      ...items.map((c) => `- [${c.repo}](https://github.com/${c.repo}) — ${c.summary}`), ""].join("\n");
  }

  function renderClipbook() {
    const last = store.get(KEY.lastSent, null);
    const fresh = unsent();
    const sent = clips().filter((c) => last && c.addedAt <= last);
    const li = (c, removable) => el("li", {}, el("span", {}, c.repo), removable ? el("button", { type: "button", onclick: () => { toggleClip(c); renderClipbook(); render(); } }, "外す") : null);
    $("#clip-new").replaceChildren(...(fresh.length ? fresh.map((c) => li(c, true)) : [el("li", { class: "empty" }, "まだありません。一覧の ☆ で切り抜けます")]));
    $("#clip-sent").replaceChildren(...sent.map((c) => li(c, false)));
    $("#clip-new-count").textContent = `${fresh.length}件`;
    $("#clip-sent-count").textContent = `${sent.length}件`;
    $("#send").disabled = fresh.length === 0;
    $("#last-sent").textContent = last ? `前回 ${new Date(last).toLocaleDateString("ja-JP")} に送りました` : "まだ一度も送っていません";
    const days7 = last && Date.now() - new Date(last).getTime() >= 7 * 86400000;
    $("#clip-reminder").replaceChildren(days7 && fresh.length ? el("div", { class: "notice" }, el("b", {}, "送る日です"), el("span", {}, "前回から7日以上たちました。")) : "");
    $("#vault").value = store.get(KEY.vault, "");
  }

  const URL_LIMIT = 2000; // 仮の上限（実際に開ける長さは Phase 3 で確かめる: AC-32）
  async function send() {
    const vault = $("#vault").value.trim();
    const msg = $("#send-msg");
    if (!vault) { msg.textContent = "Vault 名を入れてください。"; $("#vault").focus(); return; }
    store.set(KEY.vault, vault);
    const items = unsent();
    const body = noteBody(items);
    const uri = `obsidian://new?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent("github-ranking/切り抜き " + isoWeek(new Date()))}&content=${encodeURIComponent(body)}`;
    if (uri.length > URL_LIMIT) {
      try { await navigator.clipboard.writeText(body); msg.textContent = `リンクが長すぎる（${uri.length}字）ため、ノートの中身をコピーしました。Obsidian に貼り付けてください。`; }
      catch { msg.textContent = "コピーできませんでした。件数を減らしてもう一度試してください。"; return; }
    } else {
      location.href = uri;
      msg.textContent = `${items.length}件を Obsidian に送りました（Obsidian が開きます）。`;
    }
    store.set(KEY.lastSent, new Date().toISOString());
    renderClipbook(); renderClipFab();
  }

  // ── つなぎこみ ──
  $("#prev").addEventListener("click", () => { date = DATES[DATES.indexOf(date) - 1]; showAll = false; render(); });
  $("#next").addEventListener("click", () => { date = DATES[DATES.indexOf(date) + 1]; showAll = false; render(); });
  $("#date-select").addEventListener("change", (e) => { date = e.target.value; showAll = false; render(); });
  $("#trend-more").addEventListener("click", () => { showAll = true; render(); });
  $("#clip-open").addEventListener("click", () => { renderClipbook(); $("#clipbook").showModal(); });
  $("#send").addEventListener("click", send);

  document.querySelectorAll(".proto button").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.state === "remind") {
      if (!store) return;
      // 見本: 前回送ったのが8日前で、その後に2件足した状態にする
      const past = new Date(Date.now() - 8 * 86400000).toISOString();
      store.set(KEY.lastSent, past);
      const it = days[date].trending.items;
      store.set(KEY.clips, [{ repo: it[3].repo, summary: it[3].summary, addedAt: past.replace(/T.*/, "T00:00:00.000Z") }, ...[1, 2].map((k) => ({ repo: it[k].repo, summary: it[k].summary, addedAt: new Date().toISOString() }))]);
      render(); renderClipbook(); $("#clipbook").showModal();
      return;
    }
    state = b.dataset.state;
    document.querySelectorAll(".proto button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));
  document.querySelector(`.proto button[data-state="${state}"]`)?.setAttribute("aria-pressed", "true");
  if (state !== "ok") document.querySelector('.proto button[data-state="ok"]').setAttribute("aria-pressed", "false");

  render();
})();
