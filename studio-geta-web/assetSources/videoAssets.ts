import {useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'

export const API_VERSION = '2024-01-01'

export type VideoAsset = {
  _id: string
  _createdAt: string
  originalFilename?: string
  title?: string
  size: number
  mimeType: string
  url: string
}

const QUERY = `*[_type == "sanity.fileAsset" && mimeType match "video/*"] | order(_createdAt desc)[0...200]{
  _id, _createdAt, originalFilename, title, size, mimeType, url
}`

export function useVideoAssets() {
  const client = useClient({apiVersion: API_VERSION})
  const [assets, setAssets] = useState<VideoAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    return client
      .fetch<VideoAsset[]>(QUERY)
      .then((result) => {
        setAssets(result)
        setError(null)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [client])

  useEffect(() => {
    reload()
  }, [reload])

  return {assets, loading, error, reload}
}

export const assetName = (asset: VideoAsset) => asset.title || asset.originalFilename || asset._id

export function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return mb < 1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(2)} MB`
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
