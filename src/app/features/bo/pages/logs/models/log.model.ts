import { Client } from "src/app/features/bo/pages/clients/models/client.model";

export interface Log {
  id: string;
  client_id: string;
  client: Client;
  action: string;
  date: string;
  time: string;
}

// possible actions:

// LOGIN
// LOGOUT
// ACTIVATE_ACCOUNT
// SELECTED_IMAGES
// UPDATED_PROFILE