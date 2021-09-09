import { ObjectItem } from '@/interfaces/ObjectItem'
interface UserInt {
  appversion?: string
  loaded?: boolean
  userid: number
  recordid?: number
  usergroups?: []
  isSecurity?: boolean
  isDeveloper?: boolean
  isOwner?: boolean
  isActionOfficer?: boolean
  isLibrarian?: boolean
  isAdmin?: boolean
  isVisitor?: boolean
  isNATOVisitor?: boolean
  isNATOApprover?: boolean
  isNATOLibrarian?: boolean
  Account?: string
  PersonalUrl?: string
  Email?: string
  EmailLink?: string
  DisplayName?: string
  FirstName?: string
  LastName?: string
  Phone?: string
  CellPhone?: string
  Manager?: string
  About?: string
  Company?: string
  JSONData?: Array<ObjectItem>
}
export { UserInt }
