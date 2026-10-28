/* kol-atlas's tab table (apps/workspace/src/tabs.js), the client-visible rows — copied 2026-10-28 as the
 * examples' order, titles and groups. `file` is relative to ./docs; `folder` marks a group's own page;
 * `parent` nests an entry under a page. The internal rows (Hours, Conventions, Visual references, the Studio
 * group) are not here: kol-atlas's "Who sees what" keeps them off the client site. `notes` turns a page's external links
 * into numbered notes and `numbered` makes it a numbered document (the number gutter, milestone/phase/item levels), as
 * kol-atlas's engine does on Project and SEO + GEO. */
export const CLIENT = 'Client: ATLAS'
export const TABS = [
  { id: "overview", title: "Overview", file: "00-overview/01-overview.md" },
  { id: "project", title: "Project", file: "01-project/01-project.md", notes: true, numbered: true },
  { id: "quote", title: "Client quote", group: "Quote", file: "02-quote/01-client-quote.md" },
  { id: "plan", title: "Plan", file: "01-project/02-plan.md" },
  { id: "assets", title: "Overview", group: "Assets", folder: true, file: "05-graphics/00-overview.md" },
  { id: "media", title: "Media", group: "Assets", file: "05-graphics/01-media.md" },
  { id: "logo-system", title: "Logo system", group: "Assets", file: "05-graphics/02-logo-system.md" },
  { id: "typography", title: "Typography", group: "Assets", file: "05-graphics/03-typography.md" },
  { id: "color", title: "Color", group: "Assets", file: "05-graphics/04-color.md" },
  { id: "brand-guide", title: "Brand guide", group: "Assets", file: "05-graphics/05-brand-guide.md" },
  { id: "reference", title: "Overview", group: "Reference", folder: true, file: "04-reference/00-overview.md" },
  { id: "brief", title: "Client brief", group: "Reference", file: "03-client/01-brief.md" },
  { id: "brand", title: "Brand summary", group: "Reference", file: "03-client/02-brand.md" },
  { id: "updates", title: "Updates", group: "Reference", file: "07-updates/00-updates.md" },
  { id: "kickoff-notes", title: "1.0 Kickoff notes", parent: "updates", file: "07-updates/01-kickoff-notes.md" },
  { id: "timeline-in-plan", title: "2.0 Timeline in Plan", parent: "updates", file: "07-updates/02-timeline-in-plan.md" },
  { id: "research-papers", title: "3.0 Five research papers", parent: "updates", file: "07-updates/03-research-papers.md" },
  { id: "research", title: "Research", group: "Reference", file: "08-research/00-research.md" },
  { id: "brand-comparison", title: "Brand comparison", parent: "research", file: "08-research/01-brand-comparison.md" },
  { id: "foundations", title: "Foundations", parent: "research", file: "08-research/02-foundations.md" },
  { id: "branding-process", title: "Branding process", parent: "research", file: "08-research/03-branding-process.md" },
  { id: "brand-guides", title: "Brand guides", parent: "research", file: "08-research/04-brand-guides.md" },
  { id: "brand-architecture", title: "Brand architecture", parent: "research", file: "08-research/05-brand-architecture.md" },
  { id: "naming-system", title: "Naming system", parent: "research", file: "08-research/06-naming-system.md" },
  { id: "verbal-identity", title: "Verbal identity", parent: "research", file: "08-research/07-verbal-identity.md" },
  { id: "brand-guide-research", title: "Brand guide", parent: "research", file: "08-research/08-brand-guide.md" },
  { id: "frontdoor", title: "SEO + GEO", group: "Reference", file: "04-reference/01-seo-geo.md", notes: true, numbered: true },
]

/* a row's route — a folder is its group's page, every other row its own id */
export const tabPath = (t) => (t.folder ? `/${t.group.toLowerCase()}` : `/${t.id}`)
