'use client'

import { useEffect, useRef, useState } from 'react'
import { useContactModal, type ModalType } from '@/context/ContactModalContext'
import type { Translations } from '@/lib/translations'
import styles from './styles.module.scss'

export type ModalsData = {
  bookTitle?: string
  bookSubtitle?: string
  bookFooterNote?: string
  bookSuccessTitle?: string
  bookSuccessMessage?: string
  bookTopics?: string[]
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

  const isBook = type === 'book'
  const title        = isBook ? data.bookTitle        : data.contactTitle
  const subtitle     = isBook ? data.bookSubtitle     : data.contactSubtitle
  const footerNote   = isBook ? data.bookFooterNote   : data.contactFooterNote
  const successTitle = isBook ? data.bookSuccessTitle : data.contactSuccessTitle
  const successMsg   = isBook ? data.bookSuccessMessage : data.contactSuccessMessage
  const topics       = isBook ? data.bookTopics       : data.contactTopics

  useEffect(() => {
    firstFieldRef.current?.focus()
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
      aria-label={title ?? (isBook ? t.bookEyebrow : t.contactEyebrow)}
    >
      <div className={styles.panel}>
        <button className={styles.closeBtn} onClick={onClose} aria-label={t.close}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {state === 'success' ? (
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
            <p className={styles.eyebrow}>{isBook ? t.bookEyebrow : t.contactEyebrow}</p>
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
                    {isBook ? t.fieldTopicBook : t.fieldTopic}
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
                  {state === 'sending' ? t.sending : isBook ? t.bookSubmit : t.contactSubmit}
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
