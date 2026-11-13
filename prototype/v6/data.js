// v6 の仮データ（使い捨て）。リポジトリ名・数値・解説はすべて架空。
// 本番の想定: 1件につき GitHub Models を1回呼び、分類・1行・解説・いい所・気になる所・できること を JSON でまとめて作る。
// 前日までに作ったリポジトリは使い回す（呼び出し回数は Phase 3 で無料枠と照らして決める）。
(function () {
  const CATS = [
    { id: "agent", label: "AIエージェント", short: "AI", feats: ["手元のPCで動く", "無料で使える", "MCP につながる", "画面（GUI）がある", "日本語で指示できる"] },
    { id: "ui", label: "UI・アニメ", short: "UI", feats: ["React で使える", "shadcn/ui と合う", "動き（アニメ）", "キーボード・読み上げ対応", "追加の依存が少ない"] },
    { id: "game", label: "3D・ゲーム", short: "3D", feats: ["ブラウザで動く", "スマホでも軽い", "物理・当たり判定", "編集画面がある", "資料が多い"] },
    { id: "dev", label: "開発の道具", short: "道具", feats: ["端末で使う", "設定なしで動く", "Windows で動く", "速い（Rust/Zig 等）", "AI と連携"] },
    { id: "data", label: "データ・基盤", short: "DB", feats: ["PC 1台で動く", "SQL で扱える", "無料（OSS）", "クラウド不要", "覚えることが少ない"] },
  ];

  // 関心領域（本番は本人と Phase 3 で決める）
  const INTERESTS = ["Claude Code", "shadcn/ui", "GSAP", "Three.js", "Phaser"];

  // prev: 前日の順位（null＝新顔）／streak: 連続登場日数／can: 分類ごとの feats に対して 2＝◎ 1＝△ 0＝—
  const RAW = [
    { repo: "lumen-labs/agentsmith", cat: "agent", lang: "Python", stars: 18420, today: 2140, prev: 3, streak: 4, interest: null,
      one: "道具を使い、記憶を持ち続ける AI 開発エージェントの枠組み",
      what: "AI に「ファイルを読む・コマンドを打つ・調べる」といった道具を持たせ、何日もかかる作業を覚えたまま進めさせるための土台。自分専用の Claude Code のようなものを組み立てられる。",
      pros: ["記憶を保存する仕組みが最初から入っている", "道具を Python の関数で足せる"],
      cons: ["動かすには有料の LLM の鍵が要る", "設定の項目が多く、最初の1時間は読むだけ"],
      can: [1, 1, 2, 0, 2], idea: "毎朝の要約づくりを、決まった手順で回すエージェントにできる" },
    { repo: "moss-and-co/ink-terminal", cat: "dev", lang: "Zig", stars: 22310, today: 1760, prev: 1, streak: 15, interest: null,
      one: "AI 検索つきの、GPU で速い端末",
      what: "コマンドを打つ黒い画面（端末）を GPU で描き、出力が多くても引っかからない。「あのコマンド何だっけ」を日本語で聞くと候補を出す。",
      pros: ["大量のログでも滑らかに流れる", "AI への質問が端末の中で完結する"],
      cons: ["Windows 版はまだ試験版", "AI の機能は鍵の設定が要る"],
      can: [2, 1, 1, 2, 2], idea: "Claude Code を動かす端末を軽くする" },
    { repo: "mcp-tools/mcp-browser", cat: "agent", lang: "TypeScript", stars: 6210, today: 1520, prev: null, streak: 1, interest: "Claude Code",
      one: "本物のブラウザを AI から操作できる MCP サーバー",
      what: "MCP（AI と道具をつなぐ共通の差し込み口）を通して、AI がブラウザを開き、クリックし、画面を撮れるようにする。見た目の確認や調べものを AI に任せられる。",
      pros: ["Claude Code に設定1行で足せる", "画面の撮影と文字の読み取りを両方返す"],
      cons: ["ログインが要るサイトは手作業が残る", "動かしている間ブラウザを1つ占有する"],
      can: [2, 2, 2, 0, 2], idea: "作ったページの見た目チェックを AI に自動でやらせる" },
    { repo: "voxelpark/tiny-world", cat: "game", lang: "JavaScript", stars: 8120, today: 1340, prev: 7, streak: 3, interest: "Three.js",
      one: "Three.js で、ローポリの小さな世界を自動で作る",
      what: "木・岩・家を置いた小さな島を、乱数から毎回ちがう形で生成する。3D の背景やゲームの舞台をすぐ用意できる。",
      pros: ["種の数字を変えるだけで別の島ができる", "glTF で書き出して他の道具でも使える"],
      cons: ["色味が単調になりやすい", "大きな世界にすると重い"],
      can: [2, 1, 0, 1, 1], idea: "ポートフォリオの背景に、訪れるたび変わる島を置く" },
    { repo: "sora-lab/screen-agent", cat: "agent", lang: "Python", stars: 9870, today: 1180, prev: 2, streak: 6, interest: null,
      one: "画面の撮影を見て、AI がパソコンを操作する",
      what: "画面を撮る → AI が何があるか読む → マウスとキーボードを動かす、をくり返す。API の無いアプリでも AI に操作させられる。",
      pros: ["API の無い古いアプリでも動く", "操作の記録を動画で残せる"],
      cons: ["1手ごとに数秒かかり遅い", "押し間違いがあるので見張りが要る"],
      can: [2, 1, 1, 2, 1], idea: "毎週の決まった画面操作（集計の書き出しなど）を任せる" },
    { repo: "kirin-dev/tinyvec", cat: "data", lang: "Rust", stars: 11760, today: 1090, prev: 4, streak: 10, interest: null,
      one: "サーバー不要・1ファイルで動く、意味で探せるデータベース",
      what: "文章の「意味の近さ」で探すためのデータベース（ベクトルDB）を、アプリの中に1ファイルで埋め込める。手元の文書を AI に探させる仕組み（RAG）の土台。",
      pros: ["サーバーを立てずに使える", "数百万件でも検索が速い"],
      cons: ["複数の人が同時に書き込むのは苦手", "SQL は使えない"],
      can: [2, 0, 2, 2, 1], idea: "Obsidian のノートを、言葉の意味で探せるようにする" },
    { repo: "mizu-team/kumo-ui", cat: "ui", lang: "TypeScript", stars: 15230, today: 980, prev: 5, streak: 12, interest: null,
      one: "見た目を持たない、使いやすさだけの部品集",
      what: "ボタン・メニュー・ダイアログの「動き」と「キーボード操作・読み上げ対応」だけを用意し、見た目は自分で付ける。デザインを自由にしたいときの土台。",
      pros: ["読み上げ・キーボード操作に最初から対応", "CSS を持たないので見た目を縛られない"],
      cons: ["見た目は全部自分で作る", "部品の数はまだ少ない"],
      can: [2, 1, 1, 2, 2], idea: "独自のデザインでも、操作のしやすさを落とさない" },
    { repo: "kumo-ui/blocks", cat: "ui", lang: "TypeScript", stars: 3980, today: 860, prev: null, streak: 1, interest: "shadcn/ui",
      one: "shadcn/ui で組んだ、コピペで使える LP の区画",
      what: "料金表・よくある質問・ヒーローなど、LP によくある区画を shadcn/ui で組んだ見本集。コピーして貼れば、そのまま自分の部品になる。",
      pros: ["shadcn/ui と同じ書き方で馴染む", "Tailwind の設定をそのまま使える"],
      cons: ["そのまま使うと見た目が似通う（AI感の元）", "動きはほぼ入っていない"],
      can: [2, 2, 0, 1, 1], idea: "LP の骨組みを30分で置き、見た目づくりに時間を回す" },
    { repo: "scrollcraft/scenes", cat: "ui", lang: "JavaScript", stars: 5410, today: 720, prev: 13, streak: 2, interest: "GSAP",
      one: "GSAP で、スクロールに合わせて物語を見せる型",
      what: "スクロールに合わせて文字や絵が出る・止まる・入れ替わる演出を、型として呼び出せる。ScrollTrigger の書き方を一から覚えなくても動く。",
      pros: ["よくある演出が10種類以上そろう", "GSAP の公式の書き方に沿っている"],
      cons: ["型どおりだと既視感が出る", "スマホで重くなる演出がある"],
      can: [1, 0, 2, 1, 1], idea: "作品紹介ページの「章ごとに流れる」見せ方に使う" },
    { repo: "arcade-lab/juice", cat: "game", lang: "TypeScript", stars: 3150, today: 690, prev: null, streak: 1, interest: "Phaser",
      one: "画面の揺れ・一瞬の停止など、ゲームの手触りの演出集",
      what: "攻撃が当たった瞬間に画面を揺らす・一瞬止める・光らせる、といった気持ちよさの演出を1行で付けられる。",
      pros: ["Phaser 4 にそのまま足せる", "強さを数値で細かく調整できる"],
      cons: ["Phaser 以外では使えない", "やりすぎると画面酔いする"],
      can: [2, 2, 1, 0, 1], idea: "作ったゲームの攻撃や得点に、気持ちよさを足す" },
    { repo: "skillshelf/awesome-skills", cat: "agent", lang: "Markdown", stars: 4320, today: 640, prev: 9, streak: 3, interest: "Claude Code",
      one: "Claude Code のスキルを選りすぐった一覧",
      what: "Claude Code に覚えさせる手順書（スキル）の良いものを、用途別に集めたリスト。自分で一から書く前に、人の書き方を学べる。",
      pros: ["用途別に並んでいて探しやすい", "1つずつ説明と作者が付いている"],
      cons: ["質にばらつきがある", "中身はコードではなくリンク集"],
      can: [2, 2, 1, 0, 1], idea: "自分のスキルの書き方を、上位のスキルと見比べて直す" },
    { repo: "sora-lab/splat-viewer", cat: "game", lang: "TypeScript", stars: 6740, today: 520, prev: 6, streak: 9, interest: "Three.js",
      one: "写真から作った 3D（スプラット）を Web で見せる",
      what: "スマホで撮った写真の束から作る 3D の表現（ガウシアンスプラット）を、ブラウザで回して見られるようにする。",
      pros: ["実写そのままの質感が出る", "読み込みながら少しずつ表示できる"],
      cons: ["データが数十MBと大きい", "古いスマホでは動かない"],
      can: [2, 0, 0, 0, 1], idea: "部屋や作品を、実写の 3D で見せるページ" },
    { repo: "hollow-io/shellmate", cat: "dev", lang: "Go", stars: 5530, today: 470, prev: 8, streak: 7, interest: null,
      one: "シェルの履歴から学ぶ、端末の中の AI 相棒",
      what: "これまでに打ったコマンドの癖を覚えて、次に打ちそうなものを出す。長いコマンドを毎回調べ直さなくてよくなる。",
      pros: ["履歴を外に送らない設定がある", "1ファイルで入る"],
      cons: ["覚えるまで数日かかる", "PowerShell には未対応"],
      can: [2, 2, 0, 1, 2], idea: "git や gh の長いコマンドを覚えなくて済む" },
    { repo: "northwind-ai/voice-loop", cat: "agent", lang: "Python", stars: 7650, today: 410, prev: 10, streak: 8, interest: null,
      one: "0.3秒以内に返事をする、音声 AI の仕組み",
      what: "聞く → 考える → 話す を流れ作業でつなぎ、人と話すような速さで返事をさせる。音声アシスタントや電話の受付を作る土台。",
      pros: ["返事が速く、会話が途切れない", "聞き取り・声の部品を差し替えられる"],
      cons: ["GPU が無いと速さが出ない", "日本語の声は別の部品が要る"],
      can: [1, 1, 0, 0, 1], idea: "ゲームのキャラクターに声で答えさせる" },
    { repo: "quietbyte/logsieve", cat: "dev", lang: "Rust", stars: 4410, today: 390, prev: 11, streak: 6, interest: null,
      one: "大量のログから、大事な1行を手元で素早く探す",
      what: "何万行もあるエラーの記録から、似た行をまとめ、珍しい行だけを浮かび上がらせる。原因探しの最初の10分を短くする。",
      pros: ["1GB のログでも数秒", "ネットに送らず手元で完結"],
      cons: ["まとめ方の調整にコツが要る"],
      can: [2, 2, 2, 2, 0], idea: "CI が赤のとき、長いログから原因の行だけを見る" },
    { repo: "maple-dev/svg-morph", cat: "ui", lang: "JavaScript", stars: 2870, today: 350, prev: 17, streak: 5, interest: null,
      one: "2つの SVG の形を、なめらかに変形させる",
      what: "丸から星へ、アイコンから別のアイコンへ、と形を滑らかにつなぐ。ロゴの演出や、状態が変わったことを見せるのに使う。",
      pros: ["数KBと軽い", "どの SVG でもそのまま変形できる"],
      cons: ["点の数が大きく違う形は崩れやすい"],
      can: [1, 0, 2, 0, 2], idea: "ロゴのくずし・読み込み中の演出" },
    { repo: "coldbrew/queue-kit", cat: "data", lang: "TypeScript", stars: 3640, today: 330, prev: 12, streak: 3, interest: null,
      one: "Postgres だけで動く、画面つきの「あとでやる」行列",
      what: "メール送信など時間のかかる処理を、あとで順番に片づける待ち行列を、いつもの Postgres だけで作る。進み具合を見る画面つき。",
      pros: ["新しいサーバーが要らない", "失敗した処理のやり直しが画面でできる"],
      cons: ["1秒に数千件を超えると専用品に負ける"],
      can: [1, 2, 2, 1, 1], idea: "Web アプリの重い処理を後回しにして、画面を速く返す" },
    { repo: "gearbox/sql-notebook", cat: "data", lang: "TypeScript", stars: 2950, today: 300, prev: null, streak: 1, interest: null,
      one: "ブラウザで動く、ノート形式の SQL エディタ",
      what: "SQL と説明文と結果のグラフを、1枚のノートに交互に書ける。CSV を落とすだけで、ブラウザの中で集計できる。",
      pros: ["インストール不要", "結果をそのままグラフにできる"],
      cons: ["大きなデータはブラウザが重くなる"],
      can: [2, 2, 2, 2, 1], idea: "★の推移を SQL で集計して試す" },
    { repo: "pixelfox/phaser-tilemap-kit", cat: "game", lang: "TypeScript", stars: 1980, today: 280, prev: 18, streak: 4, interest: "Phaser",
      one: "Phaser 4 のマップを描く道具と編集画面",
      what: "ゲームの床や壁を、マス目に絵を置いていく形で作る道具一式。ブラウザ上で描いて、そのまま Phaser に読み込める。",
      pros: ["ブラウザで描いてすぐ試せる", "当たり判定もマップと一緒に描ける"],
      cons: ["大きなマップは編集画面が重い"],
      can: [2, 2, 2, 2, 0], idea: "RPG 風のマップを自分で描く" },
    { repo: "brightpath/typed-env", cat: "dev", lang: "TypeScript", stars: 2210, today: 240, prev: 14, streak: 2, interest: null,
      one: "依存なしで、設定の値を型つきで読む",
      what: "API の鍵などの設定値（環境変数）を読むとき、書き忘れや型の間違いを起動時に教えてくれる。",
      pros: ["依存0で軽い", "足りない設定を起動時に一覧で出す"],
      cons: ["小さな道具なので機能は最小限"],
      can: [1, 2, 2, 1, 0], idea: "鍵の書き忘れで本番が止まる事故を防ぐ" },
  ];

  const items = RAW.slice().sort((a, b) => b.today - a.today).map((it, i) => {
    const [owner, name] = it.repo.split("/");
    const rank = i + 1;
    const move = it.prev == null ? "new" : it.prev > rank ? "up" : it.prev < rank ? "down" : "same";
    return { ...it, owner, name, rank, move, diff: it.prev == null ? 0 : it.prev - rank };
  });

  const cat = (id) => CATS.find((c) => c.id === id);
  const byCat = (id) => items.filter((it) => it.cat === id);
  const fmt = (n) => n.toLocaleString("en-US");
  const mark = (v) => (v === 2 ? "◎" : v === 1 ? "△" : "—");
  const markWord = (v) => (v === 2 ? "できる" : v === 1 ? "条件つき" : "できない");

  const top5 = items.slice(0, 5);
  const catCount = {};
  top5.forEach((it) => (catCount[it.cat] = (catCount[it.cat] || 0) + 1));
  const leadCat = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a])[0];
  const mine = items.filter((it) => it.interest);
  const fresh = items.filter((it) => it.move === "new");
  const veteran = items.slice().sort((a, b) => b.streak - a.streak)[0];
  const byInterest = INTERESTS.map((k) => ({ k, n: mine.filter((m) => m.interest === k).length })).filter((x) => x.n);

  window.V6 = {
    date: "2026-11-13", dateJa: "11月13日", weekday: "金", updated: "06:21",
    CATS, INTERESTS, items, cat, byCat, fmt, mark, markWord, mine, fresh, veteran, byInterest,
    lead: { cat: cat(leadCat), n: catCount[leadCat] },
    headline: `上位5件のうち${catCount[leadCat]}件が「${cat(leadCat).label}」`,
  };
})();
