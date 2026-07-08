---
"@kolkrabbi/kol-icons": minor
---

Icon inventory Tier-1 cull: removed 361 legacy `src/svg/` files that could never render (name-shadowed by `stroke/`/`solid/`, which resolve first) and 8 byte-identical same-name duplicates. Every icon name resolves exactly as before — zero render change; the inventory drops from 2,104 SVGs to 1,735 (stroke 880 · solid 849 · svg 6). Ledger: `.kol/llm-context/backlog/2026-07-08-icon-cull-ledger.md`.
