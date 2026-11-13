---
name: jackson-structured-development
description: >
  Analyse, design, document, review, or convert software using Jackson
  Structured Design (JSD), Jackson Structured Programming (JSP), Jackson
  structure diagrams, entity life histories, process structures, sequence,
  selection, and iteration. Use when the user mentions Jackson, JSD, JSP,
  Jackson diagrams, Jackson flowcharts, program structure diagrams, or asks
  to derive program structure from input and output data structures.
---

## Purpose

Apply Jackson Structured Programming and Jackson Structured Design
consistently when analysing existing systems or designing new processing
logic.

Disambiguate early:

- Jackson Structured Programming is not Java Jackson JSON libraries.
- JSP here is not JavaServer Pages.
- Jackson structure diagrams are not generic flowcharts.
- JSD here is not JavaScript documentation.

## Core operating rules

1. Classify scope first: JSP, JSD, Jackson diagramming, reverse engineering,
   or notation conversion (for example PlantUML).
2. Preserve observable business behaviour unless user explicitly asks for
   change.
3. Derive program structure from data structure; do not start from procedural
   code and retrofit structure (except explicit reverse-engineering requests).
4. Use only Jackson constructs unless user asks otherwise:
   - sequence;
   - selection;
   - iteration.
5. Separate source evidence from interpretation.
6. Do not invent records, events, files, entities, conditions, or steps not
   supported by source material.
7. Surface structure clashes explicitly; do not silently force invalid merges.

## Required workflow

### 1. Inspect evidence

Identify:

- inputs and outputs;
- records, fields, ordering, grouping;
- repetitions, optional structures, mutually exclusive structures;
- boundaries, termination conditions, and entity events/actions;
- existing source-code behaviour.

### 2. Build input/output structures

For each relevant input and output, model:

- sequence;
- selection;
- iteration;
- optional elements;
- termination conditions.

### 3. Map correspondences

Document:

- direct correspondences;
- transformations;
- unmatched components;
- ordering differences;
- potential structure clashes.

### 4. Derive Jackson program structure

Merge compatible input/output structures into one program structure while
preserving behaviour and structural truth.

### 5. Allocate operations

Place operations at the owning structural component:

- validation near validated component;
- initialization before relevant iteration;
- processing inside corresponding component;
- finalization after corresponding iteration.

### 6. Express control semantics

For each selection, state explicit condition.

For each iteration, state:

- initialization;
- continuation or termination condition;
- progression step;
- empty-input behaviour.

### 7. Produce implementation guidance

Only after structure is fixed, provide pseudocode or language guidance.
When targeting RPGLE, SQLRPGLE, CL, Java, TypeScript, or another language,
preserve Jackson structure even when syntax differs.

## Required output (when applicable)

1. Scope and assumptions
2. Input structures
3. Output structures
4. Entity and event model
5. Correspondence list
6. Structure clashes
7. Jackson program structure
8. Operation allocation
9. Pseudocode
10. PlantUML representation
11. Traceability to source evidence
12. Open questions
13. Review checklist

## Diagram conventions

- Use consistent markers for sequence, selection, iteration, and optional
  components.
- If PlantUML cannot natively express required Jackson notation, use
  `templates/jackson-flowchart-template.puml` and state representational
  limitations.
- Do not label an activity diagram as an exact Jackson structure diagram unless
  mapping rules are explicitly stated.

## Caveman + Lindy + Ponytail alignment

- Caveman: responses concise, structured, and signal-first.
- Lindy: favor timeless Jackson fundamentals over trendy abstractions.
- Ponytail: smallest faithful model that preserves behaviour; no speculative
  complexity.

## Review checklist

- [ ] JSD, JSP, JavaServer Pages, and Java Jackson were disambiguated.
- [ ] Every major component is supported by source evidence.
- [ ] Inputs and outputs were structurally analysed.
- [ ] Sequence, selection, and iteration are correctly distinguished.
- [ ] Selection conditions are explicit.
- [ ] Iteration termination conditions are explicit.
- [ ] Structure clashes are identified.
- [ ] Operations are allocated to structural components.
- [ ] Generated pseudocode preserves the derived structure.
- [ ] Existing IBM i business behaviour is unchanged unless justified.
- [ ] Assumptions and unresolved questions are listed.

## File map

- `references/jsd-notation.md` — JSD notation reference
- `references/jsp-notation.md` — JSP notation reference
- `references/structure-diagram-rules.md` — diagram quality rules
- `references/mapping-to-plantuml.md` — conversion guidance
- `templates/jsd-analysis-template.md` — analysis worksheet
- `templates/jsp-program-structure-template.md` — implementation shape template
- `templates/jackson-flowchart-template.puml` — renderable flow template
- `examples/sequence-example.md` — sequence-only example
- `examples/iteration-example.md` — iteration example
- `examples/selection-example.md` — selection example
- `examples/ibmi-rpgle-example.md` — IBM i RPGLE-oriented example

@AGENTS.md
