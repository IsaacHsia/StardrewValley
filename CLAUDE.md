# CLAUDE.md

## Wiki Knowledge Management System

Based on [Karpathy's LLM Wiki Design](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

---

## Architecture

### Three Layers

1. **Raw Sources** → `raw/` - Immutable collection of articles, papers, images, data
2. **The Wiki** → `Wiki/` - LLM-generated markdown (summaries, entities, concepts, synthesis)
3. **The Schema** → `CLAUDE.md` - This file, defining structure and conventions

---

## Folder Structure

```
.
├── Wiki/                      # Wiki content (git-tracked)
│   ├── index.md               # Content-oriented catalog
│   ├── log.md                 # Chronological append-only record
│   ├── tech-{name}/          # Technical patterns
│   ├── team-{name}/          # Organizational knowledge
│   ├── project-{name}/        # Project-specific patterns
│   ├── process-{name}/        # Workflows and processes
│   ├── synthesis/             # Cross-domain insights
│   └── dashboards/           # Markdown-first dashboards
├── Wiki-inbox/               # Personal drop zone (not git-tracked)
├── Worklogs/                 # Task artifacts (raw layer)
├── Projects/                 # Code artifacts (raw layer)
└── raw/                      # Source materials (raw layer)
    ├── assets/               # Downloaded images
    └── sources/              # Ingested documents
```

---

## Naming Convention

Folders: `{category}-{name}`
- `tech-bigquery/`, `tech-transformers/`
- `team-engineering/`, `team-design/`
- `project-launch/`, `project-migration/`
- `process-onboarding/`, `process-code-review/`

---

## Frontmatter Schema

```yaml
---
title: Title
tags: [tag1, tag2]
date: YYYY-MM-DD
source-count: N
confidence: high|medium|speculative
status: active|superseded|archived
open-questions:
  - unanswered question
contradictions:
  - Source A says X, Source B says Y
---
```

---

## Core Operations

### Ingest
1. Drop new source in `Wiki-inbox/` or `raw/sources/`
2. LLM reads and analyzes
3. Discuss takeaways
4. Write summary to appropriate Wiki folder
5. Update `Wiki/index.md`
6. Update relevant entity/concept pages
7. Append to `Wiki/log.md`

### Query
1. Search relevant Wiki pages
2. Read and synthesize
3. Cite sources
4. File valuable outputs back into Wiki

### Lint
- Check for contradictions
- Flag stale claims
- Find orphan pages
- Verify cross-references
- Identify data gaps

---

## Key Principles

- The wiki is a **persistent, compounding artifact**
- Cross-references already exist; contradictions flagged; synthesis reflects all sources
- The LLM does **summarizing, cross-referencing, filing, and bookkeeping**
- `index.md` and `log.md` are the two **special files** for navigation
- The wiki is just a **git repo** — version history, branching, collaboration come free

---

## Workflow Prompts

### Ingest New Source
```
Analyze this source and create appropriate Wiki entries:
1. Create summary in relevant category folder
2. Update index.md with new entry
3. Add to log.md
4. Link to/from related pages
```

### Query Knowledge
```
Search the Wiki for relevant information, synthesize an answer,
and cite sources. File valuable insights back into the Wiki.
```

### Lint Wiki
```
Run health-check:
- Find orphan pages (unlinked pages)
- Flag contradictions and stale content
- Check for missing cross-references
- Verify frontmatter completeness
```
