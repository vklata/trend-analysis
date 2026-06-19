import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn:'root'
})
export class DashboardService{

  api='http://localhost:5001/api/dashboard';

  constructor(private http:HttpClient){}

  getOverview(){
    return this.http.get(`${this.api}/overview`);
  }

  getEnrollment(){
    return this.http.get(`${this.api}/enrollment`);
  }

  getFeeCollection(){
    return this.http.get(`${this.api}/fee-collection`);
  }

  getModuleAdoption(){
    return this.http.get(`${this.api}/module-adoption`);
  }
}
