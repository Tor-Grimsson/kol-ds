#!/usr/bin/env bash
set -euo pipefail

# Export the job-application kit to PDF — one combined file per theme.
#
# Builds the app and serves the static output with `vite preview` on a
# DEDICATED port (not the user's 5173), renders each route with headless
# Chrome, and merges them in kit order (Cover → Résumé → Letter → Portfolio →
# Back) with pdfunite. Kills only its own server on exit; never touches a live
# dev session. A production build (not the dev server) is what keeps Chrome's
# network-idle from hanging — see the preview note below.
#
# Rendering goes through puppeteer-core (app/scripts/render-pdf.mjs), which waits
# for fonts + images before printing — see that file. Never reintroduce the
# legacy --virtual-time-budget flag; it hangs forever under --headless=new.
#
# Usage: scripts/export-kit.sh [theme ...]      (default: light dark)
#        scripts/export-kit.sh --v2             (light only, no background
#                                                colors, downscaled images →
#                                                out/$NAME-kit-light-v2.pdf)
#
# Flags (combinable with explicit themes):
#   --plain      render with ?plain=1 — strips every background fill so the kit
#                prints ink-on-white (light theme only; dark text needs a light bg)
#   --downscale  shrink the printed images (portrait + portfolio heroes) in the
#                BUILT dist/ before previewing — originals in public/ are untouched
#   --icelandic  render every route with ?lang=is (Icelandic kit), output suffix
#                -icelandic
#   --svg        export each section as a self-contained SVG with editable <text>
#                (out/svg/*.svg) + a vector PDF merged from them — for Illustrator
#   --v2         shorthand: light only + --plain + --downscale, output suffix -v2
#   --continuous fit-to-length PDF from /resume/t/kit-continuous — one page per
#                section at its natural height (not A4-paginated) → out/…-continuous.pdf
#
# Env: KIT_QUERY — extra URL query appended to every rendered route, e.g.
#      "&pages=cover,resume&role=Art%20Director&company=Acme". Set by the
#      /api/export endpoint from the preview's own options overlay; it narrows
#      which kit sections compile and fills the cover letter's Role/Company.

# CARRIED INTO @kolkrabbi/kol-resume (ResumeKit, 2026-10-28): the app is the caller's working directory (the vite
# plugin spawns this with cwd = the app root), render-pdf.mjs is the package's own, and the file stem is $KIT_NAME —
# nobody's name is baked in.
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${KIT_APP:-$PWD}"
APP="$ROOT"
NAME="${KIT_NAME:-kit}"
OUT="$ROOT/out"
PORT=5180
BASE="http://localhost:$PORT"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PLAIN=0; DOWNSCALE=0; SVG=0; CONTINUOUS=0; SINGLE=0; ROUTE_SINGLE=""; NAME_SINGLE=""; SUFFIX=""; KIT_LANG="en"; THEME_ARGS=()
for a in "$@"; do
  case "$a" in
    --v2)        PLAIN=1; DOWNSCALE=1; SUFFIX="-v2"; THEME_ARGS=(light) ;;
    --continuous) CONTINUOUS=1; PLAIN=1; DOWNSCALE=1; THEME_ARGS=(light) ;;  # fit-to-length PDF from /resume/t/kit-continuous (light plain, like --v2)
    --single=*)  SINGLE=1; PLAIN=1; THEME_ARGS=(light)  # one route → one ink-on-white A4 PDF (the layout treatments' download buttons)
                 rest="${a#--single=}"; ROUTE_SINGLE="${rest%%:*}"; NAME_SINGLE="${rest#*:}" ;;
    --plain)     PLAIN=1 ;;
    --downscale) DOWNSCALE=1 ;;
    --icelandic) KIT_LANG="is" ;;   # render every route with ?lang=is
    --svg)       SVG=1; DOWNSCALE=1 ;;  # editable-text SVG per section (implies downscale — images inline as data URIs)
    light|dark)  THEME_ARGS+=("$a") ;;
    *) echo "unknown arg: $a" >&2; exit 2 ;;
  esac
done
if [ "${#THEME_ARGS[@]}" -gt 0 ]; then THEMES=("${THEME_ARGS[@]}"); else THEMES=(light dark); fi
QUERY=""; [ "$PLAIN" -eq 1 ] && QUERY="&plain=1"
[ "$KIT_LANG" = "is" ] && { QUERY="$QUERY&lang=is"; LANGSUF="-icelandic"; } || LANGSUF=""
# Kit options from the caller (vite's /api/export sets this) — already a
# URL-encoded "&pages=…&role=…&company=…" fragment. Env, so it never hits the shell.
QUERY="$QUERY${KIT_QUERY:-}"
DOWNSCALE_MAX=1400   # longest side; heroes show thumbnail-size, portrait smaller

# Render one URL to PDF through puppeteer-core (CDP) — app/scripts/render-pdf.mjs.
# It waits for document.fonts.ready + image decode before the snapshot, so the
# PDF can't bake a fallback font or drop an image, then closes Chrome itself.
# (Replaces a bare `chrome --print-to-pdf`, which raced the fonts and lingered.)
print_pdf() {  # $1 (unused)  $2 out.pdf  $3 url
  local out="$2" url="$3"
  rm -f "$out"
  CHROME="$CHROME" node "$HERE/render-pdf.mjs" "$url" "$out" >>"$TMP/render.log" 2>&1
  [ -s "$out" ]
}

# The whole kit is ONE route — the /resume/t/kit-a4 treatment the user actually
# sees, where A4Page lays each section onto real A4 sheets with proper margins.
# (The old per-section routes printed the wide screen layout, so the portfolio
# overflowed the page.) Language rides $QUERY (&lang=is). label = temp filename.
ROUTES=( "kit:/resume/t/kit-a4" )

mkdir -p "$OUT"
TMP="$(mktemp -d)"

echo "▸ building app (production)"
( cd "$APP" && VITE_BUCKET_LOCAL=1 node_modules/.bin/vite build >"$TMP/build.log" 2>&1 ) \
  || { echo "build failed:"; cat "$TMP/build.log"; exit 1; }

# The images the kit prints, fetched into the build's own dist/bucket/ (VITE_BUCKET_LOCAL=1 points the app there): the
# buckets are the only copy (2026-10-28), and a remote image is not reliably decoded before Chrome prints. The cover
# photo comes from the private bucket through wrangler's login, the portfolio heroes from the public R2.
# THE IMAGES ARE THE APP'S (ResumeKit, 2026-10-28): record fetched its cover from a private bucket through wrangler and
# its heroes from R2 here. In the package that is the app's own step — `scripts/fetch-kit-images.sh`, run with APP and
# TMP set, if the app has one; record's block is that file now (its RecordOnKolResume ticket).
if [ -x "$APP/scripts/fetch-kit-images.sh" ]; then
  echo "▸ fetching kit images ($APP/scripts/fetch-kit-images.sh)"
  APP="$APP" TMP="$TMP" "$APP/scripts/fetch-kit-images.sh" || { echo "image fetch failed"; exit 1; }
fi

# Downscale the images that actually print (cover photo + portfolio heroes) inside
# the built dist/ — fetched above; the buckets keep the full-size originals. Heroes render at thumbnail size in the grid and
# the portrait small, so a 1400px cap is invisible but slashes the PDF weight.
if [ "$DOWNSCALE" -eq 1 ]; then
  echo "▸ downscaling kit images (cap ${DOWNSCALE_MAX}px)"
  shopt -s nullglob
  # every image the app's fetch step put under dist/bucket (record's cover and heroes were named here; $COVER went with
  # its fetch block)
  { find "$APP/dist/bucket" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) 2>/dev/null || true; } | while IFS= read -r f; do
    [ -f "$f" ] || continue
    before=$(stat -f%z "$f" 2>/dev/null || echo 0)
    # Downscale ONLY — sips -Z upsamples images already under the cap (softens
    # the portrait, bloats the file), so resize only when the long side exceeds it.
    w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight/{print $2}')
    long=$(( w > h ? w : h ))
    [ "$long" -gt "$DOWNSCALE_MAX" ] && sips -Z "$DOWNSCALE_MAX" "$f" >/dev/null 2>&1
    case "$f" in *.jpg|*.jpeg) sips -s formatOptions 78 "$f" >/dev/null 2>&1 || true ;; esac
    after=$(stat -f%z "$f" 2>/dev/null || echo 0)
    echo "    · ${f#"$APP"/dist/}  ${long}px  $((before/1024))K → $((after/1024))K"
  done
  shopt -u nullglob
fi

# Serve the STATIC build, not the dev server: vite preview has no HMR websocket
# and streams no module requests, so headless Chrome's "network idle" fires
# immediately. The dev server never reaches idle on heavier routes → Chrome hangs.
echo "▸ starting preview server on :$PORT"
( cd "$APP" && exec node_modules/.bin/vite preview --port "$PORT" --strictPort >"$TMP/serve.log" 2>&1 ) &
VITE_PID=$!
trap 'kill "$VITE_PID" 2>/dev/null; rm -rf "$TMP"' EXIT

for i in $(seq 1 80); do
  curl -sf "$BASE/" >/dev/null 2>&1 && break
  if ! kill -0 "$VITE_PID" 2>/dev/null; then echo "preview died:"; cat "$TMP/serve.log"; exit 1; fi
  sleep 0.5
done

# Single layout treatment → one ink-on-white A4 PDF (the /resume/t/<slug> download
# buttons hit this via /api/export?layout=<slug>). Renders that one route only.
if [ "$SINGLE" -eq 1 ]; then
  echo "▸ rendering single route $ROUTE_SINGLE"
  out="$OUT/$NAME_SINGLE.pdf"
  print_pdf "$TMP/chrome-single" "$out" "$BASE$ROUTE_SINGLE?theme=light$QUERY" \
    || { echo "single render failed:"; cat "$TMP/render.log"; exit 1; }
  echo "  → $out  ($(du -h "$out" | cut -f1 | tr -d ' '), $(qpdf --show-npages "$out") pp)"
  echo "✓ done"
  exit 0
fi

# SVG export — one self-contained SVG per kit section (continuous mode), with
# live <text> + embedded fonts + inlined images: editable type in Illustrator.
# No rsvg→PDF here: librsvg ignores the embedded webfonts (falls back to system
# fonts), so that PDF would be font-unfaithful — the faithful flat PDF is the
# default (non-SVG) export. SVGs are the editable deliverable.
if [ "$SVG" -eq 1 ]; then
  echo "▸ rendering SVG (editable text)"
  SVGROUTE="/resume/t/kit-continuous?theme=light$QUERY"
  SVGDIR="$OUT/svg"; rm -rf "$SVGDIR"
  CHROME="$CHROME" node "$APP/scripts/render-svg.mjs" "$BASE" "$SVGROUTE" "$SVGDIR"
  echo "  → $SVGDIR/*.svg  (open in Illustrator)"
  echo "✓ done"
  exit 0
fi

# Continuous PDF — one page per section, each sized to fit its own content length
# (the /resume/t/kit-continuous look), instead of the A4-paginated employer PDF.
# render-pdf.mjs writes a numbered PDF per section; pdfunite merges them in order.
if [ "$CONTINUOUS" -eq 1 ]; then
  echo "▸ rendering continuous PDF (fit-to-length pages)"
  CDIR="$TMP/continuous"; rm -rf "$CDIR"
  CHROME="$CHROME" node "$HERE/render-pdf.mjs" "$BASE/resume/t/kit-continuous?theme=light$QUERY" "$CDIR" continuous >>"$TMP/render.log" 2>&1 \
    || { echo "continuous render failed:"; cat "$TMP/render.log"; exit 1; }
  out="$OUT/$NAME-kit-continuous$LANGSUF.pdf"
  pdfunite "$CDIR"/*.pdf "$out"
  echo "  → $out  ($(du -h "$out" | cut -f1 | tr -d ' '), $(qpdf --show-npages "$out") pp)"
  echo "✓ done"
  exit 0
fi

for theme in "${THEMES[@]}"; do
  echo "▸ rendering $theme"
  parts=()
  for entry in "${ROUTES[@]}"; do
    label="${entry%%:*}"; path="${entry#*:}"
    pdf="$TMP/$theme-$label.pdf"
    if print_pdf "$TMP/chrome-$theme-$label" "$pdf" "$BASE$path?theme=$theme$QUERY"; then
      echo "    · $label"
      parts+=("$pdf")
    else
      echo "    · $label  ⚠ render failed — skipped (see $TMP/render.log)"
    fi
  done
  out="$OUT/$NAME-kit-$theme$SUFFIX$LANGSUF.pdf"
  pdfunite "${parts[@]}" "$out"
  echo "  → $out  ($(du -h "$out" | cut -f1 | tr -d ' '), $(qpdf --show-npages "$out") pp)"
done

echo "✓ done"
