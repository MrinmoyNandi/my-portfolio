---
title: "Code Crafter"
order: 3
category: "Minor project"
status: "Completed"
year: 2026
tags: ["Next.js", "TypeScript", "ts-morph", "React Flow", "Supabase", "Clerk", "OpenAI API"]
summary: "An AI-assisted dependency mapper that turns a public JavaScript or TypeScript repository into an interactive graph of how its files connect."
cover: "/media/Code-crafter.webp"
---
## Overview

Code Crafter maps the structure of a codebase. Give it a public GitHub repository and it parses the source, builds a graph of files and their dependencies, and renders it as a map you can explore.

The core rule: **code analysis decides the structure, and AI only explains it.** Relationships come from parsing the source, not from a model's guess.

## The problem

Unfamiliar or AI-generated repositories are hard to understand one file at a time. Imports spread across directories, a single module can touch many others, and a small change can have side effects you don't expect. Editors give you search and go-to-definition, but no single picture of the architecture.

## How it works

1. **Ingest:** fetch the supported source files of a public GitHub repository.
2. **Parse:** `ts-morph` walks the abstract syntax tree (AST) and extracts imports, exports, re-exports, dynamic imports and CommonJS `require()` calls. Framework adapters recognise conventions for Next.js, React, Express, NestJS and Docusaurus.
3. **Build the graph:** files become nodes and dependencies become edges, stored in Supabase.
4. **Visualise:** React Flow renders the map, with dagre handling the layout. Folders can be expanded to show the files inside them.
5. **Explain:** relevant, verified graph context goes to an OpenAI model to explain what a module is responsible for.

## What's in the code

- AST-based parser with per-framework adapters.
- Staged analysis pipeline with live progress updates.
- Interactive dependency map with categories and a detail pane.
- Blast-radius analysis: graph traversal that shows which modules depend on a selected file.
- AI module explanations, with responses cached.
- Clerk authentication with organisation workspaces and roles.
- Supabase PostgreSQL with Row-Level Security policies.

## Stack

- Next.js 16 (App Router) and TypeScript
- ts-morph, React Flow, dagre
- Supabase (PostgreSQL and Row-Level Security)
- Clerk
- OpenAI SDK, with LangSmith for tracing
- Tailwind CSS v4

## What's next

- Support for more languages and module systems.
- Pull request impact analysis.
- Search, filtering and better performance on large graphs.
- Repository architecture chat grounded in the verified graph.

## Status

Completed. The source is on [GitHub](https://github.com/MrinmoyNandi/CODE_CRAFTER).
