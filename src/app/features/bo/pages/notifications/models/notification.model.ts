import { Schedule } from "../../calendar/models/schedule.model";
import { Client } from "../../clients/models/client.model";

export interface Notification {
  id: string;
  client: Client;
  client_id: string;
  event_info: Schedule;
  message: string;
  date: string;
  time: string;
  type: string;
  time_passed: number;
  time_passed_type: string;
}