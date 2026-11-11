"""要件定義書（docs/requirements.md）の形を確かめる試験。

ページ（本番のコード）ができるまでは、正本の文書が崩れていないかを CI で見る。
ページができたら、Playwright の試験をこの隣に足していく。
"""
import re
from pathlib import Path

REQUIREMENTS = Path(__file__).resolve().parent.parent / "docs" / "requirements.md"


def read_requirements() -> str:
    return REQUIREMENTS.read_text(encoding="utf-8")


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
