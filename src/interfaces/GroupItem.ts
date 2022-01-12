import { PublicationItem } from './PublicationItem'

interface GroupItem {
  text?: string
  type?: string
  count?: number
  items?: Array<PublicationItem>
  children?: Array<GroupItem>
  props?: {}
}
export { GroupItem }
