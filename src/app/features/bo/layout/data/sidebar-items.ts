import { SidebarItem } from "../models/sidebarItem.mode";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'common.home',
    icon: 'pi pi-home',
    redirectTo: '/bo'
  },
  {
    title: 'common.clients',
    icon: 'pi pi-user',
    redirectTo: 'clients'
  },
  {
    title: 'common.albums',
    icon: 'pi pi-images',
    redirectTo: 'albums'
  },
  {
    title: 'common.calendar',
    icon: 'pi pi-calendar',
    redirectTo: 'calendar'
  },
  {
    title: 'common.invites',
    icon: 'pi pi-envelope',
    redirectTo: 'invites'
  },
  {
    title: 'common.settings',
    icon: 'pi pi-cog',
    redirectTo: 'configuration'
  },
]
