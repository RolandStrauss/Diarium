#!/usr/bin/env python3
"""
Generate RPG source member files from codegen-rpgle templates.

Usage:
    python generate-rpgle-member.py --type rpgle --name TPLDEMO --out QRPGLESRC/tpldemo.rpgle
    python generate-rpgle-member.py --type sqlrpgle --name TPLSQL01 --out QRPGLESRC/tplsql01.sqlrpgle
    python generate-rpgle-member.py --type rpgleinc --name TPLCONST --out qrpglesrc/tplconst.rpgleinc
        python generate-rpgle-member.py --type srvpgm-module --name TPLUTIL --out QRPGLESRC/tplutil.rpgle --proc normalizeName
                python generate-rpgle-member.py --type srvpgm-consumer --name TPLCALLER --out QRPGLESRC/tplcaller.rpgle --proc normalizeName
    python generate-rpgle-member.py --type binder --name TPLUTIL --out QSRVSRC/tplutil.bnd
    python generate-rpgle-member.py --type srvpgm-build --name TPLUTIL --out QCLLESRC/tplutil_build.clle --library MYLIB --bnddir TPLBNDDIR
        python generate-rpgle-member.py --type service-api --name TPLUTIL --out qrpglesrc/tplutil_api.rpgleinc --proc normalizeName
        python generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/bundle --proc normalizeName --library MYLIB --bnddir TPLBNDDIR
        python generate-rpgle-member.py --type srvpgm-module --name TPLUTIL --out QRPGLESRC/tplutil.rpgle --proc normalizeName --strict
        python generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/bundle --proc normalizeName --dry-run
        python generate-rpgle-member.py --type srvpgm-bundle --name TPLUTIL --out .agents/skills/codegen-rpgle/samples/bundle --proc normalizeName --dry-run --json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT / "templates"
REPO_ROOT = Path(__file__).resolve().parents[4]
COPYBOOK_DIR = REPO_ROOT / "qrpglesrc"

TEMPLATE_MAP = {
    "rpgle": TEMPLATES_DIR / "RPGLE.template.rpgle",
    "sqlrpgle": TEMPLATES_DIR / "SQLRPGLE.template.sqlrpgle",
    "rpgleinc": TEMPLATES_DIR / "RPGLEINC.template.rpgleinc",
    "srvpgm-module": TEMPLATES_DIR / "SRVPGM_MODULE.template.rpgle",
    "srvpgm-consumer": TEMPLATES_DIR / "SRVPGM_CONSUMER.template.rpgle",
    "binder": TEMPLATES_DIR / "BINDER.template.bnd",
    "srvpgm-build": TEMPLATES_DIR / "SRVPGM_BUILD.template.clle",
    "service-api": TEMPLATES_DIR / "SERVICE_API.template.rpgleinc",
}

BUNDLE_TYPES = {"srvpgm-bundle"}

FREE_FORMAT_TYPES = {
    "rpgle",
    "sqlrpgle",
    "rpgleinc",
    "srvpgm-module",
    "srvpgm-consumer",
    "service-api",
}

TYPE_COLUMN = 35
COMMENT_MAX_COLUMNS = 100

DECL_LINE_PATTERN = re.compile(
    r"^(\s*dcl-(?:s|c|pr|pi|ds)\s+)(\S+)(\s+)(.*\S.*)$",
    re.IGNORECASE,
)

BLOCK_FIELD_PATTERN = re.compile(
    r"^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s+(.*\S.*)$"
)

PROC_START_PATTERN = re.compile(r"^\s*dcl-proc\b", re.IGNORECASE)
PROC_NAMED_START_PATTERN = re.compile(r"^\s*dcl-proc\s+([A-Za-z_][A-Za-z0-9_]*)\b", re.IGNORECASE)
ON_EXIT_PATTERN = re.compile(r"^\s*on-exit\s*;", re.IGNORECASE)
END_PROC_PATTERN = re.compile(r"^\s*end-proc\s*;", re.IGNORECASE)
ALWAYS_TRUE_DOW_PATTERN = re.compile(
    r"(?im)^(\s*)dow\s*\(\s*'1'\s*=\s*'1'\s*\)\s*;\s*$"
)
RPG_LINE_COMMENT_RE = re.compile(r"^\s*//")
PROC_HEADER_OPEN_RE = re.compile(r"^\s*//\s*<Procedure:\s*([A-Za-z_][A-Za-z0-9_]*)\s*>\s*$")
PROC_HEADER_CLOSE_RE = re.compile(r"^\s*//\s*</Procedure:\s*([A-Za-z_][A-Za-z0-9_]*)\s*>\s*$")
PROC_HEADER_SYNOPSIS_RE = re.compile(r"^\s*//\s+\S.*$")


def normalize_name(name: str) -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else "MAINPROC"


def normalize_proc_name(name: str) -> str:
    tokens = re.findall(r"[A-Za-z0-9]+", name)
    if not tokens:
        return "normalizeName"

    first = tokens[0]
    first = first[0].lower() + first[1:] if first else ""
    rest = [token[0].upper() + token[1:] if token else "" for token in tokens[1:]]
    candidate = first + "".join(rest)

    if not candidate:
        return "normalizeName"
    if not candidate[0].isalpha():
        candidate = f"proc{candidate[0].upper() + candidate[1:]}"
    return candidate


def normalize_library_name(name: str) -> str:
    raw = name.strip()
    if not raw:
        return "*CURLIB"
    if raw.upper() in {"*CURLIB", "*LIBL"}:
        return raw.upper()
    cleaned = "".join(ch for ch in raw.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else "*CURLIB"


def normalize_bnddir_name(name: str) -> str:
    cleaned = "".join(ch for ch in name.upper() if ch.isalnum() or ch == "_")
    return cleaned[:10] if cleaned else "TPLBNDDIR"


def validate_strict_inputs(raw_name: str, raw_proc: str, raw_library: str, raw_bnddir: str) -> None:
    normalized_name = normalize_name(raw_name)
    if raw_name.strip().upper() != normalized_name:
        raise ValueError(
            f"--name '{raw_name}' is not strict-safe; IBM i object/member names must use only A-Z, 0-9, _, avoid @ # $, and stay within 10 uppercase characters (example: {normalized_name})"
        )

    normalized_proc = normalize_proc_name(raw_proc)
    if raw_proc.strip() != normalized_proc:
        raise ValueError(
            f"--proc '{raw_proc}' is not strict-safe; use lowerCamelCase with letters/digits only (example: {normalized_proc})"
        )
    if len(normalized_proc) > 128:
        raise ValueError("--proc is too long for strict mode; internal procedure names can be longer on IBM i, but keep them readable and at 128 chars or fewer here")
    if not re.match(r"^[a-z][A-Za-z0-9]*$", normalized_proc):
        raise ValueError("--proc must be lowerCamelCase and start with a lowercase letter in strict mode")

    raw_library_trimmed = raw_library.strip()
    raw_library_upper = raw_library_trimmed.upper()
    normalized_library = normalize_library_name(raw_library)
    if raw_library_upper not in {"*CURLIB", "*LIBL"} and raw_library_upper != normalized_library:
        raise ValueError(
            f"--library '{raw_library}' is not strict-safe; IBM i library names must use only A-Z, 0-9, _, avoid @ # $, and stay within 10 uppercase characters, or use *CURLIB/*LIBL (example: {normalized_library})"
        )

    normalized_bnddir = normalize_bnddir_name(raw_bnddir)
    if raw_bnddir.strip().upper() != normalized_bnddir:
        raise ValueError(
            f"--bnddir '{raw_bnddir}' is not strict-safe; IBM i binding directory names must use only A-Z, 0-9, _, avoid @ # $, and stay within 10 uppercase characters (example: {normalized_bnddir})"
        )


def derived_names(obj_name: str) -> tuple[str, str]:
    consumer_name = (obj_name[:9] + "C") if len(obj_name) >= 1 else "CONSUMER"
    api_member = (obj_name[:7] + "API") if len(obj_name) >= 1 else "SERVICEAPI"
    return consumer_name, api_member


def build_bundle_plan(obj_name: str, output_dir: Path) -> list[tuple[str, Path]]:
    consumer_name, api_member = derived_names(obj_name)
    base = obj_name.lower()

    return [
        ("srvpgm-module", output_dir / f"{base}.rpgle"),
        ("service-api", COPYBOOK_DIR / f"{api_member.lower()}.rpgleinc"),
        ("srvpgm-consumer", output_dir / f"{consumer_name.lower()}.rpgle"),
        ("binder", output_dir / f"{base}.bnd"),
        ("srvpgm-build", output_dir / f"{base}_build.clle"),
    ]


def align_type_columns(text: str) -> str:
    """Align first type/attribute keyword to column 35 for declarations."""
    lines = text.splitlines()
    out: list[str] = []
    in_block: str | None = None

    for line in lines:
        stripped = line.strip()

        if not stripped or stripped.startswith("//"):
            out.append(line)
            continue

        lower = stripped.lower()
        if lower.startswith("dcl-pi "):
            in_block = "pi"
        elif lower.startswith("dcl-pr "):
            in_block = "pr"
        elif lower.startswith("dcl-ds "):
            in_block = "ds"

        if lower.startswith(("end-pi;", "end-pr;", "end-ds;")):
            in_block = None
            out.append(line)
            continue

        m = DECL_LINE_PATTERN.match(line)
        if m:
            prefix, identifier, _, remainder = m.groups()
            anchor = len(prefix) + len(identifier)
            spaces = " " if anchor >= (TYPE_COLUMN - 1) else " " * ((TYPE_COLUMN - 1) - anchor)
            out.append(f"{prefix}{identifier}{spaces}{remainder}")
            continue

        if in_block in {"pi", "pr", "ds"}:
            field = BLOCK_FIELD_PATTERN.match(line)
            if field:
                indent, identifier, remainder = field.groups()
                anchor = len(indent) + len(identifier)
                spaces = " " if anchor >= (TYPE_COLUMN - 1) else " " * ((TYPE_COLUMN - 1) - anchor)
                out.append(f"{indent}{identifier}{spaces}{remainder}")
                continue

        out.append(line)

    return "\n".join(out)


def validate_on_exit_sections(text: str) -> None:
    """Ensure each procedure contains an explicit on-exit section."""
    lines = text.splitlines()
    in_proc = False
    proc_has_on_exit = False
    proc_index = 0

    for line in lines:
        if PROC_START_PATTERN.match(line):
            in_proc = True
            proc_has_on_exit = False
            proc_index += 1
            continue

        if in_proc and ON_EXIT_PATTERN.match(line):
            proc_has_on_exit = True
            continue

        if in_proc and END_PROC_PATTERN.match(line):
            if not proc_has_on_exit:
                raise ValueError(
                    f"Generated free-form procedure #{proc_index} is missing required 'on-exit;' section"
                )
            in_proc = False
            proc_has_on_exit = False


def validate_comment_width(text: str, max_columns: int = COMMENT_MAX_COLUMNS) -> None:
    """Ensure RPG line comments stay within the configured width."""
    for idx, line in enumerate(text.splitlines(), start=1):
        if RPG_LINE_COMMENT_RE.match(line) and len(line) > max_columns:
            raise ValueError(
                f"Generated comment line {idx} exceeds {max_columns} columns; wrap to next // line"
            )


def validate_procedure_header_blocks(text: str) -> None:
    """Ensure each procedure has an immediate synopsis header comment block."""
    lines = text.splitlines()

    for idx, line in enumerate(lines, start=1):
        proc_match = PROC_NAMED_START_PATTERN.match(line)
        if not proc_match:
            continue

        proc_name = proc_match.group(1)
        proc_name_l = proc_name.lower()

        if idx == 1:
            raise ValueError(
                f"Generated procedure '{proc_name}' is missing required header block above dcl-proc"
            )

        if not lines[idx - 2].strip():
            raise ValueError(
                f"Generated procedure '{proc_name}' must have header block immediately above dcl-proc"
            )

        block_start = idx - 2
        while block_start >= 0 and RPG_LINE_COMMENT_RE.match(lines[block_start]):
            block_start -= 1
        block_start += 1
        block_end = idx - 2
        header_block = lines[block_start : block_end + 1]

        if len(header_block) < 3:
            raise ValueError(
                f"Generated procedure '{proc_name}' header must include open tag, synopsis, and close tag"
            )

        open_match = PROC_HEADER_OPEN_RE.match(header_block[0])
        close_match = PROC_HEADER_CLOSE_RE.match(header_block[-1])
        if not open_match or not close_match:
            raise ValueError(
                f"Generated procedure '{proc_name}' header must use // <Procedure: name> ... // </Procedure: name>"
            )

        if open_match.group(1).lower() != proc_name_l or close_match.group(1).lower() != proc_name_l:
            raise ValueError(
                f"Generated procedure '{proc_name}' header name must match dcl-proc name"
            )

        synopsis_lines = header_block[1:-1]
        if not synopsis_lines:
            raise ValueError(
                f"Generated procedure '{proc_name}' header must include at least one synopsis line"
            )

        for synopsis_line in synopsis_lines:
            if not PROC_HEADER_SYNOPSIS_RE.match(synopsis_line):
                raise ValueError(
                    f"Generated procedure '{proc_name}' synopsis lines must contain comment text after //"
                )


def normalize_canonical_dow_loops(text: str) -> str:
    """Normalize forbidden always-true loops to canonical shutdown-aware form."""
    return ALWAYS_TRUE_DOW_PATTERN.sub(r"\1dow (not %shtdn ) ;", text)


def preflight_bundle(
    plan: list[tuple[str, Path]],
    force: bool,
    enforce_collisions: bool = True,
    emit: bool = True,
) -> list[Path]:
    if emit:
        print("Bundle plan:")
    existing: list[Path] = []
    for member_type, path in plan:
        exists_label = " [exists]" if path.exists() else ""
        if emit:
            print(f" - {member_type}: {path}{exists_label}")
        if path.exists():
            existing.append(path)

    if existing and not force and enforce_collisions:
        collisions = "\n".join(f" - {path}" for path in existing)
        raise FileExistsError(
            "Bundle output collision detected. Use --force to overwrite existing artifacts:\n"
            f"{collisions}"
        )

    if existing and force and emit:
        print(f"WARN: --force enabled; overwriting {len(existing)} existing artifact(s).")

    return existing


def render(member_type: str, obj_name: str, proc_name: str, library_name: str, bnddir_name: str, text: str) -> str:
    consumer_name, api_member = derived_names(obj_name)

    text = text.replace("MEMBER_NAME", obj_name)
    text = text.replace("SERVICE_PROC", proc_name)
    text = text.replace("SERVICE_API_INCLUDE_MEMBER", api_member)
    text = text.replace("LIBRARY_NAME", library_name)
    text = text.replace("BNDDIR_NAME", bnddir_name)

    if member_type == "rpgle":
        text = text.replace("MAINPROC", obj_name)
    elif member_type == "sqlrpgle":
        text = text.replace("MAINSQL", obj_name)
    elif member_type == "srvpgm-consumer":
        text = text.replace("MAINPROC", obj_name)
    elif member_type == "binder":
        text = text.replace("SERVICE_SIGNATURE", f"{obj_name}_V1R0M0")
        text = text.replace("SERVICE_SYMBOL", proc_name)
    elif member_type == "srvpgm-build":
        text = text.replace("SERVICE_NAME", obj_name)
        text = text.replace("CONSUMER_NAME", consumer_name)

    text = normalize_canonical_dow_loops(text)

    if member_type in FREE_FORMAT_TYPES:
        text = align_type_columns(text)
        validate_comment_width(text)

    if member_type in {"rpgle", "sqlrpgle", "srvpgm-module", "srvpgm-consumer"}:
        validate_on_exit_sections(text)
        validate_procedure_header_blocks(text)

    # Keep include templates generic on purpose.

    # Hard guardrail
    if member_type in FREE_FORMAT_TYPES:
        lines = text.splitlines()
        for line in lines:
            if line.strip():
                if line.strip() != "**free":
                    raise ValueError("Template no longer starts with '**free'")
                break
    return text if text.endswith("\n") else text + "\n"


def write_rendered(member_type: str, obj_name: str, proc_name: str, library_name: str, bnddir_name: str, output_path: Path, force: bool) -> Path:
    template_path = TEMPLATE_MAP[member_type]

    if not template_path.exists():
        raise FileNotFoundError(f"Missing template: {template_path}")

    if member_type in {"rpgleinc", "service-api"}:
        output_path = COPYBOOK_DIR / output_path.name

    if output_path.exists() and not force:
        raise FileExistsError(f"Output exists: {output_path} (use --force to overwrite)")

    template_text = template_path.read_text(encoding="utf-8")
    rendered = render(member_type, obj_name, proc_name, library_name, bnddir_name, template_text)

    if member_type == "srvpgm-build":
        rendered = rendered.replace("BUILD_MEMBER_NAME", output_path.stem.upper())

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8")
    return output_path


def generate_bundle(obj_name: str, proc_name: str, library_name: str, bnddir_name: str, output_dir: Path, force: bool) -> list[Path]:
    plan = build_bundle_plan(obj_name, output_dir)
    preflight_bundle(plan, force)

    created: list[Path] = []
    for member_type, path in plan:
        created.append(write_rendered(member_type, obj_name, proc_name, library_name, bnddir_name, path, force))
    return created


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate fully free-format RPG source members")
    parser.add_argument("--type", required=True, choices=sorted(set(TEMPLATE_MAP.keys()) | BUNDLE_TYPES))
    parser.add_argument("--name", required=True, help="IBM i object/member name; normalized to A-Z, 0-9, _, 10-char uppercase max")
    parser.add_argument("--proc", default="normalizeName", help="Internal/service procedure name; lowerCamelCase with letters and digits only")
    parser.add_argument("--library", default="*CURLIB", help="Target IBM i library qualifier for build recipe artifacts (for example *CURLIB or MYLIB; 10-char uppercase max for named libraries)")
    parser.add_argument("--bnddir", default="TPLBNDDIR", help="IBM i binding directory name for build recipe artifacts; 10-char uppercase max")
    parser.add_argument("--out", required=True, help="Output file path")
    parser.add_argument("--force", action="store_true", help="Overwrite output if it exists")
    parser.add_argument("--strict", action="store_true", help="Fail instead of auto-normalizing IBM i object names and internal procedure/library/bnddir identifiers to the repository-safe character set")
    parser.add_argument("--dry-run", action="store_true", help="Show normalized values/plan and collision status without writing files")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON output")
    args = parser.parse_args()

    if args.strict:
        validate_strict_inputs(args.name, args.proc, args.library, args.bnddir)

    output_path = Path(args.out).with_name(Path(args.out).name.lower())
    if args.type in {"rpgleinc", "service-api"}:
        output_path = COPYBOOK_DIR / output_path.name
    name = normalize_name(args.name)
    proc_name = normalize_proc_name(args.proc)
    library_name = normalize_library_name(args.library)
    bnddir_name = normalize_bnddir_name(args.bnddir)

    context = {
        "type": args.type,
        "dryRun": bool(args.dry_run),
        "name": name,
        "procedure": proc_name,
        "library": library_name,
        "bindingDirectory": bnddir_name,
        "force": bool(args.force),
    }

    if args.type in {"srvpgm-build", "srvpgm-bundle"} and library_name == "*LIBL":
        raise ValueError("--library *LIBL is not valid for qualified object creation in srvpgm-build artifacts; use *CURLIB or a concrete library (e.g. MYLIB)")

    if args.dry_run:
        if not args.json:
            print("DRY RUN: no files will be written.")
            print(f"Name used: {name}")
            print(f"Procedure used: {proc_name}")
            print(f"Library used: {library_name}")
            print(f"Binding directory used: {bnddir_name}")

        if args.type in BUNDLE_TYPES:
            output_dir = output_path
            plan = build_bundle_plan(name, output_dir)
            existing = preflight_bundle(plan, args.force, enforce_collisions=False, emit=not args.json)
            plan_json = [
                {"memberType": member_type, "path": str(path), "exists": path.exists()}
                for member_type, path in plan
            ]
            if existing and not args.force:
                if args.json:
                    print(
                        json.dumps(
                            {
                                "ok": False,
                                "reason": "collision",
                                **context,
                                "mode": "bundle",
                                "plan": plan_json,
                                "collisions": [str(path) for path in existing],
                                "message": "generation would fail without --force",
                            }
                        )
                    )
                else:
                    print(f"DRY-RUN RESULT: collision detected for {len(existing)} artifact(s); generation would fail without --force.")
                return 1
            if args.json:
                print(
                    json.dumps(
                        {
                            "ok": True,
                            **context,
                            "mode": "bundle",
                            "plan": plan_json,
                            "collisions": [str(path) for path in existing],
                            "message": "generation would succeed",
                        }
                    )
                )
            else:
                print("DRY-RUN RESULT: generation would succeed.")
            return 0

        if output_path.exists() and not args.force:
            if args.json:
                print(
                    json.dumps(
                        {
                            "ok": False,
                            "reason": "collision",
                            **context,
                            "mode": "single",
                            "target": str(output_path),
                            "targetExists": True,
                            "message": "generation would fail without --force",
                        }
                    )
                )
            else:
                print(f"DRY-RUN RESULT: collision detected at {output_path}; generation would fail without --force.")
            return 1
        if output_path.exists() and args.force:
            if args.json:
                print(
                    json.dumps(
                        {
                            "ok": True,
                            **context,
                            "mode": "single",
                            "target": str(output_path),
                            "targetExists": True,
                            "message": "target exists and would be overwritten",
                        }
                    )
                )
            else:
                print(f"DRY-RUN RESULT: target exists and would be overwritten: {output_path}")
            return 0
        if args.json:
            print(
                json.dumps(
                    {
                        "ok": True,
                        **context,
                        "mode": "single",
                        "target": str(output_path),
                        "targetExists": False,
                        "message": "generation would succeed",
                    }
                )
            )
        else:
            print(f"DRY-RUN RESULT: generation would succeed at {output_path}")
        return 0

    if args.type in BUNDLE_TYPES:
        output_dir = output_path
        output_dir.mkdir(parents=True, exist_ok=True)
        created = generate_bundle(name, proc_name, library_name, bnddir_name, output_dir, args.force)
        if args.json:
            print(
                json.dumps(
                    {
                        "ok": True,
                        **context,
                        "mode": "bundle",
                        "outputDir": str(output_dir),
                        "artifacts": [str(path) for path in created],
                    }
                )
            )
        else:
            print(f"OK: generated {args.type} artifacts at {output_dir}")
            for created_path in created:
                print(f" - {created_path}")
            print(f"Name used: {name}")
            print(f"Procedure used: {proc_name}")
            print(f"Library used: {library_name}")
            print(f"Binding directory used: {bnddir_name}")
        return 0

    created_path = write_rendered(args.type, name, proc_name, library_name, bnddir_name, output_path, args.force)
    if args.json:
        print(
            json.dumps(
                {
                    "ok": True,
                    **context,
                    "mode": "single",
                    "output": str(created_path),
                }
            )
        )
    else:
        print(f"OK: generated {args.type} member at {created_path}")
        print(f"Name used: {name}")
        print(f"Procedure used: {proc_name}")
        print(f"Library used: {library_name}")
        print(f"Binding directory used: {bnddir_name}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, FileNotFoundError, FileExistsError) as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
