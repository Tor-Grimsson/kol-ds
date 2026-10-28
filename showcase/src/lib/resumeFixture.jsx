import { ResumeProvider } from '@kolkrabbi/kol-resume'
import { MOOD } from 'voyager-fixture'
import { PERSON, RECORDS, CONTACT, LETTERS, PORTFOLIO } from 'voyager-fixture/resume'

/* the kol-resume previews' person — VOYAGER's invented one (apps/resume's), so nobody's details show */
const copy = { back: { en: { current: 'Routes, dates and kit lists live at voyager.example.' } } }

export function VoyagerResume({ children }) {
  return (
    <ResumeProvider person={PERSON} records={RECORDS} contact={CONTACT} letters={LETTERS} portfolio={PORTFOLIO} portrait={MOOD[0]?.url} fileStem="hekla-sveinsdottir" copy={copy}>
      {children}
    </ResumeProvider>
  )
}
