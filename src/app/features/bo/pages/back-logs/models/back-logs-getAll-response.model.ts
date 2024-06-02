import { BackLog } from "./back-log.model";

export interface BackLogsGetAllResponse {
  page: number;
  total: number;
  list: BackLog[];
};
