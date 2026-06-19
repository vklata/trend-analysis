import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  private api = 'http://localhost:5001/api/dashboard';

  constructor(private http: HttpClient) {}

  getStates(tenantId: number) {
    return this.http.get<any[]>(
      `${this.api}/state?tenantId=${tenantId}`
    );
  }

  getBranches(
    state: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.api}/branches/${encodeURIComponent(state)}?tenantId=${tenantId}`
    );
  }

  getOverviewKpis(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any>(
      `${this.api}/overview-kpis`,
      {
        params: {
          tenantId:tenantId.toString(),
          session,
          state,
          schoolId
        }
      }
    );
  }

  getEnrollment(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.api}/overview-enrollment`,
      {
        params: {
          tenantId:tenantId.toString(),
          session,
          state,
          schoolId
        }
      }
    );
  }

  getEnrollmentCompare(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.api}/overview-enrollment-compare`,
      {
        params: {
          tenantId:tenantId.toString(),
          session,
          state,
          schoolId
        }
      }
    );
  }

getStateFeeCollection(
  session: string,
  state: string,
  schoolId: string,
  tenantId: number
) {
  return this.http.get<any[]>(
    `${this.api}/overview-state-fee`,
    {
      params: {
        tenantId: tenantId.toString(),
        session,
        state,
        schoolId
      }
    }
  );
}

  getModuleAdoption(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.api}/overview-module-adoption`,
      {
        params: {
          tenantId:tenantId.toString(),
          session,
          state,
          schoolId
        }
      }
    );
  }
}
