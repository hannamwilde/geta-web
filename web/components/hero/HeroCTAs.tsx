'use client'

type Props = {
  primaryLabel?: string
  secondaryLabel?: string
}

export default function HeroCTAs({ primaryLabel, secondaryLabel }: Props) {
  const openContact = () => {
    // TODO: wire up contact modal
  }

  const openBook = () => {
    // TODO: wire up booking modal
  }

  return (
    <div className="hero-ctas">
      <button className="btn btn-primary" onClick={openBook}>
        {primaryLabel}
      </button>
      <button className="btn btn-outline" onClick={openContact}>
        {secondaryLabel}
      </button>
    </div>
  )
}
