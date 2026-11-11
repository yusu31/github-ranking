# github-ranking

<!-- 1〜2行で何を作るか（読む人が最初に見る一文） -->

作成日: 2026-11-10 ／ 型: web-static

<!-- CI バッジ: GitHub に push したら次の行を有効にする（OWNER/REPO を直す）
[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml) -->

> **この README は2段階で育てる。** kick の直後は「作業する人向け」（下の「5分で始める」）が主。**公開の工程で、見る人（採用担当・他の人）向けに書き換える**: 「デモ」から「ライセンス」までの空の節（`<!-- -->` だけの節）を埋め、使わない節は消す。公開前に、この案内の引用も消す。

## 5分で始める

1. この README と `CLAUDE.md` を読む（プロジェクトの約束事）
2. `docs/requirements.md` の §11 で、今どのフェーズか確認する
3. 次にやることを GitHub の Issue にする（Issue テンプレを使う）

## 現在の状況
<!-- 今どこまでできているか（フェーズと、動くもの・まだ動かないもの）を数行。更新日を添える。`rt progress` の1行を貼ってもよい -->

## デモ

本物のページを動かした録画を置く（例: `docs/demo/demo.gif`）。撮り方は [納品書](docs/delivery.md) §3 と同じ台本 `scripts/demo/capture.mjs`（Playwright）で、何度でも撮り直せる。

<!-- ![デモ](docs/demo/demo.gif) -->

## 主な機能

| 機能 ID | 機能 | 状態 |
|---|---|---|
| F-01 |  |  |

<!-- 正本は docs/features.md。ここは見る人向けの要約（機能の数より、なぜ作ったかが伝わるように） -->

## 画面

画面ごとに見出しと1枚の画像（`docs/screens/`）を置く。

<!-- ### トップ
![トップ](docs/screens/top.png) -->

## 構成図
<!-- 全体の構成を1枚（Mermaid か画像）。公開しない・常時稼働させない理由があるなら、ここに書く -->

## 技術スタック
<!-- 使った技術を表で（採用物とその理由は docs/tech-stack.md が正本）。本番 URL があればここに書く -->

## 起動手順

```bash
# ビルドが要らないとき: 簡易サーバーで開く
python -m http.server 8000
# → http://localhost:8000
```

<!-- ビルドがあるときはその手順に書き換える -->

### 環境変数
<!-- 必要な環境変数の名前と意味。値は書かない。`.env.example` を写して使う（`.env` は Git に入れない） -->

## 使い方

<!-- 画面の操作を、触る順に3〜5行 -->

## 工夫した点・設計判断
<!-- 「なぜそう作ったか」を3〜5点。採用した案と、却下した案の理由（正本は docs/adr/）。機能の数より、ここが伝わる -->

## 詰まった点と解決
<!-- 詰まったこと → 原因 → どう解決したか。実際にあったことだけを書く -->

## 既知の制限
<!-- 今できないこと・見送ったこと（正本は納品書 docs/delivery.md §5） -->

## テスト
<!-- 品質チェックのコマンド（CLAUDE.md が正本）と、実行件数。例: 「41 件 全て合格（実行日）」 -->

## 開発ワークフロー
Issue → branch → PR → merge の順で進める。ブランチ名・コミットの書き方は `CLAUDE.md` を参照。

## ドキュメント一覧

| 文書 | 内容 |
|---|---|
| [docs/requirements.md](docs/requirements.md) | 要件定義とフェーズ |
| [docs/features.md](docs/features.md) | 機能一覧と受け入れ条件 |
| [docs/tech-stack.md](docs/tech-stack.md) | 使う技術と、採用しなかった技術 |
| [docs/testing-design.md](docs/testing-design.md) | テストの設計 |
| [docs/delivery.md](docs/delivery.md) | 納品書（AC の対照・デモ・既知の不具合・本人の判定） |
| [docs/glossary.md](docs/glossary.md) | 用語集 |
| [docs/licenses.md](docs/licenses.md) / [docs/credits.md](docs/credits.md) | 採用物のライセンスと出典 |

## 設定

`.harness.json` に merge の方針・guard の強さ・学習モードがある。**変更できるのは本人だけ**（AI は書き換えない）。
自分だけの指示（ローカルのパスなど）は `CLAUDE.local.md` に書く。Git 管理外（`.gitignore` 済み）なので共有されない。
GitHub 側の設定は [docs/ruleset.md](docs/ruleset.md) を参照。

## 名前の由来（任意）
<!-- 名前に込めた意味。無ければこの節を消す -->

## 課題提出（任意）
<!-- RaiseTech の課題のときだけ書く。提出するファイルと提出先。課題でなければこの節を消す -->

## ライセンス
<!-- 例: MIT。採用物のライセンスは docs/licenses.md -->
