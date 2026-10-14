import {Inject, Injectable} from '@angular/core';
import {API_URL} from "../../../../../core/tokens/api-url.token";
import { HttpClient } from "@angular/common/http";
import {AddNewSchedulePayload} from "../models/addNewSchedulePayload.model";
import {Observable} from "rxjs";
import {AddNewScheduleResponse} from "../models/addNewScheduleResponse.model";
import {Schedule} from "../models/schedule.model";
import { Location } from '../models/location.model';

export interface DatesParams {
  from: string;
  to: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient
  ) { }

  getAllSchedulesForUser(dates: DatesParams, filters?: { title: string }): Observable<Schedule[]> {
    let path = `${ this.apiUrl }/schedules/for/user?from=${ dates.from }&to=${ dates.to }`;
    
    if (!!filters) {
      if (filters.title) {
        path += `&title=${ filters.title }`;
      }
    }

    return this.http.get<Schedule[]>(path);
  }

  getSingleSchedule(id: string): Observable<Schedule> {
    const path = `${ this.apiUrl }/schedules/${ id }`;
    return this.http.get<Schedule>(path);
  }

  addNewSchedule(payload: AddNewSchedulePayload): Observable<AddNewScheduleResponse> {
    const path = `${ this.apiUrl }/schedules`;
    return this.http.post<AddNewScheduleResponse>(path, payload);
  }

  updateSchedule(id: string, payload: Partial<Schedule>): Observable<any> {
    const path = `${ this.apiUrl }/schedules/${ id }`;
    return this.http.patch<any>(path, payload);
  }

  deleteSchedule(id: string): Observable<any> {
    const path = `${ this.apiUrl }/schedules/${ id }`;
    return this.http.delete<any>(path);
  }

  // locations
  getScheduleLocations(id: string): Observable<Location[]> {
    const path = `${ this.apiUrl }/schedules/${ id }/locations`;
    return this.http.get<Location[]>(path);
  }

  addNewLocation(id: string, payload: Partial<Location>): Observable<any> {
    const path = `${ this.apiUrl }/schedules/${ id }/locations`;
    return this.http.post(path, payload);
  }

  updateLocation(scheduleId: string, locationId: string, payload: Partial<Location>): Observable<any> {
    const path = `${ this.apiUrl }/schedules/${ scheduleId }/locations/${ locationId }`;
    return this.http.patch<any>(path, payload);
  }

  deleteLocation(scheduleId: string, locationId: string): Observable<any> {
    const path = `${ this.apiUrl }/schedules/${ scheduleId }/locations/${ locationId }`;
    return this.http.delete<any>(path);
  }
}