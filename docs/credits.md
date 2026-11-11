# 出典・謝辞: github-ranking

参考にした記事・コード・設計・素材の出典。

| 名前 | 作者 | URL | ライセンス | 参考にした点 |
|---|---|---|---|---|
| GitHub Acceptable Use Policies | GitHub | https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies | — | §7 scraping の許可範囲（研究・記録保存）と API は scraping に当たらない点（2026-11-10 確認） |
| robots.txt | GitHub | https://github.com/robots.txt | — | `/trending` が全ロボットに許可されていること（2026-11-10 確認） |
| Disabling and enabling a workflow | GitHub Docs | https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow | — | 公開リポジトリの定期実行が60日で止まる仕様 |
| GitHub Models の無料枠 | GitHub Changelog | https://github.blog/changelog/2025-06-24-github-models-now-supports-moving-beyond-free-limits/ | — | 無料枠と、超過分の支払いは有効にした場合だけ |
| models:read の権限 | GitHub Changelog | https://github.blog/changelog/2025-05-15-modelsread-now-required-for-github-models-access/ | — | Actions の GITHUB_TOKEN で Models を呼ぶ権限 |
| trendshift.io / OSS Insight / star-history / Daily Stars Explorer | 各作者 | https://trendshift.io/ ・ https://ossinsight.io/ ・ https://star-history.com/ ・ https://github.com/emanuelef/daily-stars-explorer | — | 既存の似たサービス（差を決めるための比較） |
| Events that trigger workflows（schedule） | GitHub Docs | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | — | 定期実行は高負荷時（毎時0分など）に遅れる・cron は UTC・最短5分（2026-11-12 確認。§5 定時性） |
| Rate limits for the REST API / Search | GitHub Docs | https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api ・ https://docs.github.com/en/rest/search/search | — | GITHUB_TOKEN 1,000回/時/リポジトリ・検索 30回/分・1検索 最大1,000件（2026-11-12 確認。§5 負荷） |
| GitHub Pages limits | GitHub Docs | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | — | 公開サイト 1GB・元のリポジトリ推奨 1GB・公開は10分で打ち切り・帯域 100GB/月（2026-11-12 確認。§5 データ量） |
| LCP / INP | web.dev | https://web.dev/articles/lcp ・ https://web.dev/articles/inp | — | 「良好」の基準 LCP 2.5秒以下・INP 200ms 以下（2026-11-12 確認。§5 速度） |
