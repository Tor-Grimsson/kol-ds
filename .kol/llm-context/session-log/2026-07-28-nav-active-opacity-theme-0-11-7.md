# Session: nav active = brightness only — theme 0.11.7

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** User rejected the `.kol-btn-nav` active background wash (oq-08 block read as pressed-tool language on quiet chrome). Nav states now ride the opacity ladder only: rest `oq-64`, active (`[aria-current="page"]`) `oq-88` glyph, background deleted; hover keeps its transient oq-04 wash. One rule edited in `kol-components-atoms.css`; published `+ @kolkrabbi/kol-theme@0.11.7`, SHIPPED-PACKAGES bumped, git push = user's. Consumer bump same session (kol-chess).
