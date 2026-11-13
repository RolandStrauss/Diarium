#!/usr/bin/env python3
"""
Generate IBM i SQL members from codegen-sql templates.

Usage:
  python generate-sql-member.py --type sql --name TPLSQL01 --out QSQLSRC/tplsql01.sql
  python generate-sql-member.py --type sqltable --name TPLACCMST --out QSQLSRC/tplaccmst.sqltabl
  python generate-sql-member.py --type sqlview --name TPLACCV01 --table TPLACCMST --out QSQLSRC/tplaccv01.sqlview
  python generate-sql-member.py --type sqlproc --name TPLUPDACC --table TPLACCMST --out QSQLSRC/tplupdacc.sqlprc
  python generate-sql-member.py --type sqltrigger --name TPLACCTRG --table TPLACCMST --out QSQLSRC/tplacctrg.sqltrg
  python generate-sql-member.py --type sqlindex --name TPLACCIDX --table TPLACCMST --out QSQLSRC/tplaccidx.sqlidx
"""

from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT / "templates"

TEMPLATE_MAP = {
    "sql": TEMPLATES_DIR / "SQL.template.sql",
    "sqltable": TEMPLATES_DIR / "SQLTABLE.template.sqltabl",
    "sqlview": TEMPLATES_DIR / "SQLVIEW.template.sqlview",
    "sqlproc": TEMPLATES_DIR / "SQLPROC.template.sqlprc",
    "sqltrigger": TEMPLATES_DIR / "SQLTRIGGER.template.sqltrg",
    "sqlindex": TEMPLATES_DIR / "SQLINDEX.template.sqlidx",
}


def normalize_name(name: str, fallback: str = "TPLOBJ") -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else fallback


def normalize_long_name(name: str, fallback: str = "TPL_OBJECT") -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned if cleaned else fallback


def derive_base_table(member_type: str, member_name: str, explicit_table: str) -> str:
    if explicit_table:
        return normalize_long_name(explicit_table, "TPL_TABLE")
    if member_type == "sqltable":
        return normalize_long_name(member_name, "TPL_TABLE")
    if member_name.endswith("V01"):
        return normalize_long_name(member_name[:-3], "TPL_TABLE")
    if member_name.endswith("TRG"):
        return normalize_long_name(member_name[:-3], "TPL_TABLE")
    if member_name.endswith("IDX"):
        return normalize_long_name(member_name[:-3], "TPL_TABLE")
    return "TPL_TABLE"


def render(
    member_type: str,
    member_name: str,
    schema_name: str,
    base_table_name: str,
    template_text: str,
) -> str:
    object_name = normalize_long_name(member_name, "TPL_OBJECT")
    system_name = normalize_name(member_name, "TPLOBJ")

    rendered = template_text
    rendered = rendered.replace("SCHEMA_NAME", schema_name)
    rendered = rendered.replace("OBJECT_NAME", object_name)
    rendered = rendered.replace("SYSTEM_NAME", system_name)
    rendered = rendered.replace("BASE_TABLE_NAME", base_table_name)

    if member_type == "sql":
        rendered = rendered.replace("health_check", f"{system_name.lower()}_health")

    return rendered if rendered.endswith("\n") else rendered + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate IBM i SQL members from strict templates")
    parser.add_argument("--type", required=True, choices=sorted(TEMPLATE_MAP.keys()))
    parser.add_argument("--name", required=True, help="Member/object name (up to 10 chars used for FOR SYSTEM NAME)")
    parser.add_argument("--out", required=True, help="Output file path")
    parser.add_argument("--schema", default="MMDEVOPS", help="Target SQL schema (default: MMDEVOPS)")
    parser.add_argument("--table", default="", help="Base table for view/proc/trigger/index templates")
    parser.add_argument("--force", action="store_true", help="Overwrite output if it exists")
    args = parser.parse_args()

    member_name = normalize_name(args.name)
    schema_name = normalize_long_name(args.schema, "MMDEVOPS")
    base_table_name = derive_base_table(args.type, member_name, args.table)

    template_path = TEMPLATE_MAP[args.type]
    if not template_path.exists():
        raise FileNotFoundError(f"Missing template: {template_path}")

    output_path = Path(args.out)
    output_path = output_path.with_name(output_path.name.lower())
    if output_path.exists() and not args.force:
        raise FileExistsError(f"Output exists: {output_path} (use --force to overwrite)")

    text = template_path.read_text(encoding="utf-8")
    rendered = render(args.type, member_name, schema_name, base_table_name, text)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")

    print(f"OK: generated {args.type} member at {output_path}")
    print(f"Member used: {member_name}")
    print(f"Schema used: {schema_name}")
    if args.type in {"sqlview", "sqlproc", "sqltrigger", "sqlindex"}:
        print(f"Base table used: {base_table_name}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
