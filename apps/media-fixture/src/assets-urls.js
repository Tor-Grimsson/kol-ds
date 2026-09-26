/* The carried files themselves, as Vite asset URLs (`?url` so text files are served,
 * not parsed as modules). Split from `assets.js` so that one stays importable from Node. */

import f_01_tier_rules_md from './assets/01-tier-rules.md?url'
import f_README_md from './assets/README.md?url'
import f_andvaka_mp3 from './assets/andvaka.mp3?url'
import f_casino_mp3 from './assets/casino.mp3?url'
import f_client_js_txt from './assets/client.js.txt?url'
import f_dobani_wav from './assets/dobani.wav?url'
import f_favicon_kol_ds_svg from './assets/favicon-kol-ds.svg?url'
import f_favicon_svg from './assets/favicon.svg?url'
import f_invaders_flac from './assets/invaders.flac?url'
import f_kol_core_css_txt from './assets/kol-core.css.txt?url'
import f_kol_kerner_2_pdf from './assets/kol-kerner-2.pdf?url'
import f_kol_kerner_pdf from './assets/kol-kerner.pdf?url'
import f_logo_svg from './assets/logo.svg?url'
import f_optic_reaction_mp4 from './assets/optic-reaction.mp4?url'
import f_package_json from './assets/package.json?url'
import f_pnpm_workspace_yaml from './assets/pnpm-workspace.yaml?url'
import f_radar_ascii_png from './assets/radar-ascii.png?url'
import f_softforms_3d_mp4 from './assets/softforms-3d.mp4?url'
import f_softforms_mp4 from './assets/softforms.mp4?url'
import f_tt_01_jpg from './assets/tt-01.jpg?url'
import f_tt_02_jpg from './assets/tt-02.jpg?url'
import f_tt_03_jpg from './assets/tt-03.jpg?url'
import f_tt_04_jpg from './assets/tt-04.jpg?url'
import f_tt_05_jpg from './assets/tt-05.jpg?url'
import f_tt_06_jpg from './assets/tt-06.jpg?url'
import f_tt_07_jpg from './assets/tt-07.jpg?url'
import f_PPRightGrotesk_Fine_woff2 from './assets/PPRightGrotesk-Fine.woff2?url'
import f_TGRotVF_ttf from './assets/TGRotVF.ttf?url'
import f_credits_txt from './assets/credits.txt?url'
import f_hls_segment_000_ts_bin from './assets/hls/segment_000.ts.bin?url'
import f_hls_segment_001_ts_bin from './assets/hls/segment_001.ts.bin?url'
import f_hls_segment_002_ts_bin from './assets/hls/segment_002.ts.bin?url'
import f_hls_segment_003_ts_bin from './assets/hls/segment_003.ts.bin?url'
import f_readme_zip from './assets/readme.zip?url'
import f_softforms_poster_jpg from './assets/softforms-poster.jpg?url'
import f_gitignore_txt from './assets/gitignore.txt?url'
import playlistText from './assets/hls/index.m3u8?raw'

/* THE STREAM'S PLAYLIST, pointed at the real segments. The `.m3u8` is the file ffmpeg wrote; its
 * segment lines name `segment_000.ts`, and a bundler hashes and moves those files, so the lines are
 * rewritten to wherever each segment actually landed. The segments ride as `.ts.bin`: under `.ts`
 * Vite serves them as TypeScript. */
const SEGMENT_URLS = { 'segment_000.ts': f_hls_segment_000_ts_bin, 'segment_001.ts': f_hls_segment_001_ts_bin, 'segment_002.ts': f_hls_segment_002_ts_bin, 'segment_003.ts': f_hls_segment_003_ts_bin }
const playlistUrl = typeof URL !== 'undefined' && URL.createObjectURL
  ? URL.createObjectURL(new Blob([playlistText.replace(/^(segment_\d+\.ts)$/gm, (m) => new URL(SEGMENT_URLS[m], location.href).href)], { type: 'application/vnd.apple.mpegurl' }))
  : null

const URLS = {
  '01-tier-rules.md': f_01_tier_rules_md,
  'README.md': f_README_md,
  'andvaka.mp3': f_andvaka_mp3,
  'casino.mp3': f_casino_mp3,
  'client.js.txt': f_client_js_txt,
  'dobani.wav': f_dobani_wav,
  'favicon-kol-ds.svg': f_favicon_kol_ds_svg,
  'favicon.svg': f_favicon_svg,
  'invaders.flac': f_invaders_flac,
  'kol-core.css.txt': f_kol_core_css_txt,
  'kol-kerner-2.pdf': f_kol_kerner_2_pdf,
  'kol-kerner.pdf': f_kol_kerner_pdf,
  'logo.svg': f_logo_svg,
  'optic-reaction.mp4': f_optic_reaction_mp4,
  'package.json': f_package_json,
  'pnpm-workspace.yaml': f_pnpm_workspace_yaml,
  'radar-ascii.png': f_radar_ascii_png,
  'softforms-3d.mp4': f_softforms_3d_mp4,
  'softforms.mp4': f_softforms_mp4,
  'tt-01.jpg': f_tt_01_jpg,
  'tt-02.jpg': f_tt_02_jpg,
  'tt-03.jpg': f_tt_03_jpg,
  'tt-04.jpg': f_tt_04_jpg,
  'tt-05.jpg': f_tt_05_jpg,
  'tt-06.jpg': f_tt_06_jpg,
  'tt-07.jpg': f_tt_07_jpg,
  'PPRightGrotesk-Fine.woff2': f_PPRightGrotesk_Fine_woff2,
  'TGRotVF.ttf': f_TGRotVF_ttf,
  'credits.txt': f_credits_txt,
  'hls/segment_000.ts.bin': f_hls_segment_000_ts_bin,
  'hls/segment_001.ts.bin': f_hls_segment_001_ts_bin,
  'hls/segment_002.ts.bin': f_hls_segment_002_ts_bin,
  'hls/segment_003.ts.bin': f_hls_segment_003_ts_bin,
  'readme.zip': f_readme_zip,
  'softforms-poster.jpg': f_softforms_poster_jpg,
  'gitignore.txt': f_gitignore_txt,
  'hls/index.m3u8': playlistUrl,
}

export const fileUrl = (file) => URLS[file] ?? null
