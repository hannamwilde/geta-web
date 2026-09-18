import {useEffect, useRef, useState} from 'react'
import {Box, Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {useClient} from 'sanity'
import type {Subscription} from 'rxjs'
import {API_VERSION, formatSize} from './videoAssets'

type Props = {
  accept: string
  onUploaded: (assetId: string) => void
  onError: (message: string) => void
}

const nameFromFile = (file: File) => file.name.replace(/\.[^.]+$/, '')

export function VideoUploadForm({accept, onUploaded, onError}: Props) {
  const client = useClient({apiVersion: API_VERSION})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const subscriptionRef = useRef<Subscription | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => () => subscriptionRef.current?.unsubscribe(), [])

  const uploading = progress !== null

  const pickFile = (picked: File | undefined) => {
    if (!picked) return
    setFile(picked)
    if (!name.trim()) setName(nameFromFile(picked))
  }

  const upload = () => {
    if (!file) return
    setProgress(0)
    subscriptionRef.current = client.observable.assets
      .upload('file', file, {
        filename: file.name,
        contentType: file.type,
        title: name.trim() || undefined,
      })
      .subscribe({
        next: (event) => {
          if (event.type === 'progress') setProgress(event.percent)
          if (event.type === 'response') onUploaded(event.body.document._id)
        },
        error: (err: unknown) => {
          setProgress(null)
          onError(err instanceof Error ? err.message : 'Upload failed')
        },
      })
  }

  return (
    <Stack space={4}>
      <Stack space={3}>
        <Text size={1} weight="medium">
          File
        </Text>
        <Flex align="center" gap={3}>
          <Button
            mode="ghost"
            text={file ? 'Choose another file' : 'Choose file'}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          />
          <Text size={1} muted textOverflow="ellipsis">
            {file ? `${file.name} · ${formatSize(file.size)}` : 'MP4 or WebM'}
          </Text>
        </Flex>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => pickFile(event.currentTarget.files?.[0])}
        />
      </Stack>

      <Stack space={3}>
        <Text size={1} weight="medium">
          Name
        </Text>
        <TextInput
          value={name}
          disabled={uploading}
          placeholder="e.g. Brand film — short"
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Text size={1} muted>
          Shown instead of the file name next time someone picks a video.
        </Text>
      </Stack>

      {uploading && (
        <Stack space={3}>
          <Card radius={2} tone="transparent" style={{overflow: 'hidden'}}>
            <Box
              style={{
                height: 4,
                width: `${progress}%`,
                background: 'currentColor',
                transition: 'width 150ms',
              }}
            />
          </Card>
          <Text size={1} muted>
            Uploading… {Math.round(progress ?? 0)}%
          </Text>
        </Stack>
      )}

      <Flex justify="flex-end">
        <Button text="Upload" tone="primary" disabled={!file || uploading} onClick={upload} />
      </Flex>
    </Stack>
  )
}
