'use client'

import { useEffect, useRef, useState } from 'react'
import { useContactModal, type ModalType } from '@/context/ContactModalContext'
import type { Translations } from '@/lib/translations'
import { resolveSchedulingUrl } from '@/lib/googleCalendar'
import styles from './styles.module.scss'

export type ModalsData = {
  bookEyebrow?: string
  bookTitle?: string
  bookSubtitle?: string
  bookFooterNote?: string
  bookSuccessTitle?: string
  bookSuccessMessage?: string
  bookCalendarUrl?: string
  contactEyebrow?: string
  contactTitle?: string
  contactSubtitle?: string
  contactFooterNote?: string
  contactSuccessTitle?: string
  contactSuccessMessage?: string
  contactTopics?: string[]
}

type FormState = 'idle' | 'sending' | 'success' | 'error'

function Modal({ type, data, t, onClose }: { type: ModalType; data: ModalsData; t: Translations['modal']; onClose: () => void }) {
  const [state, setState] = useState<FormState>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const isBook = type === 'book'
  const eyebrow      = isBook ? data.bookEyebrow      : data.contactEyebrow
  const title        = isBook ? data.bookTitle        : data.contactTitle
  const subtitle     = isBook ? data.bookSubtitle     : data.contactSubtitle
  const footerNote   = isBook ? data.bookFooterNote   : data.contactFooterNote
  const successTitle = isBook ? data.bookSuccessTitle : data.contactSuccessTitle
  const successMsg   = isBook ? data.bookSuccessMessage : data.contactSuccessMessage
  const topics       = isBook ? undefined             : data.contactTopics

  // A scheduling URL on the book modal swaps the form out for Google's calendar.
  const calendarUrl = isBook ? resolveSchedulingUrl(data.bookCalendarUrl) : null

  useEffect(() => {
    ;(firstFieldRef.current ?? closeBtnRef.current)?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, modalType: type }),
      })
      if (!res.ok) throw new Error()
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? eyebrow}
    >
      <div className={`${styles.panel}${calendarUrl ? ` ${styles.panelWide}` : ''}`}>
        <button ref={closeBtnRef} className={styles.closeBtn} onClick={onClose} aria-label={t.close}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {calendarUrl ? (
          <>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.lead}>{subtitle}</p>}
            <div className={styles.calendar}>
              <iframe
                className={styles.calendarFrame}
                src={calendarUrl}
                title={title ?? eyebrow ?? t.submit}
              />
            </div>
            {footerNote && <p className={styles.footerNote}>{footerNote}</p>}
          </>
        ) : state === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>{successTitle ?? t.successFallback}</h2>
            {successMsg && <p className={styles.successBody}>{successMsg}</p>}
            <button className={styles.submitBtn} onClick={onClose}>{t.close}</button>
          </div>
        ) : (
          <>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <p className={styles.lead}>{subtitle}</p>}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cm-name">{t.fieldName} *</label>
                  <input ref={firstFieldRef} className={styles.input} id="cm-name" name="name" type="text" required placeholder={t.phName} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cm-email">{t.fieldEmail} *</label>
                  <input className={styles.input} id="cm-email" name="email" type="email" required placeholder={t.phEmail} />
                </div>
              </div>

              {!isBook && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cm-company">{t.fieldCompany}</label>
                  <input className={styles.input} id="cm-company" name="company" type="text" placeholder={t.phCompany} />
                </div>
              )}

              {topics && topics.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cm-topic">
                    {t.fieldTopic}
                  </label>
                  <select className={styles.select} id="cm-topic" name="topic">
                    <option value="">{t.topicPlaceholder}</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="cm-message">
                  {isBook ? t.fieldMessage : `${t.fieldMessage} *`}
                </label>
                <textarea
                  className={styles.textarea}
                  id="cm-message"
                  name="message"
                  required={!isBook}
                  rows={4}
                  placeholder={isBook ? t.phMessageBook : t.phMessageContact}
                />
              </div>

              {state === 'error' && (
                <p className={styles.errorMsg}>{t.errorMsg}</p>
              )}

              <div className={styles.formFooter}>
                <button className={styles.submitBtn} type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? t.sending : t.submit}
                  {state !== 'sending' && (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  )}
                </button>
                {footerNote && <p className={styles.footerNote}>{footerNote}</p>}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ContactModal({ data, t }: { data: ModalsData; t: Translations['modal'] }) {
  const { activeModal, close } = useContactModal()
  if (!activeModal) return null
  return <Modal key={activeModal} type={activeModal} data={data} t={t} onClose={close} />
}
