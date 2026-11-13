#!/usr/bin/env python3
"""
Validate RPG source members against codegen-rpgle hard rules.

Usage:
  python validate-rpgle-free.py <file1> [file2 ...]
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

FORBIDDEN_DIRECTIVES = re.compile(r"(?im)^\s*/(free|end-free)\b")

# Approximation for fixed-format specs (H/F/D/I/C/O/P/A) in legacy style.
# We intentionally ignore comment lines and free-form directives.
FIXED_SPEC_LINE = re.compile(r"^[ \t]*([HFDICOPA])[ \t]+", re.IGNORECASE)

DECL_START = re.compile(
    r"^\s*(ctl-opt|dcl-[a-z]+|end-(pi|pr|proc|ds|enum)|monitor|on-error|on-exit|endmon|if|elseif|else|endif|for|dou|dow|select|when|other|endsl|endfor|return|exec\s+sql|/copy|/include)\b",
    re.IGNORECASE,
)

LIKEDS_QUALIFIED_DS = re.compile(
    r"^\s*dcl-ds\s+\w+\s+likeds\([^)]*\)(?=[^;\n]*\bqualified\b)",
    re.IGNORECASE,
)

TYPE_COLUMN = 35
COMMENT_MAX_COLUMNS = 100
RAW_NUMERIC_INDICATOR_RE = re.compile(r"\*in(?:\(\s*\d{1,2}\s*\)|\d{2})\b", re.IGNORECASE)
ALWAYS_TRUE_DOW_RE = re.compile(r"^\s*dow\s*\(\s*'1'\s*=\s*'1'\s*\)\s*;\s*$", re.IGNORECASE)
RPG_LINE_COMMENT_RE = re.compile(r"^\s*//")
PROC_HEADER_OPEN_RE = re.compile(r"^\s*//\s*<Procedure:\s*([A-Za-z_][A-Za-z0-9_]*)\s*>\s*$")
PROC_HEADER_CLOSE_RE = re.compile(r"^\s*//\s*</Procedure:\s*([A-Za-z_][A-Za-z0-9_]*)\s*>\s*$")
PROC_HEADER_SYNOPSIS_RE = re.compile(r"^\s*//\s+\S.*$")

CREATE_TABLE_RE = re.compile(r"\bCREATE\s+(OR\s+REPLACE\s+)?TABLE\b", re.IGNORECASE)
RECORD_STATUS_RE = re.compile(r"\bRECORDSTATUS\s+FOR\s+RCDSTS\b", re.IGNORECASE)
BEGINNING_TIME_RE = re.compile(r"\bBEGINNING_TIME\s+FOR\s+BEGTIM\b", re.IGNORECASE)
ENDING_TIME_RE = re.compile(r"\bENDING_TIME\s+FOR\s+ENDTIM\b", re.IGNORECASE)
TRANSACTION_START_RE = re.compile(r"\bTRANSACTION_START\s+FOR\s+TRXSTR\b", re.IGNORECASE)
PERIOD_SYSTEM_TIME_RE = re.compile(r"\bPERIOD\s+SYSTEM_TIME\s*\(\s*BEGINNING_TIME\s*,\s*ENDING_TIME\s*\)", re.IGNORECASE)
AUD_USER_RE = re.compile(r"\bAUD_USER\s+FOR\s+AUDUSR\b", re.IGNORECASE)
AUD_CHANGE_RE = re.compile(r"\bAUD_CHANGE\s+FOR\s+AUDCHG\b", re.IGNORECASE)
AUD_JOBNAME_RE = re.compile(r"\bAUD_JOBNAME\s+FOR\s+AUDJOB\b", re.IGNORECASE)
AUD_PGM_RE = re.compile(r"\bAUD_PGM\s+FOR\s+AUDPGM\b", re.IGNORECASE)

SQLTABLE_REQUIRED_PATTERNS = [
    (RECORD_STATUS_RE, "RecordStatus for rcdsts"),
    (BEGINNING_TIME_RE, "beginning_time for begtim"),
    (ENDING_TIME_RE, "ending_time for endtim"),
    (TRANSACTION_START_RE, "transaction_start for trxstr"),
    (PERIOD_SYSTEM_TIME_RE, "period system_time (beginning_time, ending_time)"),
    (AUD_USER_RE, "aud_user for audusr"),
    (AUD_CHANGE_RE, "aud_change for audchg"),
    (AUD_JOBNAME_RE, "aud_jobname for audjob"),
    (AUD_PGM_RE, "aud_pgm for audpgm"),
]

DECL_LINE_PATTERN = re.compile(
    r"^(\s*dcl-(?:s|c|pr|pi|ds)\s+)(\S+)(\s+)(.*\S.*)$",
    re.IGNORECASE,
)

BLOCK_FIELD_PATTERN = re.compile(
    r"^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s+(.*\S.*)$"
)

PROTO_START_PATTERN = re.compile(r"^\s*dcl-pr\s+([A-Za-z_][A-Za-z0-9_]*)\b", re.IGNORECASE)
PROC_START_PATTERN = re.compile(r"^\s*dcl-proc\s+([A-Za-z_][A-Za-z0-9_]*)\b", re.IGNORECASE)
PROC_DECL_PATTERN = re.compile(r"^\s*dcl-proc\b(?:\s+([^\s;]+))?", re.IGNORECASE)
MAIN_NAME_PATTERN = re.compile(r"\bmain\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)", re.IGNORECASE)


def first_nonempty_line(lines: list[str]) -> tuple[int, str] | None:
    for idx, line in enumerate(lines, start=1):
        if line.strip():
            return idx, line.rstrip("\n")
    return None


def is_comment(line: str) -> bool:
    s = line.lstrip()
    if s.lower().startswith("*in"):
        return False
    return s.startswith("//") or s.startswith("/*") or s.startswith("*")


def validate(path: Path) -> list[str]:
    errors: list[str] = []

    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception as ex:
        return [f"{path}: unable to read file ({ex})"]

    lines = text.splitlines()
    first = first_nonempty_line(lines)
    local_proto_candidates: dict[str, int] = {}
    local_proc_names: set[str] = set()
    main_proc_refs: list[tuple[int, str]] = []

    if first is None:
        errors.append(f"{path}: file is empty")
        return errors

    line_no, line_text = first
    if line_text.strip() != "**free":
        errors.append(
            f"{path}:{line_no}: first non-empty line must be exactly '**free'"
        )

    for m in FORBIDDEN_DIRECTIVES.finditer(text):
        offending = m.group(0).strip()
        start_line = text.count("\n", 0, m.start()) + 1
        errors.append(f"{path}:{start_line}: forbidden directive '{offending}'")

    # Parse ctl-opt blocks and capture any main(<procName>) references.
    i = 0
    while i < len(lines):
        line = lines[i]
        if re.match(r"^\s*ctl-opt\b", line, re.IGNORECASE):
            start_line = i + 1
            block = [line]
            i += 1
            while i < len(lines):
                block.append(lines[i])
                if ";" in lines[i]:
                    break
                i += 1
            block_text = "\n".join(block)
            for m in MAIN_NAME_PATTERN.finditer(block_text):
                main_proc_refs.append((start_line, m.group(1).lower()))
        i += 1

    in_block: str | None = None
    proc_line_no: int | None = None
    proc_name_for_error: str = "*unknown"
    proc_has_pi = False
    proc_has_on_exit = False

    for i, line in enumerate(lines, start=1):
        if RPG_LINE_COMMENT_RE.match(line):
            if len(line) > COMMENT_MAX_COLUMNS:
                errors.append(
                    f"{path}:{i}: RPG comment line exceeds {COMMENT_MAX_COLUMNS} columns; wrap to next line"
                )

        if not line.strip() or is_comment(line):
            continue

        if RAW_NUMERIC_INDICATOR_RE.search(line):
            errors.append(
                f"{path}:{i}: raw numeric indicator usage is not allowed; use a named indicator (for example, a qualified DS with ind pos(nn))"
            )

        if ALWAYS_TRUE_DOW_RE.match(line):
            errors.append(
                f"{path}:{i}: always-true sentinel loop is not allowed; use canonical shutdown-aware loop 'dow (not %shtdn ) ;'"
            )

        stripped = line.strip()
        low_stripped = stripped.lower()

        if low_stripped.startswith("dcl-pi "):
            in_block = "pi"
        elif low_stripped.startswith("dcl-pr "):
            in_block = "pr"
        elif low_stripped.startswith("dcl-ds "):
            in_block = "ds"

        if low_stripped.startswith(("end-pi;", "end-pr;", "end-ds;")):
            in_block = None

        proc_decl_match = PROC_DECL_PATTERN.match(line)
        if proc_decl_match:
            proc_line_no = i
            proc_name_for_error = proc_decl_match.group(1) or "*unknown"
            proc_has_pi = False
            proc_has_on_exit = False

        if low_stripped.startswith("dcl-pi ") and proc_line_no is not None:
            proc_has_pi = True

        if low_stripped.startswith("on-exit") and proc_line_no is not None:
            proc_has_on_exit = True

        if low_stripped.startswith("end-proc") and proc_line_no is not None:
            if not proc_has_pi:
                errors.append(
                    f"{path}:{proc_line_no}: dcl-proc '{proc_name_for_error}' must contain a dcl-pi block"
                )
            if not proc_has_on_exit:
                errors.append(
                    f"{path}:{proc_line_no}: dcl-proc '{proc_name_for_error}' must contain an explicit on-exit section"
                )
            proc_line_no = None
            proc_name_for_error = "*unknown"
            proc_has_pi = False
            proc_has_on_exit = False

        proto_match = PROTO_START_PATTERN.match(line)
        if proto_match:
            proto_name = proto_match.group(1).lower()
            if "extpgm(" not in low_stripped and "extproc(" not in low_stripped:
                local_proto_candidates[proto_name] = i

        proc_match = PROC_START_PATTERN.match(line)
        if proc_match:
            local_proc_names.add(proc_match.group(1).lower())

        if LIKEDS_QUALIFIED_DS.search(line):
            errors.append(
                f"{path}:{i}: dcl-ds with likeds(...) must not redundantly specify 'qualified'; qualification is inherited"
            )

        dcl_match = DECL_LINE_PATTERN.match(line)
        if dcl_match:
            prefix, identifier, _, _ = dcl_match.groups()
            anchor = len(prefix) + len(identifier)
            if anchor < (TYPE_COLUMN - 1):
                required_spaces = (TYPE_COLUMN - 1) - anchor
                actual_spaces = len(line[anchor:]) - len(line[anchor:].lstrip(" "))
                if actual_spaces != required_spaces:
                    errors.append(
                        f"{path}:{i}: declaration type keyword must start at column {TYPE_COLUMN}"
                    )

        if in_block in {"pi", "pr", "ds"} and not low_stripped.startswith(("dcl-", "end-")):
            field_match = BLOCK_FIELD_PATTERN.match(line)
            if field_match:
                indent, identifier, _ = field_match.groups()
                anchor = len(indent) + len(identifier)
                if anchor < (TYPE_COLUMN - 1):
                    required_spaces = (TYPE_COLUMN - 1) - anchor
                    actual_spaces = len(line[anchor:]) - len(line[anchor:].lstrip(" "))
                    if actual_spaces != required_spaces:
                        errors.append(
                            f"{path}:{i}: field/parameter type keyword must start at column {TYPE_COLUMN}"
                        )

        if FIXED_SPEC_LINE.match(line):
            # Avoid false positives for free-form identifiers that may begin with these letters.
            if not DECL_START.match(line):
                errors.append(f"{path}:{i}: possible fixed-format spec line: {line.strip()}")

        # Light semicolon enforcement for declaration/control lines expected in free form.
        if DECL_START.match(line):
            low = line.lower().strip()
            if low.startswith(("if ", "elseif ", "else", "for ", "dou ", "dow ", "select", "when ", "other", "monitor", "on-error", "exec sql", "/copy", "/include")):
                continue
            if low.startswith(("end-", "endif", "endfor", "endsl", "endmon")) and not low.endswith(";"):
                errors.append(f"{path}:{i}: free-form end statement should end with ';'")
            elif low.startswith("ctl-opt"):
                # ctl-opt often spans multiple lines; enforce semicolon at block level.
                if ";" not in line:
                    found = False
                    for look_ahead in lines[i:]:
                        if not look_ahead.strip():
                            break
                        if ";" in look_ahead:
                            found = True
                            break
                    if not found:
                        errors.append(f"{path}:{i}: ctl-opt block missing terminating ';'")
            elif low.startswith(("dcl-", "return")) and not low.endswith(";"):
                errors.append(f"{path}:{i}: statement should end with ';'")

    for proto_name, line_no in local_proto_candidates.items():
        if proto_name in local_proc_names:
            errors.append(
                f"{path}:{line_no}: redundant local dcl-pr '{proto_name}' for same-member dcl-proc; remove local/private prototypes"
            )

    for line_no, proc_name in main_proc_refs:
        if proc_name not in local_proc_names:
            errors.append(
                f"{path}:{line_no}: ctl-opt main({proc_name}) requires matching dcl-proc '{proc_name}' entry-point"
            )

    proc_decl_matches = list(PROC_START_PATTERN.finditer(text))
    for match in proc_decl_matches:
        proc_line = text.count("\n", 0, match.start()) + 1
        proc_name = match.group(1)

        if proc_line <= 1:
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' requires a procedure header synopsis block above it"
            )
            continue

        if not lines[proc_line - 2].strip():
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' must have header block immediately above (no blank line)"
            )
            continue

        block_start = proc_line - 2
        while block_start >= 0 and RPG_LINE_COMMENT_RE.match(lines[block_start]):
            block_start -= 1
        block_start += 1
        block_end = proc_line - 2
        header_block = lines[block_start : block_end + 1]

        if len(header_block) < 3:
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' header must include open tag, synopsis, and close tag"
            )
            continue

        open_match = PROC_HEADER_OPEN_RE.match(header_block[0])
        close_match = PROC_HEADER_CLOSE_RE.match(header_block[-1])
        if not open_match or not close_match:
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' header must use // <Procedure: name> ... // </Procedure: name>"
            )
            continue

        open_name = open_match.group(1).lower()
        close_name = close_match.group(1).lower()
        proc_name_l = proc_name.lower()

        if open_name != close_name or open_name != proc_name_l:
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' header name must match procedure name"
            )

        synopsis_lines = header_block[1:-1]
        if not synopsis_lines:
            errors.append(
                f"{path}:{proc_line}: dcl-proc '{proc_name}' header must include at least one synopsis line"
            )
            continue

        for offset, synopsis_line in enumerate(synopsis_lines, start=1):
            synopsis_line_no = block_start + offset + 1
            if not PROC_HEADER_SYNOPSIS_RE.match(synopsis_line):
                errors.append(
                    f"{path}:{synopsis_line_no}: synopsis line must be comment text starting with //"
                )

    if CREATE_TABLE_RE.search(text):
        for pattern, column_label in SQLTABLE_REQUIRED_PATTERNS:
            matches = pattern.findall(text)
            if not matches:
                errors.append(
                    f"{path}: embedded SQL CREATE TABLE must include standard/audit column '{column_label}'"
                )
            elif len(matches) > 1:
                errors.append(
                    f"{path}: embedded SQL CREATE TABLE must not duplicate standard/audit column '{column_label}'"
                )

    return errors


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("Usage: python validate-rpgle-free.py <file1> [file2 ...]")
        return 2

    all_errors: list[str] = []
    for raw in argv[1:]:
        p = Path(raw)
        if not p.exists():
            all_errors.append(f"{p}: file does not exist")
            continue
        all_errors.extend(validate(p))

    if all_errors:
        for err in all_errors:
            print(f"ERROR: {err}")
        return 1

    print("OK: all files passed fully free-format RPG checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
