import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  { 
    items: [
      {
        title: 'Home',
        icon: 'i-lucide-home',
        link: '/',
      },
      // {
      //   title: 'Email',
      //   icon: 'i-lucide-mail',
      //   link: '/email',
      // },
      {
        title: 'Courts',
        icon: 'i-lucide-volleyball',
        children: [
          {
            title: 'All Courts',           
            link: '/courts',
          },
          {
            title: 'New Court',          
            link: '/courts/new',
          },
        ],
      },
      {
        title: 'Users',
        icon: 'i-lucide-user',
        children: [
          {
            title: 'All Users',           
            link: '/users',
          },
          {
            title: 'Register new customer',          
            link: '/users/register',
          },
        ],
      },
      {
        title: 'Bookings',
        icon: 'i-lucide-calendar',
        children: [
          {
            title: 'All Bookings',           
            link: '/bookings',
          },
          {
            title: 'New booking',          
            link: '/bookings/new',
          },
          {
            title: 'Booking Schedule',          
            link: '/bookings/schedule',
          },
        ],
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Faq',
    icon: 'i-lucide-circle-help',
    link: '/support',
  },
  {
    title: 'Contact',
    icon: 'i-lucide-send',
    link: '/feedback',
  },
]
