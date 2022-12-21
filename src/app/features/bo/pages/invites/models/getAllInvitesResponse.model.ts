import { Invite } from "./invites.model";

export interface GetAllInvitesResponse {
  list: Invite[];
  page: number;
  total: number;
}
