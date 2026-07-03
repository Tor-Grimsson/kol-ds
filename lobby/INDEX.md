# Component lobby

Staging bay for components flung in from consumer apps via the `kol-lobby` skill.
Each entry is a spec the DS **recreates from** — not source. To promote: build the
component under `packages/component/src/{atoms,molecules,organisms}/` to spec, then
delete its lobby entry.

This is a work queue, not published docs — it intentionally sits outside `docs/`
and does not follow the `docs/_framework` conventions.

| Component | Source | Staged | Status |
|-----------|--------|--------|--------|
