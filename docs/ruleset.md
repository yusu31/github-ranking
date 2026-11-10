# GitHub Ruleset の設定手順

Ruleset（規則集）は、GitHub 側で「main に直接 push できない」「CI が緑でないと merge できない」を強制する設定。
**hook は保険、Ruleset が本丸。** hook を入れる前に、先にこれを設定する（順序を守る）。

## 順序

1. GitHub にリポジトリを作る（本人が行う。作る前に公開範囲を確認する）
2. **この Ruleset を設定する**（下記）
3. そのあとで hook（guard）を入れる
4. 最初は `.harness.json` の `guard` を `warn` にして 1〜2 週間使う

## 設定（Settings → Rules → Rulesets → New branch ruleset）

| 項目 | 値 |
|---|---|
| Ruleset Name | `protect-main` |
| Enforcement status | Active |
| Target branches | Default branch（main） |
| Restrict deletions | オン |
| Require a pull request before merging | オン（承認数は個人開発なら 0 でよい） |
| Require status checks to pass | オン。CI の job 名を追加（CI が無い profile は省略） |
| Require review from Code Owners | 下の「CODEOWNERS」を読んでから決める（`.github/`・`.claude/`・`.harness.json` の変更を本人が必ず見る） |
| Block force pushes | オン |
| Bypass list | 空のまま（本人も例外にしない） |

## CODEOWNERS（変更の持ち主）

`.github/CODEOWNERS` に書いた人が、PR のレビュー担当として自動で付く。CI・依存・ハーネスの設定（`.github/`・`.claude/`・`.harness.json`）は乗っ取りや AI の書き換えの入口になるので、本人が必ず見る。

1. `.github/CODEOWNERS` の `@YOUR_GITHUB_USERNAME` を、自分の GitHub ユーザー名に置き換える（置き換えるまでは効かない）
2. Ruleset の「Require a pull request before merging」の中の **Require review from Code Owners** をオンにする
   - **一人開発の注意**: GitHub では**自分の PR は自分で承認できない**。PR を作るアカウントと Code Owner が同じ（AI が本人の `gh` で PR を作る場合も同じ）だと、merge できなくなる。一人のうちは**オフ**にして、CODEOWNERS は「自動でレビュー担当が付く」用途に使う。AI 用の別アカウントや共同開発者ができたらオンにする
   - 非公開リポジトリの Ruleset は GitHub Free では使えない（有料プラン）。そのときは CODEOWNERS の自動割り当てと、PR を本人が見る運用で守る

## Dependabot（依存の更新と脆弱性の知らせ）

`.github/dependabot.yml` がある profile では、週1回、依存と Actions の更新 PR が出る（大きな版上げは出さない）。Dependabot は非公開リポジトリでも無料。

1. Settings → Code security（Advanced Security）→ **Dependabot alerts** を Enable（既知の脆弱性の知らせ）
2. 同じ画面の **Dependabot security updates** を Enable（脆弱性の修正 PR が週1回を待たずに出る）
3. 版の更新（version updates）は `dependabot.yml` があれば自動で有効。Insights → Dependency graph → Dependabot で動いたか確かめる
4. 来た PR は CI が緑か・変更点（リリースノート）を見てから merge する。Actions の更新は SHA と行末の版のコメントが両方変わっているかを見る
5. Gradle（web-react-spring）は `setup-gradle` に `cache-provider: basic` を置いている。v6 の既定の Enhanced キャッシュは独自ライセンスの部品で利用規約への同意が要るが、basic は MIT のみで規約が関わる部品を読み込まないため。Dependabot の更新 PR でこの行が消えていないか見る（テスト T-116 が確かめる）

## merge ポリシーとの関係

- `owner`（既定）: 本人が GitHub 上で merge する
- `ai-gated` / `ai` を選ぶプロジェクトは、この Ruleset を必ず併用する
- Ruleset の設定変更は本人だけが行う（AI に頼まない）
