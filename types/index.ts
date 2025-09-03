export interface SvgConfig {
  width: string
  height: string
  path: string
  viewBox: string
  className: string
}

export interface NavItem {
  title: string
  href: string
  svg?: SvgConfig
  disabled?: boolean
  active?: boolean
}

export interface MainNavItem extends NavItem {}

export interface SideConfig {
  mainNav: MainNavItem[]
}