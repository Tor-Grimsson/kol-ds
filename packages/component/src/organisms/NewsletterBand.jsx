import { useId, useState } from 'react'
import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'

/**
 * NewsletterBand — centered newsletter-subscribe band: heading + lede over an
 * email Input + submit Button, with an inline success/error status line under
 * the form. The closing subscribe section on marketing pages.
 *
 * Owns only the local form state — the email value and idle / submitting /
 * success / error, driven by the promise returned from `onSubmit(email)`.
 * No fetch lives here: the consumer's handler posts wherever it wants;
 * resolve → success (field clears), reject → error (logged). An empty submit
 * errors immediately without calling the handler, and the submit Button
 * disables while the promise is pending. Native `type="email"` validation
 * still gates malformed addresses before the handler runs.
 *
 * A11y: the Input carries aria-required and, on error, aria-describedby
 * pointing at the error line; the success line is role=status
 * aria-live=polite, the error line role=alert aria-live=assertive. Field and
 * error ids are useId-generated (or `inputId`) so multiple bands mount
 * without collisions.
 *
 * @param {ReactNode} title        heading (kol-sans-display-01)
 * @param {ReactNode} description  lede under the heading (kol-mono-14)
 * @param {string}    placeholder  email Input placeholder
 * @param {ReactNode} submitLabel  submit Button label (also its accessible name)
 * @param {Function}  onSubmit     (email) => Promise|void — resolve = success, reject = error
 * @param {ReactNode} successCopy  success status line
 * @param {ReactNode} errorCopy    error status line
 * @param {string}    id           anchor id on the section (e.g. "signup")
 * @param {string}    inputId      id override for the email input (default useId-generated)
 * @param {string}    className    extra classes on the section
 */
export default function NewsletterBand({
  title,
  description,
  placeholder,
  submitLabel,
  onSubmit,
  successCopy = 'Thanks for subscribing!',
  errorCopy = 'Please enter a valid email address.',
  id,
  inputId,
  className = '',
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'

  const autoId = useId()
  const emailId = inputId ?? `${autoId}email`
  const errorId = `${emailId}-error`

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      return
    }
    if (!onSubmit) return

    setStatus('submitting')
    try {
      await onSubmit(email)
      setStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setStatus('error')
    }
  }

  return (
    <section
      id={id}
      className={`w-full flex flex-col items-center justify-center text-center ${className}`.trim()}
    >
      <div className="max-w-[1400px] mx-auto py-24">
        <h2 className="kol-sans-display-01 mb-6">{title}</h2>

        <p className="kol-mono-14 text-auto mb-12 mx-auto max-w-[64rem]">{description}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mb-16 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
        >
          <Input
            id={emailId}
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="md"
            aria-required="true"
            aria-describedby={status === 'error' ? errorId : undefined}
            className="w-full sm:max-w-[400px] md:max-w-[520px]"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={status === 'submitting'}
            className="w-full sm:w-auto"
          >
            {submitLabel}
          </Button>
        </form>

        {status === 'success' && (
          <p className="kol-mono-14 text-auto opacity-80" role="status" aria-live="polite">
            {successCopy}
          </p>
        )}
        {status === 'error' && (
          <p id={errorId} className="kol-mono-14 text-auto opacity-80" role="alert" aria-live="assertive">
            {errorCopy}
          </p>
        )}
      </div>
    </section>
  )
}
