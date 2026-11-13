#!/usr/bin/env python3
"""
Run codegen-rpgle regression checks in one command.

Checks performed:
1) Template validation via validate-rpgle-free rules
2) Generator render-path validation for free-format procedure-bearing types

Usage:
  python run-rpgle-regression-checks.py
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent

VALIDATOR_PATH = SCRIPT_DIR / "validate-rpgle-free.py"
GENERATOR_PATH = SCRIPT_DIR / "generate-rpgle-member.py"

TEMPLATE_FILES = [
    ROOT_DIR / "templates" / "RPGLE.template.rpgle",
    ROOT_DIR / "templates" / "SQLRPGLE.template.sqlrpgle",
    ROOT_DIR / "templates" / "SRVPGM_MODULE.template.rpgle",
    ROOT_DIR / "templates" / "SRVPGM_CONSUMER.template.rpgle",
]

RENDER_TYPES = ["rpgle", "sqlrpgle", "srvpgm-module", "srvpgm-consumer"]


def load_module(module_name: str, module_path: Path):
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load module spec: {module_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_template_validation(validator_module) -> list[str]:
    errors: list[str] = []
    for template_path in TEMPLATE_FILES:
        if not template_path.exists():
            errors.append(f"Missing template: {template_path}")
            continue
        errors.extend(validator_module.validate(template_path))
    return errors


def run_render_checks(generator_module) -> list[str]:
    errors: list[str] = []
    for member_type in RENDER_TYPES:
        template_path = generator_module.TEMPLATE_MAP.get(member_type)
        if template_path is None:
            errors.append(f"Template map missing type: {member_type}")
            continue
        if not template_path.exists():
            errors.append(f"Missing render template for type '{member_type}': {template_path}")
            continue

        template_text = template_path.read_text(encoding="utf-8")
        try:
            _ = generator_module.render(
                member_type=member_type,
                obj_name="TPLUTIL",
                proc_name="normalizeName",
                library_name="*CURLIB",
                bnddir_name="TPLBNDDIR",
                text=template_text,
            )
        except Exception as ex:
            errors.append(f"Render validation failed for '{member_type}': {ex}")
    return errors


def main() -> int:
    validator_module = load_module("rpgle_validator", VALIDATOR_PATH)
    generator_module = load_module("rpgle_generator", GENERATOR_PATH)

    all_errors: list[str] = []

    template_errors = run_template_validation(validator_module)
    if template_errors:
        all_errors.extend(template_errors)
    else:
        print("OK: template validator checks passed")

    render_errors = run_render_checks(generator_module)
    if render_errors:
        all_errors.extend(render_errors)
    else:
        print("OK: generator render checks passed")

    if all_errors:
        for err in all_errors:
            print(f"ERROR: {err}")
        return 1

    print("OK: all codegen-rpgle regression checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
