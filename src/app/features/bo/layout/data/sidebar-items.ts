import { PermissionsType } from "src/app/core/data/permissions.enum";
import { SidebarItem } from "../models/sidebarItem.mode";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'common.home',
    icon: 'pi pi-home',
    redirectTo: 'dashboard',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.clients',
    icon: 'pi pi-user',
    redirectTo: 'clients',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.albums',
    icon: 'pi pi-images',
    redirectTo: 'albums',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.calendar',
    icon: 'pi pi-calendar',
    redirectTo: 'calendar',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.requests',
    icon: 'pi pi-envelope',
    redirectTo: 'requests',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.invites',
    icon: 'pi pi-send',
    redirectTo: 'invites',
    perm: PermissionsType.ADMIN
  },
  {
    title: 'common.settings',
    icon: 'pi pi-cog',
    redirectTo: 'configuration',
    perm: PermissionsType.SUPER_ADMIN
  },
]
