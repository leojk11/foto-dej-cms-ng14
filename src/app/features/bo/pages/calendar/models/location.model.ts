import { Schedule } from "./schedule.model";

export interface Location {
	id: string;
  	title: string;
	place: string;

	date: string;
	time: string;

	location_n?: number;

	schedule_id: string;
	schedule: Schedule;
	user_id: string;

	// internal data
	created_by: string;
	created_by_id: string;
	created_date: string;
	created_time: string;
	
	modified_by: string;
	modified_by_id: string;
	modified_date: string;
	modified_time: string;
}
