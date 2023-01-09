import { Request } from "./request.model";

export interface GetAllRequestsResponse {
  list: Request[];
  page: number;
  total: number;
}
