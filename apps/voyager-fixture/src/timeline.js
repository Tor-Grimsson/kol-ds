/* VOYAGER's project in time — the Field Manual 2027 brief's schedule (documents/field-manual-brief.md) as kol-atlas's
 * parseProject milestones, for kol-component's TimeSet (TimeSetAndSiteRailFade, 2026-10-29). Invented, like the rest of
 * the fixture. It runs from the last week of October 2026 so the Today line has somewhere to stand. */
export const VOYAGER_MILESTONES = [
  {
    id: 'm1', title: 'M1 Survey', when: '26 Oct – 20 Nov 2026',
    phases: [
      { id: 'p1-1', title: '1.1 Kickoff', when: '26 – 30 Oct', dw: 'The routes, the guides and the field-test week agreed.', marks: [], items: [
        { num: '1.1.1', text: 'Kickoff: Grandagarður 8, Reykjavík', kind: 'c', date: '29 Oct', time: '10:00' },
        { num: '1.1.2', text: 'Route logs from the last three seasons', kind: 'i' },
      ] },
      { id: 'p1-2', title: '1.2 Ground survey', when: '2 – 20 Nov', dw: 'Every route walked or sailed once with a guide.', marks: [['✋', 'confirm']], reason: 'Glacier routes depend on the November weather', items: [
        { num: '1.2.1', text: 'Snæfellsnes route walked', kind: 'c', date: '6 Nov', time: '09:00' },
        { num: '1.2.2', text: 'Westfjords by small boat', kind: 'c', date: '13 Nov' },
      ] },
    ],
  },
  {
    id: 'm2', title: 'M2 Writing and drawing', when: '7 Dec 2026 – 29 Jan 2027',
    phases: [
      { id: 'p2-1', title: '2.1 Routes', when: '7 Dec 2026 – 8 Jan 2027', dw: 'Twelve route maps at 1:50 000, drawn and checked.', marks: [], items: [
        { num: '2.1.1', text: 'First six maps for review', kind: 'c', date: '18 Dec 2026', time: '14:00' },
      ] },
      { id: 'p2-2', title: '2.2 Drills and kit', when: '11 – 29 Jan 2027', dw: 'The Drills and Kit parts written and laid out.', marks: [], items: [
        { num: '2.2.1', text: 'Manual proof, all three parts', kind: 'c', date: '29 Jan 2027' },
      ] },
    ],
  },
  {
    id: 'm3', title: 'M3 Field test and print', when: '1 Feb – 5 Mar 2027',
    phases: [
      { id: 'p3-1', title: '3.1 Field test', when: '1 – 5 Feb 2027', dw: 'Two guides run the Snæfellsnes route on the proof.', marks: [], items: [
        { num: '3.1.1', text: 'Field test debrief', kind: 'c', date: '5 Feb 2027', time: '16:00' },
      ] },
      { id: 'p3-2', title: '3.2 Print and bind', when: '8 Feb – 5 Mar 2027', dw: '240 copies on synthetic paper, spiral-bound.', marks: [], items: [
        { num: '3.2.1', text: 'Copies delivered', kind: 'c', date: '5 Mar 2027' },
      ] },
    ],
  },
]
