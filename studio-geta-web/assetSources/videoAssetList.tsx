import {useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text, TextInput} from '@sanity/ui'
import {CheckmarkIcon, CloseIcon, EditIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import {API_VERSION, assetName, formatDate, formatSize, type VideoAsset} from './videoAssets'

type Props = {
  assets: VideoAsset[]
  loading: boolean
  selectedId?: string
  onSelect: (asset: VideoAsset) => void
  onRenamed: () => void
  onError: (message: string) => void
}

export function VideoAssetList({assets, loading, selectedId, onSelect, onRenamed, onError}: Props) {
  const client = useClient({apiVersion: API_VERSION})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const startRename = (asset: VideoAsset) => {
    setEditingId(asset._id)
    setDraft(asset.title || '')
  }

  const save = async (asset: VideoAsset) => {
    const title = draft.trim()
    setSaving(true)
    try {
      const patch = client.patch(asset._id)
      await (title ? patch.set({title}) : patch.unset(['title'])).commit()
      setEditingId(null)
      onRenamed()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not rename the video')
    } finally {
      setSaving(false)
    }
  }

  if (loading && assets.length === 0) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    )
  }

  if (assets.length === 0) {
    return (
      <Card padding={4} radius={2} tone="transparent">
        <Text muted size={1}>
          No videos uploaded yet.
        </Text>
      </Card>
    )
  }

  return (
    <Stack space={1}>
      {assets.map((asset) => (
        <Flex key={asset._id} align="center" gap={1}>
          {editingId === asset._id ? (
            <>
              <Box flex={1}>
                <TextInput
                  autoFocus
                  value={draft}
                  disabled={saving}
                  placeholder={asset.originalFilename}
                  onChange={(event) => setDraft(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') save(asset)
                    if (event.key === 'Escape') setEditingId(null)
                  }}
                />
              </Box>
              <Button
                mode="ghost"
                tone="primary"
                icon={CheckmarkIcon}
                disabled={saving}
                aria-label="Save name"
                onClick={() => save(asset)}
              />
              <Button
                mode="bleed"
                icon={CloseIcon}
                disabled={saving}
                aria-label="Cancel"
                onClick={() => setEditingId(null)}
              />
            </>
          ) : (
            <>
              <Card
                as="button"
                flex={1}
                padding={3}
                radius={2}
                tone={selectedId === asset._id ? 'primary' : 'default'}
                pressed={selectedId === asset._id}
                onClick={() => onSelect(asset)}
              >
                <Stack space={2}>
                  <Text weight="medium" textOverflow="ellipsis">
                    {assetName(asset)}
                  </Text>
                  <Text size={1} muted textOverflow="ellipsis">
                    {[
                      asset.title ? asset.originalFilename : null,
                      formatSize(asset.size),
                      formatDate(asset._createdAt),
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </Stack>
              </Card>
              <Button
                mode="bleed"
                icon={EditIcon}
                aria-label={`Rename ${assetName(asset)}`}
                onClick={() => startRename(asset)}
              />
            </>
          )}
        </Flex>
      ))}
    </Stack>
  )
}
