---
name: Jekyll Theme Enhancement
overview: Enhance the existing "shura" Catppuccin-based theme with complete Swift syntax highlighting (language labels + copy button) and a shared Jekyll/Obsidian frontmatter schema with updated layouts to render the new metadata fields.
todos:
  - id: rouge-config
    content: Configure Rouge highlighter in _config.yml
    status: completed
  - id: codeblock-scss
    content: Rewrite _codeblock.scss with full Catppuccin Mocha Rouge token mapping + copy button/label styles
    status: completed
  - id: code-utils-js
    content: Create assets/js/code-utils.js for copy button and language label injection
    status: completed
  - id: post-scss
    content: Create _sass/shura/components/_post.scss for tag pills and description styles
    status: completed
  - id: update-layouts
    content: Update default.html (meta tags, script) and post.html (description + tags render)
    status: completed
  - id: update-index-scss
    content: Add _post import to _sass/shura/index.scss
    status: completed
  - id: update-post-frontmatter
    content: Update existing post frontmatter as canonical schema example
    status: completed
isProject: false
---

# Jekyll Theme: Syntax Highlighting + Obsidian Frontmatter

## Current State

- Custom "shura" theme with Catppuccin Mocha palette already in place
- `_codeblock.scss` has partial Rouge token mapping with old GitHub colors mixed in
- No code language label or copy button
- Frontmatter on posts is minimal (`layout`, `title`, `author`, `date`) — not Obsidian-aware

## 1. Configure Rouge Highlighter

Update `[_config.yml](_config.yml)` to explicitly enable Rouge with proper options:

```yaml
highlighter: rouge
markdown: kramdown
kramdown:
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
    block:
      line_numbers: false
```

## 2. Complete Catppuccin Mocha Token Mapping

Rewrite `[_sass/shura/components/_codeblock.scss](_sass/shura/components/_codeblock.scss)` with a full Rouge → Catppuccin Mocha mapping. Remove the "not used" old GitHub-style rules and replace with consistent colors:

- Keywords (`.k`, `.kd`, `.kr`, etc.) → `$mauve`
- Functions (`.nf`, `.fm`) → `$blue`
- Types/classes (`.nc`, `.kt`) → `$yellow`
- Strings (`.s`, `.s1`, `.s2`) → `$green`
- Numbers (`.m`, `.mi`, `.mf`) → `$peach`
- Comments (`.c`, `.c1`, `.cm`) → `$overlay-2`
- Operators (`.o`, `.ow`) → `$sky`
- Builtins (`.nb`) → `$red`

Also add styles for:

- `.code-wrapper` — relative container for the copy button + language label overlay
- `.code-lang-label` — pill badge (top-left) showing language name
- `.code-copy-btn` — copy icon button (top-right)

## 3. Copy Button + Language Label (new file)

Create `[assets/js/code-utils.js](assets/js/code-utils.js)`:

- On `DOMContentLoaded`, find all `div.highlighter-rouge` elements
- Extract language from `language-*` class → render label badge
- Inject a copy button that calls `navigator.clipboard.writeText()` with a check-mark feedback

Add `<script src="/assets/js/code-utils.js">` to `[_layouts/default.html](_layouts/default.html)`.

## 4. Shared Jekyll + Obsidian Frontmatter Schema

Define a convention using fields that both tools understand natively:

```yaml
---
layout: post           # Jekyll only (Obsidian ignores unknown fields)
title: "Post Title"
date: 2024-04-27
author: Sean Zhang
description: "One-sentence summary for SEO and Obsidian properties panel."
tags:
  - swift
  - ios
aliases:               # Obsidian link aliases; Jekyll ignores this
  - "Alternate Title"
---
```

- `tags` — Jekyll renders tag filtering, Obsidian shows in graph/search
- `description` — used in `<meta name="description">` by Jekyll, shown in Obsidian properties
- `aliases` — Obsidian-only (Jekyll safely ignores unrecognized frontmatter keys)
- `layout`, `permalink` — Jekyll-only (Obsidian ignores)

## 5. Update Layouts to Use New Frontmatter

`**[_layouts/default.html](_layouts/default.html)**` — add `<meta name="description">` and `<meta name="keywords">` tags using `page.description` and `page.tags`.

`**[_layouts/post.html](_layouts/post.html)**` — render description as a subtitle, and display tags as styled pill badges below the post header.

## 6. Post Metadata Styles (new file)

Create `[_sass/shura/components/_post.scss](_sass/shura/components/_post.scss)`:

- `.post-description` — muted subtitle style using `$subtext-0`
- `.post-tags` — flex row of tag pills using `$surface-0` background + `$mauve` text

Import in `[_sass/shura/index.scss](_sass/shura/index.scss)`.

## Files Changed

- `_config.yml` — Rouge config
- `_layouts/default.html` — meta tags + script tag
- `_layouts/post.html` — description + tags display
- `_sass/shura/components/_codeblock.scss` — full rewrite with Catppuccin Rouge mapping
- `_sass/shura/components/_post.scss` — new, post metadata styles
- `_sass/shura/index.scss` — add `_post` import
- `assets/js/code-utils.js` — new, copy button + language label
- `_posts/2024-04-27-type-erasure-in-swift.md` — update frontmatter as canonical example

