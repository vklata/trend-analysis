import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  pageName = '';

  pageData: any[] = [];

  setPageData(name: string, data: any[]) {
    this.pageName = name;
    this.pageData = data;
  }

  getPageName() {
    return this.pageName;
  }

  getPageData() {
    return this.pageData;
  }

}
