interface SidebarItem {
  id: number
  isMenu?: boolean
  name: string
  path?: string
  badgeId?: string
  children?: SidebarItem[]
  library?: string
  icon?: string
  filtertype?: string
}
export { SidebarItem }
