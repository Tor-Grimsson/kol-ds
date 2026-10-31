import { AccountForm } from '@kolkrabbi/kol-shell'

/* sign in, drawn from data: the desk's column (the default) and the floating box (`variant="box"`, round 3's values) */
const FORM = {
  title: 'Sign in',
  fields: [{ id: 'email', placeholder: 'Email', autoComplete: 'email' }, { id: 'password', placeholder: 'Password', type: 'password', autoComplete: 'current-password' }],
  okLabel: 'Sign in',
  footer: { text: "Don't have an account?", link: 'Sign up', onPress: () => {} },
  onSubmit: async () => {},
}

export default function AccountFormPreview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <AccountForm {...FORM} />
      <AccountForm {...FORM} variant="box" />
    </div>
  )
}
