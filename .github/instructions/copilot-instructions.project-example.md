# Copilot Instructions for <PROJECT_NAME>

## ⚙️ Canonical Reference

This file contains **project-specific guidance ONLY** for `<PROJECT_NAME>`.

**For all other guidance**, defer to the canonical global file:

- **Location:** `<CANONICAL_GLOBAL_INSTRUCTIONS_PATH>`
- **Authority:** Single source of truth for role, execution priority, core principles (Caveman/Lindy/Ponytail), and response standards
- **Conflicts:** If guidance contradicts the global file, the global file wins

The role context here is **Transformation Enablement Architect** — see global file for definition.

---

## Repository-Specific Guidance

Project-specific practices below; all other guidance defers to global file.

## Project-Specific Practices

### Planning & Change Mode

- Prefer sub-agents for parallelizable or deep work; do direct edits for small, local, low-risk changes.
- Split independent changes and run them in parallel where practical.
- After changes, run relevant quality gates: documentation verification from `CONTRIBUTING.md`, `make all`, and existing codegen/validation VS Code tasks.

### Testing & Validation

- Use any testing tools available in the project.
- Always test changes; never assume they simply work.
- If no automated checks exist, state what was validated manually and what remains unverified.

### Code-Review-Graph MCP Tools

**IMPORTANT:** This project has a knowledge graph. Use code-review-graph MCP tools BEFORE Grep/Glob/Read for codebase exploration. Graph is faster, cheaper, and provides structural context that file scanning cannot.

**Fallback:** If graph tools are unavailable or error, immediately fall back to Grep/Glob/Read and continue (do not block work).

**When to use graph tools FIRST:**

- Exploring code: `semantic_search_nodes_tool` or `query_graph_tool`
- Understanding impact: `get_impact_radius_tool`
- Code review: `detect_changes_tool` + `get_review_context_tool`
- Architecture: `get_architecture_overview_tool` + `list_communities_tool`

### Graphify Knowledge Graph

This project has a graphify knowledge graph at `graphify-out/`.

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure.
- If `graphify-out/wiki/index.md` exists, navigate it for deep questions.
- Run graphify only on explicit user request; do not auto-update.
