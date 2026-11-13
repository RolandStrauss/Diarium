---
name: codegen-uim
description: Generate IBM i UIM panel group members (.pnlgrp, .menu) using repository-aligned WMS/Cobra conventions. Use when creating or refactoring IBM i menu panel groups.
version: 1.0.0
author: Roland Strauss
category: IBMi
tags:
  - ibmi
  - uim
  - menus
  - 5250
---

## Purpose

Generate compile-ready IBM i UIM panel-group source using stable, minimal patterns.

## Strategic modernization guidance (authoritative)

**Canonical Reference:** See `.github/instructions/modernizing-ibmi-applications.instructions.md`.

Use that file when the request is about broader interface modernization,
workflow simplification, or how menu-driven navigation should evolve alongside
the rest of the IBM i application.

- This skill owns UIM menu/panel-group structure, action wiring, and compile-
  ready member output.
- The modernization instruction owns the higher-level interface goal: reduce user
  friction, support clearer workflows, and keep IBM i capabilities relevant in a
  connected environment.
- Prefer UIM structures that improve discoverability and navigation, not just
  cosmetic rearrangement.

## Ferraria standards authority and role semantics (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-ferraria-standards.instructions.md`.

Use that file as the cross-skill authority when UIM generation touches Legacy Solutions / Ferraria presentation boundaries, naming ambiguity, or handler-role questions.

- `SH` owns presentation and navigation concerns.
- Keep business logic and direct data retrieval in service/data layers, not panel-group structure.
- Preserve existing contracts when older names do not cleanly reflect modern SH/RH/CH/SP/FM roles.

## Variable declaration sequence (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-variable-declaration-sequence.instructions.md`.

When creating declarations (global or local), apply this order when applicable:

1. Files
2. Copy member include of declaratives
3. Procedure Interface
4. Data Structures
5. Stand Alone Variables
6. Enumeration
7. Constants

Rules:

- Apply "when/if applicable": UIM artifacts may only use a subset of categories.
- Keep panel/menu ownership rules unchanged; this sequence governs declaration ordering only.
- If any example/template ordering in this file differs, the canonical instruction above wins.

## Opening structured metadata block (UIM artifacts)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md` for UIM comment-format and metadata-placement guidance.

All UIM files (MENU, PNLGRP) should start with metadata block, then synopsis, then revision history (within first `:pnlgrp.` block):

```uim
:pnlgrp.
:comment.
  <Metadata>
  Source Name .........: CUSTMENU
  Created By ...........: Your Name
  Date Created .........: YYYY-MM-DD
  Source Description ..: Customer maintenance menu.
  Jira ..................: LSPS-XXXX (or N/A)
  </Metadata>
.
:comment.
  <Synopsis>
  Main menu for customer add/update/delete/inquire operations.
  Entry points: F1 Help, F3 Exit, F12 Cancel.
  </Synopsis>
.
:comment.
  <Revision History>
  Revisioner | Date | Jira No (if known) | Change |
  Your Name | YYYY-MM-DD | LSPS-XXXX | Initial scaffold |
  </Revision History>
.

:menu name='CUSTMENU'.
```

**Metadata-block rules:**
- Sections in order: Metadata → Synopsis → Revision History → menu/panel content
- Use the repository's opening structured metadata pattern; when editing existing UIM, preserve the member's established metadata style (`:comment.` blocks, `:help`, or equivalent structured markup)
- Date format: ISO 8601 (`YYYY-MM-DD`)
- Jira: Full ticket number (e.g., `LSPS-4295`) or `N/A`
- When modifying existing code, add entry to Revision History; preserve all existing entries
- Place metadata block within first `:pnlgrp.` structure, before menu/panel definitions

**Metadata contents (universal across all skills):**
- Source Name (actual member name)
- Created By (developer name)
- Date Created (ISO 8601: `YYYY-MM-DD`)
- Source Description (single-line summary)
- Jira (ticket or `N/A`)

## Native indentation and spacing (authoritative)

**Canonical Reference:** See `.github/instructions/ibmi-comment-formats.instructions.md`.

- Preserve existing UIM indentation and spacing when editing an existing member.
- Do not reflow tag indentation, attribute spacing, or include layout unless the
  developer explicitly asks for formatting changes.
- For new members, use the native UIM structured layout from repo patterns and
  keep nested blocks consistently indented.

## Jackson Structured Programming scaffold (required)

**Authoritative Reference:** See `.github/instructions/ibmi-jsp-scaffold.instructions.md` for the canonical JSP pattern, shared across all IBM i codegen skills.

**UIM-Specific Application:**
- Apply JSP to **menu structure** (not individual tags): Initialize opening blocks/keys → Input capture menu intent → Process route by option/type → Output close blocks/emit help
- One canonical flow per panel group: init → input → process → output
- No duplicate menu intent; no contradictory action mappings; each selected path has exactly one deterministic outcome

**Quick Reference (UIM):**

1. **Initialise** — open structural blocks, keys, defaults
2. **Input** — capture menu intent, validate option/object mappings
3. **Process** — route by option type, process menu items consistently
4. **Output** — emit actions/help, close all blocks cleanly

## Core principles alignment (Caveman, Lindy, Ponytail)

- **Caveman:** concise, deterministic, compile-ready output.
- **Lindy:** prefer proven UIM structures and IBM i menu conventions.
- **Ponytail:** smallest member shape that works; avoid speculative complexity.

## Scope

Use when user asks for:

- new `*.menu` or `*.pnlgrp` members
- refactoring existing menu/panel-group source
- standardizing function keys, command-line behavior, and help panels

Boundary clarification:

- UIM panel groups (`.menu`, `.pnlgrp`) are in-scope.
- 5250 display/printer DDS members (`.dspf`, `.prtf`) are out-of-scope and
  must be generated by `codegen-dspf`.
- Do not duplicate DSPF contracts (`ALIAS`, `DSPATR`, `<FIELD>A` attribute
  fields) in this skill.

## Companion `DODDRULSH.loadSubfile` reference

**Authoritative Reference:** See
`.github/instructions/ibmi-jsp-scaffold.instructions.md`, section
`Canonical Subfile List-Hydration Procedure (DODDRULSH.loadSubfile)`.

- UIM menus may launch a maintenance shell that uses this scaffold, but UIM does
  not own subfile refresh, row hydration, or READC option handling.
- Keep menu/help text aligned with the downstream shell behavior; do not claim
  option semantics that the launched maintenance shell does not implement.

## Source Member Naming (IBM i Standard: 10-character Maximum)

**Authoritative Reference:** See `.github/instructions/ibmi-source-naming.instructions.md` for complete naming standards and rules.

### Naming enforcement (UIM consideration)

- UIM panel group and menu members must follow the same **maximum 10-character member-name** standard used across IBM i skills
- This is a naming standard, not an optional style preference
- Preserve existing contractual legacy names when editing, but generate new member names within the 10-character limit

### Examples by artifact type

| Artifact | Example Input | Recommended Output | Notes |
|----------|---|---|---|
| Panel Group (PNLGRP) | `"CustomerMaintenance"` | `CUSTOMERM` | First 10 chars; UIM-friendly |
| Menu | `"MainApplicationMenu"` | `MAINAPPLIC` | Truncated to 10 chars; keeps menu prefix recognizable |

### Rationale

Keeping panel group and menu member names within 10 characters:
- Aligns with IBM i member/object naming constraints used across this repository
- Improves portability across systems and archives
- Maintains consistency with compiled-object naming patterns in the same project
- Supports legacy tooling and SAVF/restore workflows

## Hard rules (non-negotiable)

1. Member opens with `:pnlgrp.` and closes with `:epnlgrp.` unless explicitly creating include-only fragments.
2. Each menu panel defines `:keyl` (or references one), `:panel`, `:menu`, and at least one `:menui`.
3. Each selectable option declares both `action=` and `help=`.
4. Declared function keys include corresponding help entries.
5. Do not include credentials, hostnames, tokens, or environment secrets.

Note: include-driven members that start with `.im @header` are compliant when that include expands to `:pnlgrp.`.

## Deterministic action matrix

Use these defaults unless user explicitly requests otherwise:

- `*PGM` object: `action='cmd call PGMNAME'`
- `*CMD` object: `action='cmd ?CMDNAME'`
- Menu navigation: `action='menu MENUNAME'`
- Standard fallback option: `option=90` with `action='cmd signoff'`

When object type is unknown:

1. prefer `:cond expr='CHKOBJ(...)'` with intended type
2. if unresolved, emit safe scaffold marker (`help='menu/nohelp'` + TODO note)
3. do not guess object type in production output

## Cobra-derived defaults

- Prefer include composition order when include members exist:
  1) `.im @header`
  2) `:var` / `:cond`
  3) `.im @stdkeys`
  4) `.im @title`
  5) `.im @options`
  6) `.im @cmdshort` or `.im @cmdlong`
  7) `.im @help`
- Default command line: short (`:cmdline size=short.`); use long only for command-heavy workflows.
- Key baseline: `F1`, `F3`, `F4`, `F9`, `F12`, `Enter`.
- Guard option actions with `CHKOBJ(...)` when object availability can vary.
- Normalize new generation to lowercase tags/attributes for consistency.

## Generation workflow

1. Identify target kind (standalone member vs include fragment).
2. Detect available include fragments in `qpnlsrc`.
3. Compose include-based member when includes exist; otherwise emit self-contained source.
4. Apply object-type action matrix and add `:cond CHKOBJ(...)` guards.
5. Add menu/key/option help entries.
6. Validate closures and references.

## Validation checklist

- [ ] balanced UIM blocks (`:pnlgrp/:epnlgrp`, `:menu/:emenu`, `:help/:ehelp`)
- [ ] each `:menui` has `action=` and `help=`
- [ ] each `help='menu/...'` resolves to a matching `:help name='menu/...'`
- [ ] keys referenced by panel are declared in `:keyl`
- [ ] no unresolved placeholders in production output

## Definition of done

1. Structural blocks are balanced and member terminates with `:epnlgrp.`.
2. Option actions match object types (`*PGM` => `cmd call`; `*CMD` => `cmd ?`) with guards where needed.
3. Help references resolve.
4. No new diagnostics/errors.

@AGENTS.md
