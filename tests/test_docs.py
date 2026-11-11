"""要件定義書（docs/requirements.md）の形を確かめる試験。

ページ（本番のコード）ができるまでは、正本の文書が崩れていないかを CI で見る。
ページができたら、Playwright の試験をこの隣に足していく。
"""
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
REQUIREMENTS = DOCS / "requirements.md"
FEATURES = DOCS / "features.md"

# Phase 0 の必須①〜⑤と、それを動かす土台（毎朝の実行と公開ページ）
REQUIRED_FEATURES = ["F-01", "F-02", "F-03", "F-04", "F-05", "F-08"]


def read_requirements() -> str:
    return REQUIREMENTS.read_text(encoding="utf-8")


def feature_rows() -> dict[str, list[str]]:
    """features.md の機能表を {F-xx: [列...]} にする。"""
    rows = {}
    for line in FEATURES.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\| (F-\d+) \|", line)
        if m:
            rows[m.group(1)] = [c.strip() for c in line.strip().strip("|").split("|")]
    return rows


def phase_section() -> str:
    return read_requirements().split("## 11. フェーズ", 1)[1].split("\n## ", 1)[0]


def test_requirements_has_all_sections():
    """§1〜§13 の見出しがそろっている（§6〜9 は1つの見出しにまとまっている）。"""
    text = read_requirements()
    expected = ["1.", "2.", "3.", "4.", "5.", "6〜9.", "10.", "11.", "12.", "13."]
    missing = [n for n in expected if not re.search(rf"^## {re.escape(n)} ", text, re.M)]
    assert missing == [], f"見出しが足りない: {missing}"


def test_phase0_agreement_is_written():
    """Phase 0 の合意（必須・できれば・作らない・削る順・お金・ルール）が §1〜§2 にある。"""
    text = read_requirements()
    head = text.split("## 3. ", 1)[0]
    for word in ["| 必須 |", "| できれば |", "| 作らない |", "削る順", "お金をかけない", "robots.txt"]:
        assert word in head, f"§1〜§2 に「{word}」が無い"
    assert "<!-- 何のために作るか -->" not in head, "§1 の目的が雛形のまま"


def test_phase_table_starts_at_0_and_is_consecutive():
    """§11 のフェーズ表が Phase 0 から番号の抜けなく並んでいる。"""
    phases = [int(n) for n in re.findall(r"^\| (\d+) \|", phase_section(), re.M)]
    assert phases, "§11 にフェーズ表の行が無い"
    assert phases == list(range(len(phases))), f"フェーズ表の番号: {phases}"


def test_delivery_review_comes_before_release():
    """型 v0.4.8 の工程: 品質チェック（7）→ 納品レビュー（8）→ 公開（9）→ 判定・記録（10）。"""
    rows = dict(re.findall(r"^\| (\d+) \| ([^|]+?) \|", phase_section(), re.M))
    got = [rows.get(n) for n in ["7", "8", "9", "10"]]
    assert got == ["品質チェック", "納品レビュー", "公開", "判定・記録"], f"7〜10 の内容: {got}"


def test_required_features_have_acceptance_criteria():
    """Phase 1 の完了条件: 必須の機能すべてに、中身のある受け入れ条件（AC）がある。"""
    rows = feature_rows()
    missing = [f for f in REQUIRED_FEATURES if f not in rows]
    assert missing == [], f"features.md に必須の機能の行が無い: {missing}"
    empty = []
    for f in REQUIRED_FEATURES:
        acs = re.findall(r"AC-\d+:\s*([^<]*?)(?=<br>|AC-\d+:|$)", rows[f][3])
        if not acs or any(len(a.strip()) < 5 for a in acs):
            empty.append(f)
    assert empty == [], f"AC が空か短すぎる機能: {empty}"


def test_acceptance_criteria_ids_are_unique():
    """AC の番号が機能をまたいで重複していない（テストから AC を一意に指せる）。"""
    ids = re.findall(r"\b(AC-\d+):", FEATURES.read_text(encoding="utf-8"))
    dup = sorted({i for i in ids if ids.count(i) > 1})
    assert dup == [], f"重複した AC: {dup}"


def test_nonfunctional_requirements_are_filled():
    """§5 の非機能の表で、目標値・根拠・測り方が空の行が無い。"""
    sec = read_requirements().split("## 5. 非機能要件", 1)[1].split("\n## ", 1)[0]
    rows = [l for l in sec.splitlines() if l.startswith("| ") and not l.startswith("| 項目") and not l.startswith("|---")]
    assert len(rows) >= 5, f"§5 の行が少ない: {len(rows)}"
    blank = [r.split("|")[1].strip() for r in rows if any(c.strip() == "" for c in r.strip().strip("|").split("|")[1:4])]
    assert blank == [], f"目標値・根拠・測り方のどれかが空の行: {blank}"
