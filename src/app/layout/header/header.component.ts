import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../export.service';
import { PageDataService } from 'src/app/page-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private exportService: ExportService,
    private pageDataService: PageDataService
  ) {}

  get pageName(): string {

    const page = this.pageDataService.getPageName();

    switch (page) {

      case 'overview-dashboard':
        return 'Overview';

      case 'fee-collection-dashboard':
        return 'Fee Collection';

      case 'exam-results-dashboard':
        return 'Exam Results';

      case 'attendance-dashboard':
        return 'Attendance';

      case 'budget-tracking-dashboard':
        return 'Budget Tracking';

      case 'branch-directory-dashboard':
        return 'Branch Directory';

      default:
        return 'Overview';
    }
  }

  exportCurrentPage() {

    const data = this.pageDataService.getPageData();

    const fileName = this.pageDataService.getPageName();

    if (!data || data.length === 0) {
      alert('No data available for export');
      return;
    }

    this.exportService.exportToExcel(
      fileName,
      data
    );
  }

  selectedSession = '2026-27';

  selectedState = 'All States';

  selectedBranch = 'All Branches';

  sessions = [
    '2025-26',
    '2026-27'
  ];

  states = [
    'All States',
    'Assam',
    'Madhya Pradesh',
    'Chhattisgarh',
    'Haryana',
    'Uttar Pradesh',
    'Odisha',
    'Tamil Nadu',
    'Maharashtra',
    'Telangana',
    'Himachal Pradesh'
  ];

  branches = [
    'All Branches',
    'MVM Guwahati-I',
    'MVM Guwahati-II',
    'MVM Guwahati-III',
    'MVM Jorhat',
    'MVM Silchar',
    'MVM Karimganj',
    'MVM Tezpur',
    'MVM Tangla',
    'MVM Bhopal-I',
    'MVM Bhopal-II',
    'MVM Jabalpur',
    'MVM Indore',
    'MVM Gwalior',
    'MVM Raipur-I',
    'MVM Bilaspur-I',
    'MVM Durg',
    'MVM Ambala',
    'MVM Gurgaon',
    'MVM Kurukshetra',
    'MVM Dharamshala',
    'MVM Kangra',
    'MVM Bhubaneswar',
    'MVM Angul',
    'MVM Balasore',
    'MVM Hyderabad',
    'MVM Noida',
    'MSE Chennai',
    'MVM Thanjavur',
    'MVM Wardha',
    'MVM Gondia'
  ];

  filteredBranches: string[] = [];

  ngOnInit(): void {
    this.filteredBranches = [...this.branches];
  }

  changeSession(session: string): void {

    this.selectedSession = session;

    console.log('Selected Session:', session);

  }

  onStateChange(): void {

    switch (this.selectedState) {

      case 'Assam':
        this.filteredBranches = [
          'MVM Guwahati-I',
          'MVM Guwahati-II',
          'MVM Guwahati-III',
          'MVM Jorhat',
          'MVM Silchar',
          'MVM Karimganj',
          'MVM Tezpur',
          'MVM Tangla'
        ];
        break;

      case 'Madhya Pradesh':
        this.filteredBranches = [
          'MVM Bhopal-I',
          'MVM Bhopal-II',
          'MVM Jabalpur',
          'MVM Indore',
          'MVM Gwalior'
        ];
        break;

      case 'Chhattisgarh':
        this.filteredBranches = [
          'MVM Raipur-I',
          'MVM Bilaspur-I',
          'MVM Durg'
        ];
        break;

      case 'Haryana':
        this.filteredBranches = [
          'MVM Ambala',
          'MVM Gurgaon',
          'MVM Kurukshetra'
        ];
        break;

      case 'Odisha':
        this.filteredBranches = [
          'MVM Bhubaneswar',
          'MVM Angul',
          'MVM Balasore'
        ];
        break;

      case 'Uttar Pradesh':
        this.filteredBranches = [
          'MVM Noida'
        ];
        break;

      case 'Tamil Nadu':
        this.filteredBranches = [
          'MSE Chennai',
          'MVM Thanjavur'
        ];
        break;

      case 'Maharashtra':
        this.filteredBranches = [
          'MVM Wardha',
          'MVM Gondia'
        ];
        break;

      case 'Telangana':
        this.filteredBranches = [
          'MVM Hyderabad'
        ];
        break;

      case 'Himachal Pradesh':
        this.filteredBranches = [
          'MVM Dharamshala',
          'MVM Kangra'
        ];
        break;

      default:
        this.filteredBranches = [...this.branches];
    }

    this.selectedBranch = this.filteredBranches[0];
  }

  onBranchChange(event: any): void {

    console.log(
      'Selected Branch:',
      this.selectedBranch
    );

  }

}
