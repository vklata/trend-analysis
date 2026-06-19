import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private apiUrl =
    'http://localhost:5001/api/dashboard';

  constructor(
    private http: HttpClient
  ) {}

getBranchDirectory(
  tenantId: number
) {

  return this.http.get<any[]>(
    `${this.apiUrl}/c-branch-directory`,
    {
      params: {
        tenantId:
          tenantId.toString()
      }
    }
  );

}

}