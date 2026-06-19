import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:5001/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getStates(tenantId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/state`,
      {
        params: {
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getBranches(
    state: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/branches/${encodeURIComponent(state)}`,
      {
        params: {
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getAttendanceSummary(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any>(
      `${this.apiUrl}/attendance-summary`,
      {
        params: {
          session,
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getMonthlyTrend(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/attendance-monthly-trend`,
      {
        params: {
          session,
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getDayWiseAttendance(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/attendance-daywise`,
      {
        params: {
          session,
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getAttendanceBands(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/attendance-bands`,
      {
        params: {
          session,
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );

  }

}
