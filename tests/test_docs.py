"""要件定義書（docs/requirements.md）の形を確かめる試験。

ページ（本番のコード）ができるまでは、正本の文書が崩れていないかを CI で見る。
"""
import re
from pathlib import Path

REQUIREMENTS = Path(__file__).resolve().parent.parent / "docs" / "requirements.md"


def read_requirements() -> str:
    return REQUIREMENTS.read_text(encoding="utf-8")


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


def test_phase_table_has_phase_0_to_9():
    """§11 のフェーズ表に Phase 0〜9 の10行がそろっている。"""
    text = read_requirements()
    section = text.split("## 11. フェーズ", 1)[1].split("\n## ", 1)[0]
    phases = re.findall(r"^\| (\d+) \|", section, re.M)
    assert phases == [str(n) for n in range(10)], f"フェーズ表の行: {phases}"
