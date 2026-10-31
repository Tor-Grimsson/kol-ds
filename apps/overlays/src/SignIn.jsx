import { useState } from 'react'
import { TabsRow } from '@kolkrabbi/kol-component'
import { AccountForm } from '@kolkrabbi/kol-shell'

/* SIGN IN AND SIGN UP, EVERY WAY THEY APPEAR (FloatingStyleAndSignInDemos, kol-fxr 2026-10-30, canvas Round 3 — user: *"sign in /
 * sign up as rail or overlay, desktop and mobile"*). One stage, three switches: style A / B, desktop / phone, and the
 * presentation — on a desk the column over Home (HubHome's) or a centred overlay; on a phone the box (his layout) or the
 * column. Every form is kol-shell's AccountForm on fxr's data; B is `variant="float"`, nothing hand-rounded. */

const FORMS = {
  in: {
    title: 'Sign in',
    okLabel: 'Sign in',
    fields: [
      { id: 'email', placeholder: 'Email', type: 'email', autoComplete: 'username' },
      { id: 'password', placeholder: 'Password', type: 'password', autoComplete: 'current-password' },
    ],
    footer: { text: "Don't have an account?", link: 'Sign up' },
  },
  up: {
    title: 'Create account',
    okLabel: 'Create',
    fields: [
      { id: 'name', placeholder: 'Name', autoComplete: 'name' },
      { id: 'email', placeholder: 'Email', type: 'email', autoComplete: 'username' },
      { id: 'password', placeholder: 'Create Password', type: 'password', autoComplete: 'new-password' },
      { id: 'confirm', placeholder: 'Confirm Password', type: 'password', autoComplete: 'new-password' },
    ],
    footer: { text: 'Already have an account?', link: 'Sign in' },
  },
}
const WAYS = {
  desktop: [{ id: 'rail', label: 'Rail over Home' }, { id: 'overlay', label: 'Centred overlay' }],
  phone: [{ id: 'box', label: 'Box' }, { id: 'column', label: 'Column' }],
}

export default function SignIn({ Group }) {
  const [style, setStyle] = useState('A')
  const [device, setDevice] = useState('desktop')
  const [way, setWay] = useState('rail')
  const [form, setForm] = useState('in')
  const b = style === 'B'
  const data = { ...FORMS[form], footer: { ...FORMS[form].footer, onPress: () => setForm(form === 'in' ? 'up' : 'in') }, onSubmit: async () => {} }
  const pickDevice = (d) => { setDevice(d); setWay(WAYS[d][0].id) }
  /* a column is the same form in A and B — the FloatingStyle wrapper retired for `variant="float"`, which AccountForm's column does not take */
  const column = <AccountForm key={form} {...data} />
  /* a box: B is the user's phone box; A is the same form on a square surface-secondary box */
  const box = b
    ? <AccountForm key={form} {...data} variant="box" />
    : <div className="rounded-[var(--kol-radius-sm)] bg-surface-secondary p-4"><AccountForm key={form} {...data} /></div>
  const phone = device === 'phone'

  return (
    <Group title="Sign in" ships="kol-shell · AccountForm · HubHome signInForm">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <TabsRow variant="text" tabs={[{ id: 'A', label: 'Style A' }, { id: 'B', label: 'Style B' }]} value={style} onChange={setStyle} />
          <TabsRow variant="text" tabs={[{ id: 'desktop', label: 'Desktop' }, { id: 'phone', label: 'Phone' }]} value={device} onChange={pickDevice} />
          <TabsRow variant="text" tabs={WAYS[device]} value={way} onChange={setWay} />
          <TabsRow variant="text" tabs={[{ id: 'in', label: 'Sign in' }, { id: 'up', label: 'Sign up' }]} value={form} onChange={setForm} />
        </div>
        {/* the stage: Home's ground and a picture for the stage; 1440 × 900 at half, or a 390 phone */}
        <div className={`relative overflow-hidden bg-surface-primary ${phone ? 'w-[390px] h-[760px]' : 'w-full h-[640px]'}`}>
          {way === 'rail' && <div className="absolute inset-0 bg-surface-secondary" aria-hidden="true" />}
          <img src="/kol-images/tt-01.jpg" alt="" aria-hidden="true" className={`absolute inset-y-0 right-0 h-full object-cover opacity-55 ${way === 'rail' ? 'left-[min(672px,50%)] w-[calc(100%-min(672px,50%))]' : 'left-0 w-full'}`} />
          {way === 'rail' && (
            <aside className="absolute inset-y-0 left-0 w-[min(672px,50%)] px-16 flex flex-col justify-center bg-surface-primary">{column}</aside>
          )}
          {way === 'overlay' && <div className="absolute left-1/2 top-1/2 w-[392px] -translate-x-1/2 -translate-y-1/2">{box}</div>}
          {way === 'box' && <div className="absolute inset-x-4 top-1/2 -translate-y-1/2">{box}</div>}
          {way === 'column' && (
            <aside className="absolute inset-0 px-4 pb-[88px] flex flex-col justify-center bg-surface-primary">{column}</aside>
          )}
        </div>
      </div>
    </Group>
  )
}
