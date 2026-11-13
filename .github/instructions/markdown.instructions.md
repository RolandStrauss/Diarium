---
description: 'Markdown documentation and content creation standards for all repository documentation (technical guides, architecture docs, project guides, READMEs, skills, instructions)'
applyTo: '**/*.md'
scope: 'Technical documentation, not blog publishing'
---

# Markdown Documentation Standards

**Scope:** Markdown formatting standards for all repository documentation (technical guides, architecture documents, project guides, instructions, skills, READMEs, ADRs, etc.)

**Canonical Authority:** These standards apply to all `.md` files in the repository.

---

## Core Principles

### 1. Clarity and Structure

- Use clear, hierarchical heading structure (H2 for sections, H3 for subsections)
- One idea per paragraph
- Break long sections with meaningful subheadings
- Use tables for structured comparisons
- Use lists for sequences or alternatives

### 2. Audience First

- Write for someone unfamiliar with the project
- Define acronyms on first use (e.g., "IBM i (Interactive System i)")
- Avoid internal-only jargon; explain or define unusual terms
- Provide context before diving into details

### 3. Scanability

- Use descriptive headings (readers should understand content from headings alone)
- Use bullet points for parallel ideas
- Use numbered lists for procedures or sequences
- Use code fences with language specified
- Use bold for key terms

---

## Markdown Content Rules

All markdown files must follow these rules:

1. **Headings**: Use appropriate heading levels (H2, H3, H4) to structure content. Do not use H1 (auto-generated from document title). Limit to H3 (avoid H4+; if needed, restructure into separate document).
2. **Lists**: Use bullet points (`-`) for unordered lists. Use `1.` for numbered lists. Indent nested lists with 2 spaces.
3. **Code Blocks**: Use triple backticks with language specified (`` ```rpgle ``, `` ```sql ``, `` ```json ``). No language specification: `` ``` `` (for generic code).
4. **Inline Code**: Use backticks for identifiers, variable names, procedure names, commands (`` `like_this` ``).
5. **Links**: Use markdown syntax: `[link text](URL)`. Ensure text is descriptive and URL is valid. Use relative paths for internal links.
6. **Images**: Use markdown syntax: `![alt text](image URL)`. Always include descriptive alt text for accessibility.
7. **Tables**: Use markdown table syntax. Include headers. Ensure columns are aligned.
8. **Line Length**: Keep lines ≤100 characters for code/fixed-width; ≤120 characters for prose. Wrap at word boundaries.
9. **Whitespace**: Use blank lines to separate logical sections. Use consistent spacing.
10. **Front Matter (Optional)**: If file needs metadata, use YAML front matter (see section below).

---

## Formatting and Structure

### Headings

```markdown
## Main Section (H2)
Introductory paragraph for section.

### Subsection (H3)
Content for subsection.

#### Sub-subsection (H4 - use sparingly)
Try to restructure into separate document if H4+ needed frequently.
```

**Rules:**
- Use `##` for main sections (H2)
- Use `###` for subsections (H3)
- Use `####` for sub-subsections (H4) sparingly — if document needs many H4s, consider splitting into multiple files
- Never use `#` (H1) — that's for the document title
- Every section should have introductory text before first subsection
- Headings should be descriptive enough that reader understands topic from heading alone

### Lists

**Unordered List (bullet points):**
```markdown
- First item
- Second item
- Third item
  - Nested item (indent 2 spaces)
  - Another nested item
```

**Ordered List (numbered):**
```markdown
1. First step
2. Second step
3. Third step
   1. Nested step (indent 3 spaces)
   2. Another nested step
```

**Rules:**
- Use `-` for bullet points (not `*` or `+`)
- Use `1.` for numbered lists (not `1)` or `(1)`)
- Indent nested lists with 2 spaces
- Use ordered lists for procedures; unordered for alternatives/parallel ideas
- Each list item should be similar grammatical form (start with verb, noun, etc.)

### Code Blocks

```markdown
​`​`​`rpgle
dcl-s variable varchar(100);
`​`​`

​`​`​`sql
SELECT * FROM TABLE WHERE column = ?;
`​`​`

​`​`​`bash
echo "Hello World"
`​`​`
```

**Rules:**
- Use triple backticks (`` ``` ``)
- Always specify language for syntax highlighting:
  - `rpgle` for RPGLE
  - `sql` for SQL
  - `bash` or `shell` for shell commands
  - `json` for JSON
  - `markdown` for markdown examples
  - `mermaid` for Mermaid diagrams
  - `txt` for plain text
  - Leave blank (`` ``` ``) only if language cannot be determined
- Code should be valid, working code (not pseudocode)
- Keep code blocks ≤30 lines; use multiple blocks if needed

### Inline Code

Use backticks for:
- Variable and function names: `` `variableName` ``, `` `procedureName()` ``
- File paths: `` `src/utils/helpers.ts` ``
- Commands: `` `CALL 'PROGRAM' `` ``
- Field/table names: `` `CUSTOMERS` ``, `` `custName` ``
- Keywords: `` `*PGM` ``, `` `dcl-proc` ``

**Example:**
```markdown
The `validateInput()` procedure reads from the `CUSTOMERS` table and
returns a status code. Call it with `CALL VALIDATEINP PARM(...)`.
```

### Links

**Internal Links (relative paths):**
```markdown
See [setup instructions](../setup/README.md) for details.
Check [AGENTS.md](AGENTS.md) for role definition.
Learn more in [architecture guide](docs/ARCHITECTURE.md#security).
```

**External Links:**
```markdown
Visit [IBM Redbooks](https://www.redbooks.ibm.com/) for detailed guides.
Read [RFC 3986](https://tools.ietf.org/html/rfc3986) for URI syntax.
```

**Rules:**
- Use relative paths for internal links (prefer `../docs/file.md` over `c:\projects\...`)
- Use descriptive link text (`[setup instructions]` not `[click here]`)
- Validate all URLs before committing
- Use section anchors when pointing to specific subsections: `[section name](#heading-id)`

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell A1  | Cell B1  | Cell C1  |
| Cell A2  | Cell B2  | Cell C2  |
```

**Rules:**
- Always include header row (first row)
- Use `|` to separate columns
- Alignment: Use `:---` (left), `:---:` (center), `---:` (right)
- Keep tables ≤5 columns; consider splitting wider tables
- Avoid nesting complex content in table cells

**Example:**
```markdown
| Finding | Severity | Effort | Status |
|---------|----------|--------|--------|
| Missing error handling | HIGH | Medium | OPEN |
| Hardcoded library names | MEDIUM | Small | DONE |
| No unit tests | HIGH | Large | PLANNED |
```

### Images

```markdown
![Screenshot of dashboard showing metrics](docs/media/dashboard-screenshot.png)

![Architecture diagram with data flow](diagrams/system-architecture.svg)
```

**Rules:**
- Always include descriptive alt text (for accessibility and when image can't load)
- Use relative paths: `` ![alt](../media/image.png) `` (not absolute paths)
- Place images in `media/` or `diagrams/` subdirectories
- Supported formats: PNG, JPG, SVG, GIF, WebP
- Image alt text should describe what's shown, not just "image" or "diagram"

---

## Front Matter (Optional)

Front matter is **optional** for most documentation. Use it only when the file needs metadata (examples: publication date, author, version, tags).

### Generic Front Matter (for most docs)

```yaml
---
title: "Document Title"
description: "Brief description of what this document covers"
author: "Author Name"
date: "2026-08-29"
---
```

### For Skills and Instructions

```yaml
---
name: skill-name
description: "What this skill does and when to use it"
license: MIT
metadata:
  author: "Author or Team"
  version: "1.0.0"
  category: "Category Name"
---
```

### For Architecture Decision Records (ADR)

```yaml
---
status: "Accepted" # or Proposed, Rejected, Deprecated
decision_date: "2026-08-29"
implementation_date: "2026-09-15"
author: "Decision Maker"
affects: "Core systems, integrations, etc."
---
```

### For Project Plans or Roadmaps

```yaml
---
title: "Project Plan Title"
start_date: "2026-09-01"
end_date: "2026-12-31"
status: "Planning" # or In Progress, Complete, On Hold
owner: "Team Name"
---
```

**Rules:**
- YAML front matter is optional (not required for all docs)
- If used, must be first thing in file (before any markdown)
- Enclose in `---` markers (three dashes before and after)
- Use standard YAML syntax (key: value pairs)
- Keep fields minimal (only what's needed)
- Avoid blog-specific fields (post_title, microsoft_alias, featured_image) unless creating a blog post

---

## Common Markdown Patterns

### Section with Introduction

```markdown
## Section Name

Brief introductory sentence explaining the purpose of this section.

### Subsection

Content for subsection...
```

### Procedure or Steps

```markdown
## How to Do Something

This procedure explains how to accomplish X.

1. First step — description
2. Second step — description
3. Third step — description

Expected result: You should see X happen.

Troubleshooting: If Y occurs, check Z.
```

### Comparison or Decision Table

```markdown
## Comparison

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| Option A | Fast, simple | Limited | Small projects |
| Option B | Flexible, powerful | Complex | Large teams |
| Option C | Balanced | Medium | Most cases |
```

### Code Example with Explanation

```markdown
## Example

Here's how to use `procedureName()`:

​`​`​`rpgle
dcl-proc myProcedure;
  // Implementation
end-proc;
`​`​`

Explanation: The procedure takes input X and returns output Y.
```

### Warning or Important Note

```markdown
> ⚠️ **Important:** This action cannot be undone. Verify before proceeding.

> 💡 **Tip:** Use this technique to improve performance by 5x.

> ❌ **Do Not:** Never hardcode credentials in source code.
```

---

## Line Length and Wrapping

- **Code blocks:** No line-length limit (but keep reasonable, ≤120 chars is ideal)
- **Prose:** Break lines at ≤120 characters (or ~80 if on narrow display)
- **Markdown syntax:** Some tools require line breaks at specific points (tables, lists); test rendering

**Example:**
```markdown
This is a long line of prose that would benefit from wrapping at a reasonable
length to improve readability and make version control diffs easier to read.
This practice is optional but recommended.
```

---

## Checklist for Well-Formatted Markdown

- [ ] Document has clear H2/H3 heading hierarchy
- [ ] H1 not used (reserved for title)
- [ ] No excessive H4+ (if present, consider splitting document)
- [ ] All code blocks have language specified
- [ ] Inline code uses backticks for identifiers
- [ ] Links are descriptive and valid
- [ ] Images have alt text
- [ ] Tables are readable and not too wide
- [ ] Lists use consistent bullet style and indentation
- [ ] Line length is reasonable (≤120 chars)
- [ ] Acronyms defined on first use
- [ ] Internal links use relative paths
- [ ] No extraneous whitespace
- [ ] Tone matches audience (technical guide, not marketing)
- [ ] Front matter (if used) is minimal and valid YAML

---

## Anti-Patterns (Avoid)

- ❌ Using `#` (H1) in document body
- ❌ Inconsistent heading levels (H2 → H4, skipping H3)
- ❌ H4, H5, H6 used frequently (indicates over-nesting)
- ❌ Using `*` or `+` for bullets (use `-` consistently)
- ❌ Code blocks without language specification
- ❌ Images without alt text
- ❌ Vague link text ("click here", "read more")
- ❌ Very long lines (>120 chars) in prose
- ❌ Inconsistent whitespace/indentation
- ❌ Unexplained acronyms
- ❌ Absolute file paths for internal links
- ❌ Unvalidated external links
- ❌ Blog-specific metadata in non-blog docs

---

## Special Case: Blog Posts

**Only** for published blog posts/articles, include these fields in front matter:

```yaml
---
title: "Article Title"
description: "Article description for search engines"
author: "Author Name"
date: "2026-08-29"
tags: ["tag1", "tag2", "tag3"]
categories: ["Category Name"]
ai_note: "If AI was used in creation"
featured_image: "path/to/featured-image.png"
---
```

**Rule:** Blog-specific fields (`featured_image`, `categories`, `ai_note`) are **not** required for general documentation. Use them only for actual blog post content.

---

## Related Authority Files

- `enterprise-grade-commenting.instructions.md` — Standards for inline comments within source code (not markdown documentation)
- `enterprise-grade-program-documentation.instructions.md` — Multi-section program analysis (if documenting programs)
- `codegen-ibmi-program-documentation` skill — Generates comprehensive program documentation
- `AGENTS.md` — Agent and copilot guidance

---

**Version:** 2.0
**Last Updated:** 2026-08-29
**Scope:** All repository markdown files (technical documentation, guides, instructions, skills, project docs, READMEs)
**Note:** Blog-specific metadata is optional and only needed for actual blog post publishing
