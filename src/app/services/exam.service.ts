import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

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

  getExamKpis(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any>(
      `${this.apiUrl}/exam-kpi`,
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

  getSubjectScores(
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/exam-subject-scores`,
      {
        params: {
          state,
          schoolId,
          tenantId: tenantId.toString()
        }
      }
    );
  }

  getGradeDistribution(
    session: string,
    state: string,
    schoolId: string,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/exam-grade-distribution`,
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

  getClassPassRate(
    session: string,
    state: string,
    schoolId: string,
    compare: boolean,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/exam-class-passrate`,
      {
        params: {
          session,
          state,
          schoolId,
          compare: compare.toString(),
          tenantId: tenantId.toString()
        }
      }
    );
  }

  getTermTrend(
    session: string,
    state: string,
    schoolId: string,
    compare: boolean,
    tenantId: number
  ) {
    return this.http.get<any[]>(
      `${this.apiUrl}/exam-term-trend`,
      {
        params: {
          session,
          state,
          schoolId,
          compare: compare.toString(),
          tenantId: tenantId.toString()
        }
      }
    );
  }

}
