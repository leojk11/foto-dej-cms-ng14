import { PermissionsType } from "./permissions.enum";

export class Permissions {
  public static get perms(): Map<string, string[]> {
    return new Map<string, string[]>()
      .set('OP', [PermissionsType.OP])
      .set('BO', [PermissionsType.OP, PermissionsType.SUPER_ADMIN, PermissionsType.ADMIN])
      .set('SUPER_ADMIN', [PermissionsType.OP, PermissionsType.SUPER_ADMIN])
      .set('ADMIN', [PermissionsType.OP, PermissionsType.SUPER_ADMIN, PermissionsType.ADMIN])
  }
}
