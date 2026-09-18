import {useEffect, useMemo, useState} from 'react'
import {Box, Button, Dialog, Flex, Stack, TextInput, useToast} from '@sanity/ui'
import {PlayIcon, SearchIcon} from '@sanity/icons'
import type {AssetSource, AssetSourceComponentProps} from '@sanity/types'
import {assetName, useVideoAssets} from './videoAssets'
import {VideoAssetList} from './videoAssetList'
import {VideoUploadForm} from './videoUploadForm'

function VideoAssetSourceComponent(props: AssetSourceComponentProps) {
  const {accept, action, onClose, onSelect, selectedAssets} = props
  const toast = useToast()
  const {assets, loading, reload} = useVideoAssets()
  const [mode, setMode] = useState<'browse' | 'upload'>(action === 'upload' ? 'upload' : 'browse')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (action === 'upload' || action === 'select') {
      setMode(action === 'upload' ? 'upload' : 'browse')
    }
  }, [action])

  const onError = (message: string) => toast.push({status: 'error', title: message})

  const select = (assetId: string) => onSelect([{kind: 'assetDocumentId', value: assetId}])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return assets
    return assets.filter((asset) =>
      [assetName(asset), asset.originalFilename].some((value) =>
        value?.toLowerCase().includes(term),
      ),
    )
  }, [assets, search])

  return (
    <Dialog
      id="video-asset-source"
      header={mode === 'upload' ? 'Upload video' : 'Select video'}
      width={2}
      onClose={onClose}
      onClickOutside={onClose}
      footer={
        <Flex justify="space-between" padding={2} gap={2}>
          <Button
            mode="bleed"
            text={mode === 'upload' ? 'Select existing video' : 'Upload new video'}
            onClick={() => setMode(mode === 'upload' ? 'browse' : 'upload')}
          />
          <Button mode="ghost" text="Cancel" onClick={onClose} />
        </Flex>
      }
    >
      <Box padding={4}>
        {mode === 'upload' ? (
          <VideoUploadForm accept={accept} onUploaded={select} onError={onError} />
        ) : (
          <Stack space={4}>
            <TextInput
              icon={SearchIcon}
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
            <VideoAssetList
              assets={visible}
              loading={loading}
              selectedId={selectedAssets[0]?._id}
              onSelect={(asset) => select(asset._id)}
              onRenamed={reload}
              onError={onError}
            />
          </Stack>
        )}
      </Box>
    </Dialog>
  )
}

export const videoAssetSource: AssetSource = {
  name: 'video',
  title: 'Videos',
  icon: PlayIcon,
  component: VideoAssetSourceComponent,
  uploadMode: 'component',
}
