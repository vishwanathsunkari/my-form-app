'use client'
import { useState, useRef } from 'react'
import styles from './contact.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [charCount, setCharCount] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Basic client-side validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))
    if (!data.name || !emailOk || !data.message) {
      setStatus('error')
      return
    }

    setStatus('loading')

    // POST directly to Payload's auto-generated REST API
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <main className={styles.page}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>
            Message <em>received</em>
          </h2>
          <p className={styles.successText}>
            Thank you for reaching out. Someone from the team will be in touch shortly.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>Get in touch</div>
        <h1 className={styles.title}>
          Let&apos;s start a <em>conversation</em>
        </h1>
        <p className={styles.subhead}>Fill in the form — we&apos;ll get back within 24 hours.</p>
      </header>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Full name <span className={styles.req}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              className={styles.input}
              required
            />
            <div className={styles.line} />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email <span className={styles.req}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={styles.input}
              required
            />
            <div className={styles.line} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="subject" className={styles.label}>
            Subject
          </label>
          <select id="subject" name="subject" className={styles.input}>
            <option value="">— Select a topic</option>
            <option value="general">General enquiry</option>
            {/* <option value="project">Project proposal</option>
            <option value="support">Support request</option> */}
            <option value="other">Something else</option>
          </select>
          <div className={styles.line} />
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            Message <span className={styles.req}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tell us what's on your mind…"
            maxLength={500}
            rows={5}
            className={styles.textarea}
            onChange={(e) => setCharCount(e.target.value.length)}
            required
          />
          <div className={styles.line} />
        </div>

        <p className={styles.charCount}>
          <span>{charCount}</span> / 500
        </p>

        {status === 'error' && (
          <p className={styles.errorMsg}>Please fill in all required fields correctly.</p>
        )}

        <div className={styles.footer}>
          <p className={styles.note}>Your data is stored securely and never shared.</p>
          <button type="submit" disabled={status === 'loading'} className={styles.btn}>
            {status === 'loading' ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </main>
  )
}
