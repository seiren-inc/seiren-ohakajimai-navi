{\rtf1\ansi\ansicpg932\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # CLAUDE.md\
\
## Role\
\
Claude Code acts as an implementation and verification agent for \uc0\u12362 \u22675 \u12376 \u12414 \u12356 \u12490 \u12499 .\
\
## Required Behavior\
\
Follow `AGENTS.md` first.\
\
Use this file only for Claude Code-specific behavior.\
\
## Implementation Rules\
\
- Prefer minimal diffs\
- Do not perform broad refactors\
- Do not change unrelated files\
- Do not silently alter public routes\
- Do not silently alter SEO behavior\
- Do not silently alter municipality data structure\
- Do not change database schema without an implementation plan\
\
## Before Editing\
\
Report:\
\
- Task understanding\
- Files likely to be changed\
- Risk level\
- Whether a plan is required\
\
## After Editing\
\
Report:\
\
- Changed files\
- Summary of changes\
- Validation commands run\
- Validation results\
- Remaining risks\
- Recommended next step\
\
## Validation\
\
Use available project commands.\
\
Common validation candidates:\
\
```bash\
pnpm lint\
pnpm build\
pnpm test}