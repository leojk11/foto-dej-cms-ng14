import { CleanUser } from "../../clients/models/client.model";

export interface Invite {
  id: string;

  invited_client: CleanUser;
  invited_client_id: string;

  invited_by: CleanUser;
  invited_by_id: string;

  date: string;
  time: string;
}
