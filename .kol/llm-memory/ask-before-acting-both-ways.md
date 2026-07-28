---
name: ask-before-acting-both-ways
description: "Standing rule — propose and get an explicit go before ANY repo change, fixes AND reverts alike; never act unilaterally, never drift outside the named work scope."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a601fdfb-505a-47b9-8e26-d2ea1b38755a
---

Never change repo files without an explicit go — and that applies in BOTH directions: new work AND reverts/corrections. Stating a plan and executing it in the same turn is acting without asking. Also: stay inside the named work scope (e.g. "chess") — do not sweep adjacent packages (foundry, demos, docs rulings) because they look related.

**Why:** 2026-07-15, twice in one day. (1) "I want to work on ThemeToggle" was treated as a go-signal and edits landed uninvited. (2) During the button-sweep correction, an out-of-scope foundry change was reverted immediately without asking — the user interrupted the tool call: "STOP DOING SHIT WITHOUT ASKING — that goes BOTH ways." The earlier sweep itself had drifted from the chess scope into foundry/Accordion/doc law rewrites, which is what triggered the correction.

**How to apply:** Shape every non-trivial action as "Here's my idea — [plan]. Sound good?" and STOP until the user answers. A revert is a change like any other — propose it, wait. Unilateral rulings on design law (variant sets, retirement decisions) are never mine to make. Scope = what the user named; anything outside it gets flagged as a proposal, not executed. Related: [[every-component-in-atomic-taxonomy]].
