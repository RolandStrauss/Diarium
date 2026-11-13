#!/usr/bin/env python3
"""
Generate IBM i COBOL members (CBLLE, SQLCBLLE, CPY) from codegen-cblle templates.

Usage:
  python generate-cblle-member.py --type cblle --name TPLCBL01 --out QCBLLESRC/tplcbl01.cblle
  python generate-cblle-member.py --type sqlcblle --name TPLSQLC1 --table DDGMTRRUL --out QCBLLESRC/tplsqlc01.sqlcblle
  python generate-cblle-member.py --type cpy --name TPLCTX --out QCBLLEREF/tplctx.cpy
"""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT / "templates"

TEMPLATE_MAP = {
    "cblle": TEMPLATES_DIR / "CBLLE.template.cblle",
    "sqlcblle": TEMPLATES_DIR / "SQLCBLLE.template.sqlcblle",
    "cpy": TEMPLATES_DIR / "CPY.template.cpy",
}


def normalize_name(name: str, fallback: str = "TPLCBL") -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else fallback


def normalize_table(name: str) -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else "MYTABLE"


def render(member_type: str, member_name: str, table_name: str, template_text: str) -> str:
    rendered = template_text.replace("PROGRAM_NAME", member_name)
    rendered = rendered.replace("COPYBOOK_NAME", member_name)
    if member_type == "sqlcblle":
        rendered = rendered.replace("TABLE_NAME", table_name)

    normalized_lines: list[str] = []
    for line in rendered.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("*>"):
            normalized_lines.append(f"      {stripped}")
        else:
            normalized_lines.append(line)

    normalized = "\n".join(normalized_lines)
    return normalized if normalized.endswith("\n") else normalized + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate IBM i COBOL members from strict templates")
    parser.add_argument("--type", required=True, choices=sorted(TEMPLATE_MAP.keys()))
    parser.add_argument("--name", required=True, help="Member/program name (up to 10 chars used)")
    parser.add_argument("--table", default="MYTABLE", help="Table name for sqlcblle templates")
    parser.add_argument("--out", required=True, help="Output file path")
    parser.add_argument("--force", action="store_true", help="Overwrite output if it exists")
    args = parser.parse_args()

    member_name = normalize_name(args.name)
    table_name = normalize_table(args.table)

    template_path = TEMPLATE_MAP[args.type]
    if not template_path.exists():
        raise FileNotFoundError(f"Missing template: {template_path}")

    output_path = Path(args.out)
    output_path = output_path.with_name(output_path.name.lower())
    if output_path.exists() and not args.force:
        raise FileExistsError(f"Output exists: {output_path} (use --force to overwrite)")

    template_text = template_path.read_text(encoding="utf-8")
    rendered = render(args.type, member_name, table_name, template_text)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")

    print(f"OK: generated {args.type} member at {output_path}")
    print(f"Member used: {member_name}")
    if args.type == "sqlcblle":
        print(f"Table used: {table_name}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
