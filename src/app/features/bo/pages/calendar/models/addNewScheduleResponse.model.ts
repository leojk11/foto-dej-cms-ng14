import {Schedule} from "./schedule.model";

export interface AddNewScheduleResponse {
  message: string;
  schedule: Schedule;
}