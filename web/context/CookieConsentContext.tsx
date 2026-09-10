'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { readConsent, writeConsent, clearConsent, type ConsentValue } from '@/lib/cookieConsent'

type Ctx = {
  consent: ConsentValue | null
  /** False until the stored choice has been read in the browser. */
  ready: boolean
  accept: () => void
  reject: () => void
  /** Forgets the choice and shows the banner again. */
  reset: () => void
}

const CookieConsentContext = createContext<Ctx>({
  consent: null,
  ready: false,
  accept: () => {},
  reject: () => {},
  reset: () => {},
})

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null)
  const [ready, setReady] = useState(false)

  // Read on mount rather than via cookies() on the server: a request-time API
  // in the root layout would opt every route into dynamic rendering.
  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  function choose(value: ConsentValue) {
    writeConsent(value)
    setConsent(value)
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        ready,
        accept: () => choose('accepted'),
        reject: () => choose('rejected'),
        reset: () => {
          clearConsent()
          setConsent(null)
        },
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  return useContext(CookieConsentContext)
}
