#!/usr/bin/env python3
"""
Generate IBM i DDS members (PF, LF) from codegen-dds templates.

Usage:
  python generate-dds-member.py --type pf --name TPLCUSPF --out QDDSSRC/tplcuspf.pf
  python generate-dds-member.py --type lf --name TPLCUSLF --pfile TPLCUSPF --out QDDSSRC/tplcuslf.lf
"""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT / "templates"

TEMPLATE_MAP = {
    "pf": TEMPLATES_DIR / "PF.template.pf",
    "lf": TEMPLATES_DIR / "LF.template.lf",
}


def normalize_name(name: str, fallback: str = "TPLDDS") -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else fallback


def normalize_record_name(member_name: str) -> str:
    candidate = f"{member_name}R"
    return normalize_name(candidate, "TPLREC")


def enforce_a_in_column_6(text: str) -> str:
    fixed_lines: list[str] = []
    for line in text.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("A"):
            fixed_lines.append(f"     {stripped}")
        else:
            fixed_lines.append(line)
    return "\n".join(fixed_lines)


def render(member_type: str, member_name: str, record_name: str, pfile_name: str, template_text: str) -> str:
    rendered = template_text
    rendered = rendered.replace("MEMBER_NAME", member_name)
    rendered = rendered.replace("RECORD_NAME", record_name)
    rendered = rendered.replace("PFILE_NAME", pfile_name)

    rendered = enforce_a_in_column_6(rendered)

    return rendered if rendered.endswith("\n") else rendered + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate IBM i DDS members from strict templates")
    parser.add_argument("--type", required=True, choices=sorted(TEMPLATE_MAP.keys()))
    parser.add_argument("--name", required=True, help="Member/object name (up to 10 chars used)")
    parser.add_argument("--out", required=True, help="Output file path")
    parser.add_argument("--pfile", default="", help="PF member name referenced by LF (only for --type lf)")
    parser.add_argument("--force", action="store_true", help="Overwrite output if it exists")
    args = parser.parse_args()

    member_name = normalize_name(args.name)
    record_name = normalize_record_name(member_name)

    pfile_name = normalize_name(args.pfile) if args.pfile else ""
    if args.type == "lf" and not pfile_name:
        if member_name.endswith("LF"):
            pfile_name = normalize_name(member_name[:-2] + "PF")
        else:
            pfile_name = normalize_name(member_name + "PF")

    template_path = TEMPLATE_MAP[args.type]
    if not template_path.exists():
        raise FileNotFoundError(f"Missing template: {template_path}")

    output_path = Path(args.out)
    output_path = output_path.with_name(output_path.name.lower())
    if output_path.exists() and not args.force:
        raise FileExistsError(f"Output exists: {output_path} (use --force to overwrite)")

    text = template_path.read_text(encoding="utf-8")
    rendered = render(args.type, member_name, record_name, pfile_name, text)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")

    print(f"OK: generated {args.type} member at {output_path}")
    print(f"Member used: {member_name}")
    print(f"Record format used: {record_name}")
    if args.type == "lf":
        print(f"PFILE used: {pfile_name}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
