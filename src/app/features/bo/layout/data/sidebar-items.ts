import { SidebarItem } from "../models/sidebarItem.mode";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'common.home',
    icon: 'home',
    redirectTo: '/bo'
  },
  {
    title: 'common.clients',
    icon: 'people',
    redirectTo: 'clients'
  },
  {
    title: 'common.albums',
    icon: 'photo_library',
    redirectTo: 'albums'
  },
  {
    title: 'common.calendar',
    icon: 'calendar_month',
    redirectTo: 'calendar'
  },
  {
    title: 'common.settings',
    icon: 'settings',
    redirectTo: 'configuration'
  },
]
