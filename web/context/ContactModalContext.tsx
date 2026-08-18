'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

export type ModalType = 'contact' | 'book'

type Ctx = {
  activeModal: ModalType | null
  open: (type: ModalType) => void
  close: () => void
}

const ContactModalContext = createContext<Ctx>({
  activeModal: null,
  open: () => {},
  close: () => {},
})

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  return (
    <ContactModalContext.Provider value={{ activeModal, open: setActiveModal, close: () => setActiveModal(null) }}>
      {children}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  return useContext(ContactModalContext)
}
