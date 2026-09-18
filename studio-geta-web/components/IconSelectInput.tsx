import {useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Grid, Stack, Text, TextInput} from '@sanity/ui'
import {set, unset, type StringInputProps} from 'sanity'
import {ICON_LIST} from '../schemaTypes/iconList'
import {IconPreview} from './IconPreview'

/**
 * Replaces the plain dropdown on icon fields: a name alone doesn't tell an
 * editor what they are picking, so the options are shown as artwork. Filter
 * narrows the grid; clicking the selected icon clears the field.
 */
export function IconSelectInput(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ICON_LIST
    return ICON_LIST.filter(
      (icon) => icon.title.toLowerCase().includes(q) || icon.value.includes(q),
    )
  }, [query])

  const pick = (next: string) => onChange(next === value ? unset() : set(next))

  return (
    <Stack space={3}>
      <TextInput
        {...elementProps}
        value={query}
        placeholder="Filter icons…"
        onChange={(event) => setQuery(event.currentTarget.value)}
      />

      {matches.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent">
          <Text align="center" muted size={1}>
            No icon matches “{query}”.
          </Text>
        </Card>
      ) : (
        <Grid columns={[3, 4, 6]} gap={2}>
          {matches.map((icon) => {
            const selected = icon.value === value
            return (
              <Card
                key={icon.value}
                as="button"
                type="button"
                padding={2}
                radius={2}
                border
                pressed={selected}
                tone={selected ? 'primary' : 'default'}
                onClick={() => pick(icon.value)}
                title={icon.title}
                aria-pressed={selected}
              >
                <Flex align="center" direction="column" gap={2}>
                  <IconPreview name={icon.value} size={26} />
                  <Text align="center" size={0} muted={!selected} textOverflow="ellipsis">
                    {icon.title}
                  </Text>
                </Flex>
              </Card>
            )
          })}
        </Grid>
      )}

      {value && (
        <Flex align="center" gap={2}>
          <Box flex={1}>
            <Text size={1} muted>
              Selected: {ICON_LIST.find((i) => i.value === value)?.title ?? value}
            </Text>
          </Box>
          <Button mode="bleed" text="Clear" fontSize={1} onClick={() => onChange(unset())} />
        </Flex>
      )}
    </Stack>
  )
}
