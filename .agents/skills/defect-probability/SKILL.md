---
name: defect-probability
description: Capture a reported defect, get the user's approval of its story, then assess its likelihood from available evidence.
disable-model-invocation: true
---

# Defect Probability

Create a defect story and a separate, evidence-based probability assessment in `docs/`. Keep the workflow read-only for source code.

## 1. Capture the defect

Ask the user to explain the defect in their own words. Ask only for details needed to make the story verifiable:

- Expected behavior and actual behavior
- Steps to reproduce, including inputs and configuration
- When it began and how often it occurs
- Affected users or scope, and impact
- Environment, relevant errors, logs, or screenshots

Ask focused follow-up questions for important gaps. Never invent details. Ask the user to redact credentials, tokens, personal data, and other secrets before sharing diagnostic material.

## 2. Write the story

Create `docs/defect-story-<slug>.md`, using a short kebab-case slug based on the reported behavior. If that path exists, choose a distinct slug; preserve existing files.

Use this structure:

```markdown
# Defect Story: <title>

## Summary
<User-reported problem>

## Expected behavior
<What should happen>

## Actual behavior
<What happens instead>

## Reproduction steps
1. <Step>

## Frequency and timeline
<When it began and how often it occurs, or "Unknown">

## Scope and impact
<Affected users or areas and impact, or "Unknown">

## Environment and evidence
<User-provided versions, configuration, errors, logs, or screenshots; otherwise "Not provided">

## Open questions
- <Unanswered details, or "None">
```

Keep the user's meaning intact. Mark unknowns instead of filling them with assumptions.

## 3. Get approval

Show the exact saved path and the complete story content. Ask the user to confirm it is accurate or request edits. Update the story and ask again after edits. Continue only after explicit approval. If the user declines, stop without creating a probability assessment.

## 4. Assess likelihood

After approval, treat the approved story as the source of truth for the reported conditions. Inspect only relevant repository files, tests, and available history or diagnostics. Do not modify source code, configuration, tests, or other project files. Do not run commands that alter project state.

Assess the likelihood that the reported defect is present under the described conditions. Separate:

- Likelihood of the defect from confidence in the evidence
- Observed facts from hypotheses
- Evidence that supports the defect from evidence against it

Do not present an uncalibrated guess as a measured probability. Give a numeric probability only when empirical evidence supports it, such as a reproducible trial with a stated sample size. Otherwise give a qualitative likelihood and state that a reliable numeric probability is not estimable from available evidence. Explain the evidence, assumptions, and limitations.

Create `docs/defect-probability-<slug>.md`, using the matching story slug and this structure:

```markdown
# Defect Probability Assessment: <title>

## Defect story
<Relative link to the approved defect story>

## Question assessed
<Whether the defect is present under the reported conditions>

## Assessment
<Evidence-supported numeric probability and method, or qualitative likelihood with "Numeric probability: Not estimable">

## Evidence for
- <Fact and source>

## Evidence against
- <Fact and source, or "None found">

## Assumptions and unknowns
- <Item, or "None identified">

## Confidence and limitations
<Strength and coverage of the available evidence; distinguish confidence from likelihood>

## Read-only verification
<Checks performed and results, or why no checks were available>
```

Use repository-relative links for evidence where possible. Identify tests and commands precisely, and report only checks actually performed. If evidence is insufficient, state that plainly rather than fabricating a score.

## 5. Report

Give the assessment file path, the likelihood conclusion, and the main evidence limitation. Confirm that no code or project behavior changed.
