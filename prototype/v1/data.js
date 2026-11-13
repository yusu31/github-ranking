// 仮データ（使い捨てのプロトタイプ用）。リポジトリ名・数値はすべて架空。
// 形は features.md の F-01〜F-04 を想定した「1日分 = 1つの記録」。
(function () {
  let seed = 20261112;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (n) => Math.floor(rnd() * n);

  // [リポジトリ, 英語の説明, 日本語の1行要約, 言語]
  const TRENDING_POOL = [
    ["lumen-labs/agentsmith", "A framework for building autonomous coding agents with tool use and long-term memory.", "道具の呼び出しと長期の記憶を持つ、自律型コーディングエージェントの枠組み", "Python"],
    ["kirin-dev/tinyvec", "Embedded vector database in a single file. No server, no setup.", "サーバー不要・1ファイルで動く組み込みのベクトルDB", "Rust"],
    ["openfield/plotline", "Turn any CSV into an interactive chart from the terminal.", "CSV を端末から対話的なグラフにする道具", "TypeScript"],
    ["northwind-ai/voice-loop", "Real-time voice agent pipeline with sub-300ms latency.", "300ms 以下で応答する、リアルタイムの音声エージェントの仕組み", "Python"],
    ["hollow-io/shellmate", "AI pair programmer that lives in your shell history.", "シェルの履歴から学ぶ、端末の中の AI 相棒", "Go"],
    ["paperplane/docsmith", "Generate API docs from your tests, not your comments.", "コメントではなく試験コードから API の説明書を作る", "TypeScript"],
    ["mizu-team/kumo-ui", "Accessible headless components with zero runtime CSS.", "実行時の CSS が0の、アクセシブルな見た目なし部品集", "TypeScript"],
    ["fernhill/gridwise", "A spreadsheet engine you can embed in any web app.", "どの Web アプリにも埋め込める表計算エンジン", "TypeScript"],
    ["astro-bento/bento-cli", "Scaffold full-stack apps from a single YAML file.", "YAML 1枚からフルスタックのアプリの骨組みを作る", "Go"],
    ["deepcove/promptlab", "Version control and A/B testing for LLM prompts.", "LLM のプロンプトの版管理と A/B 試験", "Python"],
    ["tanuki-soft/edge-cache", "Drop-in edge cache for serverless functions.", "サーバーレス関数に差し込むだけのエッジのキャッシュ", "Rust"],
    ["rivet-works/mdx-slides", "Write slide decks in MDX, present in the browser.", "MDX でスライドを書き、ブラウザで発表する", "JavaScript"],
    ["quietbyte/logsieve", "Find the one log line that matters, locally and fast.", "大量のログから大事な1行を手元で素早く探す", "Rust"],
    ["sora-lab/screen-agent", "Let an LLM operate your desktop through screenshots.", "画面の撮影を通して LLM にデスクトップを操作させる", "Python"],
    ["brightpath/typed-env", "Type-safe environment variables with zero dependencies.", "依存0で型安全な環境変数の読み込み", "TypeScript"],
    ["moss-and-co/ink-terminal", "A GPU-accelerated terminal with built-in AI search.", "AI 検索つきの、GPU で速い端末", "Zig"],
    ["harbor-oss/k8s-lite", "Kubernetes for a single machine, in 40MB.", "40MB で動く、1台用の Kubernetes", "Go"],
    ["yuzu-labs/ocr-anything", "Local OCR for screenshots, PDFs and handwriting.", "画面の撮影・PDF・手書きを手元で文字にする OCR", "Python"],
    ["coldbrew/queue-kit", "Postgres-backed job queue with a dashboard.", "Postgres の上で動く、画面つきのジョブの待ち行列", "TypeScript"],
    ["maple-dev/svg-morph", "Smooth morphing between any two SVG paths.", "2つの SVG の形をなめらかに変形させる", "JavaScript"],
    ["gearbox/sql-notebook", "Notebook-style SQL editor that runs in the browser.", "ブラウザで動く、ノート形式の SQL エディタ", "TypeScript"],
    ["owlnest/mail-agent", "Triage your inbox with a local LLM.", "手元の LLM で受信箱を仕分ける", "Python"],
    // AC-37 の見本: 説明に HTML が混ざっていても、文字としてだけ表示されること
    ["evilcorp-demo/xss-sample", "Totally normal repo <img src=x onerror=alert('xss')> <script>alert(1)</script>", "説明に HTML の断片を含む見本（文字として表示されれば正しい）", "HTML"],
    ["pebble-ai/eval-harness", "Benchmark your agents on real-world tasks.", "エージェントを実際の作業で採点する仕組み", "Python"],
    ["lantern/rss-reader", "A fast, keyboard-first RSS reader.", "キーボード中心の速い RSS リーダー", "Rust"],
  ];

  const TOPICS = [
    { id: "shadcn", label: "shadcn/ui", pool: [
      ["kumo-ui/blocks", "Copy-paste page blocks built on shadcn/ui.", "shadcn/ui で作った、コピペで使えるページの部品", "TypeScript"],
      ["fernhill/shadcn-charts-plus", "More chart types for shadcn/ui.", "shadcn/ui 向けのグラフの種類を増やす", "TypeScript"],
      ["ui-garden/theme-forge", "Visual theme editor that exports shadcn tokens.", "見ながら色を決め、shadcn の設定に書き出す", "TypeScript"],
      ["lilac-dev/form-kit", "Schema-driven forms for shadcn/ui and zod.", "zod の定義から shadcn/ui のフォームを作る", "TypeScript"],
      ["openfield/table-pro", "Virtualized data table with shadcn styling.", "大量の行でも軽い、shadcn 風の表", "TypeScript"],
      ["nami-studio/motion-ui", "Animated variants of shadcn components.", "shadcn の部品に動きを付けた版", "TypeScript"],
    ]},
    { id: "gsap", label: "GSAP", pool: [
      ["scrollcraft/scenes", "Scroll-driven storytelling presets for GSAP.", "GSAP でスクロールに合わせて物語を見せる型", "JavaScript"],
      ["maple-dev/split-reveal", "Text reveal effects with SplitText.", "SplitText で文字を出す演出集", "JavaScript"],
      ["tempo-lab/gsap-react-kit", "Hooks and components for GSAP in React.", "React で GSAP を使うためのフックと部品", "TypeScript"],
      ["inkwell/flip-gallery", "Flip-based gallery transitions.", "Flip で画像一覧を切り替える動き", "JavaScript"],
      ["parallax-co/depth", "Layered parallax with ScrollTrigger.", "ScrollTrigger で奥行きのある視差を作る", "JavaScript"],
    ]},
    { id: "threejs", label: "Three.js", pool: [
      ["voxelpark/tiny-world", "Procedural low-poly worlds in Three.js.", "Three.js で手続き的にローポリの世界を作る", "JavaScript"],
      ["lumen-labs/gltf-slim", "Shrink glTF files by 80% with one command.", "glTF を1コマンドで約8割小さくする", "TypeScript"],
      ["nebula-gl/shader-park", "A playground of copy-paste shaders.", "コピペで使えるシェーダーの遊び場", "GLSL"],
      ["harbor-oss/r3f-physics", "Physics helpers for react-three-fiber.", "react-three-fiber の物理演算の助け", "TypeScript"],
      ["sora-lab/splat-viewer", "Gaussian splat viewer for the web.", "Web で動くガウシアンスプラットの表示", "TypeScript"],
      ["kirin-dev/webgpu-starter", "Three.js WebGPU renderer starter kit.", "Three.js の WebGPU 描画を始めるひな形", "JavaScript"],
    ]},
    { id: "phaser", label: "Phaser", pool: [
      ["pixelfox/phaser-tilemap-kit", "Tilemap tools and editors for Phaser 4.", "Phaser 4 のタイルマップの道具と編集画面", "TypeScript"],
      ["arcade-lab/juice", "Screen shake, hit stop and more for Phaser.", "画面の揺れ・ヒットストップなど手触りの演出", "TypeScript"],
      ["kaplay-friends/jam-template", "Game jam template with Phaser and Vite.", "Phaser と Vite のゲームジャム用ひな形", "TypeScript"],
      ["owlnest/dialog-tree", "Branching dialogue system for 2D games.", "2D ゲームの分岐する会話の仕組み", "TypeScript"],
    ]},
    { id: "claude", label: "Claude Code", pool: [
      ["skillshelf/awesome-skills", "Curated Claude Code skills.", "Claude Code のスキルを選りすぐった一覧", "Markdown"],
      ["mcp-tools/mcp-browser", "MCP server that drives a real browser.", "本物のブラウザを操作する MCP サーバー", "TypeScript"],
      ["quietbyte/hooks-cookbook", "Recipes for Claude Code hooks.", "Claude Code の hook の作り方集", "Python"],
      ["deepcove/mcp-postgres", "Read-only Postgres MCP server.", "読み取り専用の Postgres 用 MCP サーバー", "Go"],
      ["paperplane/subagent-kit", "Reusable subagent definitions.", "使い回せるサブエージェントの定義集", "Markdown"],
      ["northwind-ai/statusline-pro", "Rich statuslines for Claude Code.", "Claude Code の状態表示を豊かにする", "Shell"],
    ]},
  ];

  const DATES = ["2026-11-10", "2026-11-11", "2026-11-12"];
  const START = "2026-11-01"; // 記録を取り始めた日（これより前は遡らない: AC-18）
  const MISSING = "2026-11-07"; // 記録が欠けた日の見本（AC-19）

  const toItem = ([repo, desc, summary, lang]) => ({ repo, desc, summary, lang });

  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = pick(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  const days = {};
  DATES.forEach((date, di) => {
    const trend = shuffled(TRENDING_POOL).map(toItem).map((it, i) => ({
      ...it,
      rank: i + 1,
      stars: 800 + pick(42000),
      today: Math.max(40, Math.round(2400 / (i + 1.4)) + pick(160)),
    }));
    const topics = TOPICS.map((t) => ({
      id: t.id,
      label: t.label,
      items: shuffled(t.pool).map(toItem).map((it, i) => ({
        ...it,
        stars: 300 + pick(18000),
        // 最終日の最後の1件は「新顔」（前日の記録が無い: AC-08）
        delta: di === DATES.length - 1 && i === t.pool.length - 1 ? null : 5 + pick(420),
      })).sort((a, b) => (b.delta ?? -1) - (a.delta ?? -1)),
    }));
    days[date] = {
      date,
      issueNo: di + 10,
      updatedAt: `${date}T06:2${di}:00+09:00`,
      trending: { status: "ok", items: trend },
      topics,
      // Trending が読めない日の代わり（AC-03）: 公式 API の「最近作られた★急上昇」
      fallback: shuffled(TRENDING_POOL).slice(0, 8).map(toItem).map((it, i) => ({ ...it, rank: i + 1, stars: 200 + pick(3000), today: 300 - i * 30 })),
    };
  });

  // ★の推移（AC-17〜19）: リポジトリ名から決まる、架空の増え方
  function history(repo, starsNow, upto) {
    let h = 0;
    for (const c of repo) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const pts = [];
    const end = new Date(upto + "T00:00:00+09:00");
    const start = new Date(START + "T00:00:00+09:00");
    const n = Math.round((end - start) / 86400000);
    for (let i = 0; i <= n; i++) {
      const d = new Date(start.getTime() + i * 86400000);
      const iso = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
      const growth = ((h >> (i % 16)) & 7) + 2;
      pts.push({ date: iso, stars: iso === MISSING ? null : Math.round(starsNow * (0.72 + 0.28 * Math.pow(i / n, 1.6))) - growth });
    }
    pts[pts.length - 1].stars = starsNow;
    return pts;
  }

  window.PROTO_DATA = { DATES, START, days, history };
})();
