'use client'

import { cn } from '@/lib/utils'
import { NavItem as NavItemType } from '@/types'
import Link from 'next/link'

const NavItem = ({ title, href, svg, disabled, active }: NavItemType) => (
  <Link
    href={href}
    className={cn(
      'nav-item relative inline-block px-4 p-4 transition-colors duration-300 ease-linear group',
      active ? 'text-[rgb(183,28,28)]' : 'text-foreground hover:text-[#B71C1C]',
      disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
    )}
  >
    <div className="relative z-10 font-medium">{title}</div>
    {svg && (
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          width={svg.width}
          height={svg.height}
          viewBox={svg.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="nav-svg"
        >
          <path
            className={cn(svg.className, "nav-path")}
            d={svg.path}
            stroke="#B71C1C"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )}
  </Link>
)

export default NavItem