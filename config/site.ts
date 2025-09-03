import { SideConfig } from '@/types'

export const sideConfig: SideConfig = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
      svg: {
        width: '80',
        height: '15',
        path: 'M129 2.52236C44.2432 -1.07024 1 7.65466 1 7.65466',
        viewBox: '0 0 130 10',
        className: 'nav-anim-1',
      },
    },
    {
      title: 'About',
      href: '/about-us',
      svg: {
        width: '70',
        height: '50',
        path: 'M25.7713 9.52675C25.7713 9.52675 4.67504 12.754 2.33777 28.3908C-1.22826 52.2483 24.225 60.1762 41.7728 52.2483C63.907 42.2483 70.2734 22.2483 59.6503 9.52675C48.3091 -4.0548 20.8327 4.89081 20.8327 4.89081',
        viewBox: '0 0 67 57',
        className: 'nav-anim-2',
      },
    },
    {
      title: 'Contact',
      href: '/contact-us',
      svg: {
        width: '67',
        height: '20',
        path: 'M1 6.93662C20.4173 3.0081 41.8539 0.836052 61.5918 2.64599C66.178 3.06654 66.0612 3.87644 61.6904 4.84365C50.2495 7.37541 38.725 9.04012 27.4043 12.2389C14.5 15.8852 1 24 12.5 23C25.767 21.8464 40 23.5 40 23.5',
        viewBox: '0 0 67 25',
        className: 'nav-anim-2',
      },
    },
  ],
}