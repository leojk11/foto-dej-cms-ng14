import { Client } from "./client.model";

export interface GetAllClientsResponse {
  list: Client[];
  page: number;
  total: number;
};
