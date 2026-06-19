import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl =
    'http://localhost:5001/api/dashboard';

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

  getBudgetSummary(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any>(
      `${this.apiUrl}/budget-summary`,
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
      `${this.apiUrl}/budget-monthly-trend`,
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

  getIncomeBreakdown(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/income-breakdown`,
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

  getExpenseBreakdown(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/expense-breakdown`,
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

  getExpenseTrend(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/budget-expense-trend`,
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

  getBudgetHeadwise(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/budget-headwise`,
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
