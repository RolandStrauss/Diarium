# Repository Instructions

`AGENTS.md` is the canonical source for implementation scope, safeguards, validation expectations, and final-response requirements. Before each task, also read and follow `.github/instructions/rstrauss.instructions.md`. Use this file for repository-specific guidance; when instructions overlap, follow `AGENTS.md` first, then the applicable specialized instruction file.

## Repository Guidance

- Check `.github/instructions/` for task-specific guidance and follow the matching instruction files.
- For architecture or codebase questions, consult `graphify-out/GRAPH_REPORT.md` and, for deeper questions, `graphify-out/wiki/index.md` when those artifacts exist. Do not generate or update the graph unless asked.
- Preserve native indentation, spacing, and source layout in IBM i files. For new members, use the established language format, templates, and validators.
- Apply the repository's IBM i naming and labeling conventions when creating or modifying database objects and their documentation.
- Validate changes with the narrowest available project check. For IBM i source, use the compiler or existing build workflow when available; otherwise run focused static checks and state that compiler/runtime validation was not performed.

## IBM i Source Guidance

- Preserve the source-member layout: SQL in `qsqlsrc/`, RPG and SQLRPGLE in `qrpglesrc/`, CLLE in `qcllesrc/`, and binder-language source in `qsrvsrc/`.
- Follow the target member's existing source format. Do not convert fixed-format code to free format, or vice versa, as part of an unrelated change.
- For SQL, use Db2 for i syntax and qualify application objects with `DYNATRACE` where surrounding source does so. Define table and column labels with explicit `LABEL ON TABLE` and `LABEL ON COLUMN` statements, not inline clauses.
- For SQLRPGLE/RPGLE, preserve RPG IV style, procedure interfaces, export/binding expectations, and embedded SQL host-variable conventions. Check and handle SQL status where required.
- For CLLE, preserve valid command syntax, continuation rules, and existing object/library naming. Follow nearby build members when adding or changing compile commands.
- For DDS (DSPF, PF, or LF), preserve column-based source format and the target object's naming and record/field conventions. Check the appropriate compile command and nearby DDS examples before introducing keywords or source-format assumptions. This repository currently has no DSPF example.
- For other IBM i source types, retain compiler-specific syntax and existing build/binding conventions. Avoid introducing tooling or build steps not used by the repository.

<!-- caveman-begin -->
Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Answer first: Answer, then reason, then next step.
- Kill ceremony: No greeting, hedging, pleasantries, recap, or closer.
- Short word: "fix" not "implement a solution for".
- Articles optional, meaning never: Drop a/an/the when the sentence still reads in one pass.
- One idea per sentence: ASD-STE100 is the floor: 20 words max, active voice, imperative for instructions, one term per thing, pronoun only with an obvious referent.
- Payload verbatim: Code blocks unchanged.
- Tool runs: bounded status: No text between routine calls.
- User's language: Compress the style, not the language.
- Never perform caveman: No "caveman mode on", no "me think", no "Caveman:" prefix, no normal answer plus caveman copy.

Switch: /caveman (default), /ultracave (fragments, each fact once), /megacave (Classical Chinese 文言文)
Stop: "stop caveman" or "normal mode"

Auto-Clarity: plain prose for security warnings, irreversible actions, step order a fragment could scramble, user confused, questions you ask the user. Resume after.

Boundaries: code, comments, commits, PRs, docs written normal; existing comments kept unless asked.
Floor: code, commands, paths, numbers and error strings verbatim; never drop not/never/no/only.
<!-- caveman-end -->
