'use client'

import { cn } from '@/lib/utils'
import { NavItem as NavItemType } from '@/types'
import Link from 'next/link'

const NavItem = ({ title, href, disabled, active }: NavItemType) => (
  <Link
    href={href}
    className={cn(
      'nav-item relative inline-block px-4 p-4 transition-colors duration-300 ease-linear group',
      active ? 'text-[rgb(183,28,28)]' : 'text-foreground hover:text-[#B71C1C]',
      disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
    )}
  >
    <div className="relative z-10 font-medium">{title}</div>
  
  </Link>
)

export default NavItem