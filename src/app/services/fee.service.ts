import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private apiUrl = 'http://localhost:5001/api/dashboard';

  constructor(
    private http: HttpClient
  ) { }

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

  getFeeKpis(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any>(
      `${this.apiUrl}/fee-kpis`,
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

  getMonthlyCollection(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/fee-monthly-collection`,
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

  getQuarterlyCollection(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/fee-quarterly`,
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

  getPaymentModeSplit(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/payment-mode-split`,
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

  getOutstandingAging(
    session: string,
    compare: boolean,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/outstanding-aging`,
      {
        params: {
          session,
          compare: compare.toString(),
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );

  }

  getBranchSummary(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/fee-branch-summary`,
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
