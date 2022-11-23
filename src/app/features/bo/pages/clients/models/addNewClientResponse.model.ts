import {Client} from "./client.model";

export interface AddNewClientResponse {
  message: string;
  client: Client;
}
