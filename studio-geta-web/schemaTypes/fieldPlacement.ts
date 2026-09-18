/**
 * Where a shared field helper puts its output in the form. Every block now
 * groups by fieldset, but `group` stays available for any type that goes back
 * to tabs.
 */
export type FieldPlacement = {
  group?: string
  fieldset?: string
}
