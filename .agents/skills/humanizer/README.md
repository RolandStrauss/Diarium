# Humanizer

A portable agent skill that removes signs of AI-generated writing from text, making it sound more natural and human. It is plain Markdown, so it can run in any harness that supports skill-style instructions.

## Installation

### Skills CLI

Install with the cross-agent skills CLI:

```bash
npx skills add blader/humanizer
```

Update an existing install:

```bash
npx skills update humanizer
```

To install into every supported agent harness:

```bash
npx skills add blader/humanizer --agent '*'
```

To target one configured harness, pass its agent name:

```bash
npx skills add blader/humanizer --agent <agent-name>
```

### Claude Code plugin

Claude Code users can also install Humanizer as a plugin:

```
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

The skill is then invoked as `/humanizer:humanizer`.

### Manual

Any agent harness can use the skill directly because the runtime artifact is `SKILL.md`. Install it wherever your harness expects skill directories, or copy `SKILL.md` into an existing skill folder.

For example:

```bash
git clone https://github.com/blader/humanizer.git /path/to/your/skills/humanizer
```

Or, if you already have this repo cloned:

```bash
mkdir -p /path/to/your/skills/humanizer
cp SKILL.md /path/to/your/skills/humanizer/
```

## Usage

Invoke the skill however your agent harness exposes installed skills. Common forms include a slash command or a direct request:

```
/humanizer

[paste your text here]
```

```
Please humanize this text: [your text]
```

### Voice Calibration

To match your personal writing style, provide a sample of your own writing:

```
/humanizer

Here's a sample of my writing for voice matching:
[paste 2-3 paragraphs of your own writing]

Now humanize this text:
[paste AI text to humanize]
```

The skill will analyze your sentence rhythm, word choices, and quirks, then apply them to the rewrite instead of producing generic "clean" output.

## Overview

Based on [Wikipedia's "Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) guide, maintained by WikiProject AI Cleanup. This comprehensive guide comes from observations of thousands of instances of AI-generated text.

The skill also includes a final "obviously AI generated" audit pass and a second rewrite, to catch lingering AI-isms in the first draft.

### Key Insight from Wikipedia

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."

## 33 Patterns Detected (with Before/After Examples)

... (see `SKILL.md` for full pattern list and examples)

## References

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) - Primary source
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) - Maintaining organization

## Version History

- **2.8.2** - Replaced the full before/after example with a first-person Lisbon trip recap. The after now keeps the same topic, perspective, and rough length as the before while removing the AI tells without becoming clipped or slogan-like. No change to the 33 patterns.
- **2.8.1** - Added cross-agent installation docs, optional Claude Code plugin packaging, and a compact secondhand-text false-positive guard. No change to the 33 patterns.
- **2.8.0** - Added style/cadence patterns #31-33 for manufactured punchlines, aphorism formulas, and conversational rhetorical openers; expanded #20 to catch offer-to-continue chatbot closers. 33 patterns total.
- **2.7.0** - Added pattern #30 (diff-anchored writing); made em/en dashes a hard cut rather than "overuse"; expanded #21 to cover speculative gap-filling ("maintains a low profile"). 30 patterns total.
- **2.6.0** - Cleanup pass: consolidated the duplicated workflow sections, gated the personality guidance to content where voice is wanted, removed the model-fingerprinting subsection, and condensed the worked example. No change to the 29 patterns.
