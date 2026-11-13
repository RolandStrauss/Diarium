---
description: Canonical IBM i source member naming standards (10-character maximum)
applyTo: '.agents/skills/codegen-*'
---

# IBM i Source Member Naming Standards (Authoritative)

**Scope:** All IBM i source members generated or modified by any codegen skill
**Standard:** Maximum 10-character member names (IBM i native object naming limit)
**Enforcement:** Automatic via `normalize_name()` functions in all generate scripts

---

## The 10-Character Rule (Mandatory)

IBM i native object names (tables, programs, files, etc.) are limited to **10 characters maximum**.
While newer SQL naming allows longer "SYSTEM NAME" aliases, all **physical source member names** must conform to the 10-character limit for compatibility with:

- Traditional CL compilation commands (`CRTRPGMOD`, `CRTPGM`, `CRTBL`, etc.)
- Native IBM i object naming conventions
- Cross-system migration and portability
- Existing tooling and scripts

## Formatting independence

- Naming rules do not authorize indentation, spacing, or alignment changes.
- When applying naming standards to an existing member, preserve the member's
  established indentation and spacing unless the developer explicitly asks for
  formatting changes.

### Rationale

- **IBM i System Limit:** Operating system limit for object names (5250 SAVF names, library object names, file member names)
- **Backward Compatibility:** Legacy systems and migration tools expect 10-character identifiers
- **Consistency:** Member names must match corresponding object names after compilation
- **Portability:** Tools like SAVF, DSKTBL, and cross-partition copy utilities depend on this limit

---

## Naming Convention by Artifact Type

### RPGLE/SQLRPGLE/RPGLEINC

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| Program | `TPLPGM` (7 chars) | `TPL{purpose}` or `APP{purpose}` | Use 3-letter prefix + 4-7 descriptive chars |
| Module | `TPLMOD01` (8 chars) | `TPL{name}{seq}` | Up to 10 total; use 2-digit sequence if many |
| Service Program | `TPLSVC` (6 chars) | `TPL{name}` | Short descriptive name, no "SVC" suffix (bloats name) |
| Include (RPG) | `TPLCONST` (8 chars) | `TPL{name}` | Typically shorter for frequently included files |
| Copybook (RPG) | `TPLPROTO` (8 chars) | `TPL{name}` | Usually named similarly to INCLUDE |

### COBOL (CBLLE/SQLCBLLE/CPY)

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| Program | `TPLCBL01` (8 chars) | `TPL{name}{seq}` | Similar to RPGLE; use sequence numbers |
| Module | `TPLMOD01` (8 chars) | `TPL{name}{seq}` | Matches RPGLE module convention |
| Copybook | `TPLCTX` (6 chars) | `TPL{name}` | Keep copybooks short; frequently included |

### CL (CLLE/CLP/CL)

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| ILE Program | `TPLCL01` (7 chars) | `TPL{name}{seq}` | Standard 3-letter prefix + 4 chars |
| CL Program | `TPLRUN01` (8 chars) | `TPL{name}{seq}` | Traditional CL follows same rules |

### SQL (SQLTABL/SQLVIEW/SQLPRC/SQLTRG/SQLIDX)

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| Table | `DDGMTRRUL` (9 chars) | `{prefix}{object}` | 10-char member name; long SYSTEM NAME allowed in SQL |
| View | `DDGMTRV01` (9 chars) | `{prefix}{name}{seq}` | 10-char limit for member; longer in SQL context |
| Procedure | `DDGMTRUPD` (9 chars) | `{prefix}{verb}{object}` | Typical: 3-letter prefix + 4-6 descriptive |
| Trigger | `DDGMTRTRG` (9 chars) | `{prefix}{object}TRG` | Convention: base name + "TRG" suffix (may exceed 10; truncate) |
| Index | `DDGMTRIDX` (9 chars) | `{prefix}{object}IDX` | Convention: base name + "IDX" suffix (may exceed 10; truncate) |

### DDS (PF/LF/DSPF/PRTF)

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| Physical File | `TPLCUSPF` (8 chars) | `TPL{name}` | Standard DDS naming |
| Logical File | `TPLCUSLF` (8 chars) | `TPL{name}LF` | Base name + "LF" suffix (must stay ≤10) |
| Display File | `TPLDSP01` (8 chars) | `TPL{name}{seq}` | No "DSPF" suffix (bloats name) |
| Printer File | `TPLPRT01` (8 chars) | `TPL{name}{seq}` | No "PRTF" suffix (bloats name) |

### UIM (PNLGRP/MENU)

| Artifact Type | Example | Pattern | Rules |
|---|---|---|---|
| Panel Group | `TPLPNL01` (8 chars) | `TPL{name}{seq}` | Standard 3-letter prefix + 5 chars |
| Menu | `TPLMENU` (7 chars) | `TPL{name}` | Short descriptive name |

---

## Algorithm: `normalize_name(input)`

All codegen scripts implement this algorithm to enforce the 10-character maximum:

```python
def normalize_name(name: str, fallback: str = "TPLDEFAULT") -> str:
    # 1. Convert to uppercase
    uppercase = name.upper()

    # 2. Remove non-alphanumeric chars (keep underscore, drop others)
    cleaned = "".join(ch for ch in uppercase if ch.isalnum() or ch == "_")

    # 3. Truncate to max 10 characters
    truncated = cleaned[:10]

    # 4. Return result or fallback if empty
    return truncated if truncated else fallback
```

### Examples

| Input | After Cleanup | After Truncate (10) | Result |
|---|---|---|---|
| `AccountMaster` | `ACCOUNTMASTER` | `ACCOUNTMAS` | `ACCOUNTMAS` |
| `metric_rules_table` | `METRIC_RULES_TABLE` | `METRIC_RUL` | `METRIC_RUL` |
| `DDG_MTR_RULES` | `DDG_MTR_RULES` | `DDG_MTR_RU` | `DDG_MTR_RU` |
| `MyProcedure` | `MYPROCEDURE` | `MYPROCEDUR` | `MYPROCEDUR` |
| `T@#$%` | `T` | `T` | `T` |
| `` (empty) | `` | `` | `TPLDEFAULT` |

---

## File Name vs. SQL Object Name (Dual Naming Strategy)

### For SQL Artifacts (Tables, Views, Procedures, etc.)

IBM i SQL allows **two names** for objects:

1. **Member Name** (10-char limit, native object identifier):
   ```sql
   CREATE TABLE DDGMTRRUL ...
   ```
   - Enforced by OS filesystem
   - Used by compiled programs, CL commands, SAVF/restore tools
   - Physical source member: `tplaccmst.sqltabl` (10 chars or less)

2. **SQL SYSTEM NAME** (longer alias, optional in SQL context):
   ```sql
   CREATE TABLE DDGMTRRUL FOR SYSTEM NAME "MetricRulesTable" ...
   ```
   - Optional; used by SQL tools and documentation
   - Can be 128+ characters
   - Does NOT change the compiled object name in the OS

### Example: Metric Rules Table

**Codegen Rule:**
- Input: `"metric_rules_master"` (19 chars)
- Member name used: `METRIC_RUL` (10 chars, normalized)
- SQL object name: same, `METRIC_RUL`
- Optional SQL long name: `MetricRulesMaster` (via `FOR SYSTEM NAME`)

**Generated DDL:**
```sql
CREATE TABLE METRIC_RUL
  FOR SYSTEM NAME "MetricRulesMaster"
  (
    rule_id INT NOT NULL,
    ...
  );
```

---

## Enforcement Points

### 1. Generation Scripts (Mandatory)

Every `generate-{type}-member.py` script must:
- Call `normalize_name(args.name)` before creating the member
- Document the enforcement in usage/help
- Log the actual member name used (for audit trail)

**Current Status:** ✅ All scripts (`codegen-rpgle`, `codegen-sql`, `codegen-clle`, `codegen-cblle`, `codegen-dds`, `codegen-dspf`) already enforce this via `normalize_name()`

### 2. Validation Scripts (Recommended)

Each `validate-{type}-source.py` script should:
- Warn if the member name in the source header exceeds 10 characters
- Verify metadata header "Source Name" field matches the 10-character rule
- Allow warnings-only mode for legacy members that may exceed the limit

### 3. SKILL.md Documentation (Required)

Each SKILL.md must:
- Reference this canonical instruction file: "`See .github/instructions/ibmi-source-naming.instructions.md`"
- Document the 10-character limit in a "Naming Rules" or "Hard Rules" section
- Show 1-2 examples specific to the skill's artifact types

### 4. Template Generation Tasks (Automation)

All VS Code tasks (`tasks.json`) that invoke `generate-*.py` must:
- Accept `--name` parameter with user input
- Document the 10-character limit in the task description
- Pass `--name` to the script (which normalizes internally)

---

## Special Cases & Exceptions

### When Truncation Causes Collision

If normalizing two different user inputs results in the same 10-character name:

**Example:**
- Input 1: `AccountMaster` → `ACCOUNTMAS`
- Input 2: `AccountMaintenance` → `ACCOUNTMAI` (wait, that's still different)

Actually, collisions are rare due to uniqueness of first 10 chars in most business domains.
If collision occurs:

1. **User is responsible for input names.** Use shorter, more distinct names.
2. **Script logs the actual result.** User can retry with different input.
3. **Never auto-increment collisions.** Do not append counters or UUIDs (violates IBM i conventions).

### Legacy Members with Names > 10 Chars

If you encounter a source member whose **physical filename** exceeds 10 characters:

1. **This violates IBM i standards** and was likely created outside normal OS conventions.
2. **Codegen skills will NOT generate members > 10 chars.**
3. **Migration path:** Rename the legacy member to ≤10 chars before processing.

### SQL Long Names (Do NOT confuse with member names)

SQL tables can have long logical names via `FOR SYSTEM NAME`:

```sql
CREATE TABLE METRIC_RUL
  FOR SYSTEM NAME "VeryLongMetricRulesTable" ...
```

- **Member name:** `METRIC_RUL` (10 chars, enforced by OS)
- **SQL SYSTEM NAME:** `VeryLongMetricRulesTable` (optional, 128 chars allowed)
- **Codegen behavior:** Always uses the 10-char member name as the default SQL object name; optional `FOR SYSTEM NAME` alias can be added by user post-generation if needed.

---

## Integration with Other Standards

### JSP (Jackson Structured Programming)

No naming impact. JSP applies to procedure logic, not object names.

### Audit Columns (Temporal/Standard Columns)

No naming impact. Audit columns are table columns, not object names.

### Comment Formats

No naming impact. Comment rules are separate from naming rules.

### Service Programs & Binder

- **Module name:** Subject to 10-character rule
- **Service program name (bound object):** Subject to 10-character rule
- **Binder source member:** Subject to 10-character rule
- **Example:**
  - Module: `TPLUTIL` (6 chars)
  - Service program: `TPLUTIL` (same name, different object type)
  - Binder source: `TPLUTIL.bnd` (6 + 4 extension = 10 chars total filename, but member name is `TPLUTIL`)

---

## Testing & Validation

### How to Test

1. **Run existing codegen e2e tasks:**
   ```bash
   npm run codegen-rpgle-e2e-proof
   npm run codegen-sql-e2e-proof
   npm run codegen-dds-e2e-proof
   # ... etc
   ```
   All tasks should generate members with ≤10 character names.

2. **Generate a member with a long input name:**
   ```bash
   python .agents/skills/codegen-rpgle/scripts/generate-rpgle-member.py \
     --name "VeryLongAccountMasterProgram" \
     --type rpgle \
     --out qrpglesrc/test.rpgle
   # Result: member name used = "VERYLOGACC" (truncated to 10 chars)
   ```

3. **Inspect generated metadata header:**
   The source member's metadata header should show the **actual truncated name** used:
   ```rpgle
   // Source Name .........: VERYLOGACC
   // Created By ...........: Generator
   ```

---

## Checklist for Skill Augmentation

When augmenting a codegen skill to enforce this standard:

- [ ] Verify `normalize_name()` function exists in `generate-{type}-member.py`
- [ ] Verify `normalize_name()` truncates to ≤10 characters
- [ ] Verify `normalize_name()` removes non-alphanumeric chars (keeps underscore)
- [ ] Verify script logs the actual member name used (for audit)
- [ ] Add reference to this instruction file in SKILL.md ("Naming Rules" section)
- [ ] Add 10-character limit mention in SKILL.md "Hard Rules" section
- [ ] Update validation script to warn on oversized names in metadata header
- [ ] Test with long input names (>10 chars); verify truncation works
- [ ] Verify existing samples still generate correctly
- [ ] Update task description in `tasks.json` to mention 10-character limit

---

## Questions & Support

**Q: Can I use a name longer than 10 characters?**
A: No. Codegen skills will automatically truncate to 10 chars. If you need a longer logical name, use SQL `FOR SYSTEM NAME` alias (optional, post-generation).

**Q: What if my naming convention uses 11-character names?**
A: Adopt IBM i standard naming (10-char max). This is a hard system limit, not a preference.

**Q: Can I override the truncation in a codegen skill?**
A: No. All codegen skills enforce the 10-character limit automatically. The limit is non-negotiable for IBM i compatibility.

**Q: What about file extensions like `.rpgle`, `.sql`, `.clle`?**
A: Extensions are separate from member names. The **member name** (before the dot) must be ≤10 chars. The full filename (member + extension) can be longer, but the OS object name is derived from the member name only.

---

## References

- **IBM i System Limits:** https://www.ibm.com/docs/en/i/7.4?topic=idb2-system-limits
- **IBM i SQL Naming:** https://www.ibm.com/docs/en/i/7.4?topic=statements-create-table
- **DDS File Naming:** https://www.ibm.com/docs/en/i/7.4?topic=file-data-description-specifications
