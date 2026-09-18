import {IconSelectInput} from '../components/IconSelectInput'
import {ICON_LIST} from './iconList'

/**
 * Spread onto any icon field. `list` keeps the stored value constrained to the
 * known set; the custom input replaces the name-only dropdown with the artwork,
 * since "Sparkle" vs "Spark" tells an editor nothing on its own.
 *
 * Lives apart from iconList so the input can import the list without a cycle.
 */
export const iconPicker = {
  options: {list: ICON_LIST},
  components: {input: IconSelectInput},
}
