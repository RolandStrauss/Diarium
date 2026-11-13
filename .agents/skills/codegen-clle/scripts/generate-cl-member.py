#!/usr/bin/env python3
"""
Generate IBM i CL members (CLLE, CLP, CL) from codegen-clle templates.

Usage:
  python generate-cl-member.py --type clle --name TPLRUN01 --out QCLLESRC/tplrun01.clle
  python generate-cl-member.py --type clp --name TPLRUN01 --out QCLLESRC/tplrun01.clp
  python generate-cl-member.py --type cl --name TPLRUN01 --out QCLLESRC/tplrun01.cl
"""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT / "templates"

TEMPLATE_MAP = {
    "clle": TEMPLATES_DIR / "CLLE.template.clle",
    "clp": TEMPLATES_DIR / "CLP.template.clp",
    "cl": TEMPLATES_DIR / "CL.template.cl",
}


def normalize_name(name: str, fallback: str = "TPLCL") -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else fallback


def render(member_name: str, template_text: str) -> str:
    rendered = template_text.replace("PROGRAM_NAME", member_name)
    return rendered if rendered.endswith("\n") else rendered + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate IBM i CL members from strict templates")
    parser.add_argument("--type", required=True, choices=sorted(TEMPLATE_MAP.keys()))
    parser.add_argument("--name", required=True, help="Member/program name (up to 10 chars used)")
    parser.add_argument("--out", required=True, help="Output file path")
    parser.add_argument("--force", action="store_true", help="Overwrite output if it exists")
    args = parser.parse_args()

    member_name = normalize_name(args.name)

    template_path = TEMPLATE_MAP[args.type]
    if not template_path.exists():
        raise FileNotFoundError(f"Missing template: {template_path}")

    output_path = Path(args.out)
    output_path = output_path.with_name(output_path.name.lower())
    if output_path.exists() and not args.force:
        raise FileExistsError(f"Output exists: {output_path} (use --force to overwrite)")

    text = template_path.read_text(encoding="utf-8")
    rendered = render(member_name, text)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")

    print(f"OK: generated {args.type} member at {output_path}")
    print(f"Member used: {member_name}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
