# KolResumeExportNotExecutable — kitExportPlugin answers 500 from the published package

**Staged:** 2026-10-28 · from kol-website (consuming ResumeKit, kol-resume 0.1.0)

## The problem
`GET /api/export` in apps/record → `500 Export failed (exit 126)`:
`…/node_modules/@kolkrabbi/kol-resume/bin/export-kit.sh: Permission denied`.
In the installed 0.1.0, `bin/render-pdf.mjs` is `rwxr-xr-x` (it is in `"bin"`, so the installer sets the bit) and `bin/export-kit.sh` is `rw-r--r--` (it is not). `src/vite.js:19` runs `"${SCRIPT}"` directly. It worked in apps/resume because the workspace copy keeps the mode from git.

## The fix
Run it through the shell — `bash "${SCRIPT}" …` in every command `kitExportPlugin` builds — so the file mode stops mattering. (Adding it to `"bin"` also sets the bit, but exposes it as a command.)

## Definition of done
- [ ] export works from an installed (not workspace) copy
- [ ] published

**Remainder at kol-website:** bump; export once from apps/record.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-resume 0.1.1** — the ticket's fix as written: `kitExportPlugin` runs `bash "${SCRIPT}" …` in all four commands, so the file mode no longer matters. Proved against the packed tarball with `export-kit.sh` set to `rw-r--r--`: a direct call is refused (permission denied), the bash call builds, renders and writes a one-page A4 PDF.
