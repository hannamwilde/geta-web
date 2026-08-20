'use client'

import { useEffect, useState } from 'react'
import { gradientCss, type Gradient } from '@/lib/background'
import styles from './styles.module.scss'

export type BackgroundVideo = {
  asset?: { url?: string; mimeType?: string } | null
} | null

type Props = {
  video?: BackgroundVideo
  /** Poster frame — normally the section's background image, which also renders as the fallback. */
  posterUrl?: string | null
  overlayColor?: string
  /** Wins over overlayColor when both stops are set, mirroring section backgrounds. */
  overlayGradient?: Gradient
  overlayOpacity?: number
}

/**
 * Phones and reduced-motion visitors keep the still background image instead of
 * the video — the <video> is only mounted once we know neither applies, so the
 * file is never downloaded for them.
 */
const STILL_ONLY = '(prefers-reduced-motion: reduce), (max-width: 760px)'

export default function BackgroundMedia({
  video,
  posterUrl,
  overlayColor,
  overlayGradient,
  overlayOpacity,
}: Props) {
  const videoUrl = video?.asset?.url
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    if (!videoUrl) return
    const mq = window.matchMedia(STILL_ONLY)
    const sync = () => setShowVideo(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [videoUrl])

  const overlayBackground = gradientCss(overlayGradient) ?? overlayColor
  if (!videoUrl && !overlayBackground) return null

  return (
    <div className={styles.media} aria-hidden>
      {videoUrl && showVideo && (
        <video
          className={styles.video}
          poster={posterUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type={video?.asset?.mimeType || 'video/mp4'} />
        </video>
      )}
      {overlayBackground && (
        <div
          className={styles.overlay}
          style={{
            background: overlayBackground,
            opacity: (overlayOpacity ?? 45) / 100,
          }}
        />
      )}
    </div>
  )
}
