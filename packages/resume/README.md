# @kolkrabbi/kol-resume

The resume kit: a resume in three treatments, the cover, letter, portfolio and back pages, the A4 and continuous kit, and its PDF export. The person comes through `ResumeProvider`, and nobody's details ship.

```jsx
import { ResumeProvider, ResumeLibrary, ResumeSource, ResumeTreatment } from '@kolkrabbi/kol-resume'

<ResumeProvider person={{ BIO, SKILLS, LANGUAGES }} records={{ WORK, EDUCATION }} contact={BRAND_INFO}
  letters={import.meta.glob('./letters/*.md', { query: '?raw', import: 'default', eager: true })}
  portfolio={import.meta.glob('./portfolio/*.md', { query: '?raw', import: 'default', eager: true })}
  assetUrl={(key) => `/bucket/${key}`} portrait="portraits/me.jpg" fileStem="ada-lovelace">
  <Routes>
    <Route path="/resume/library" element={<ResumeLibrary />} />
    <Route path="/resume/source" element={<ResumeSource />} />
    <Route path="/resume/t/:slug" element={<ResumeTreatment />} />
  </Routes>
</ResumeProvider>
```

```js
// vite.config.js
import { kitExportPlugin } from '@kolkrabbi/kol-resume/vite'
plugins: [react(), tailwindcss(), kitExportPlugin({ name: 'ada-lovelace' })]
```

```css
@import "@kolkrabbi/kol-resume/kol-resume.css"; /* the print rules, after kol-theme */
```

The host checklist and the provider's props: ui.kolkrabbi.io, Compositions › Resume.
