import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PageDataService } from "src/app/page-data.service";
import { ExportService } from '../../export.service';
import{OverviewService} from '../../services/overview.service'

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {

  constructor(
    private pageDataService: PageDataService,
      private exportService: ExportService,
    private http: HttpClient,
     private overviewService: OverviewService
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
  selectedSession = "2026-27";
selectedState = "All States";
selectedBranch = "all";
compareMode = false;

states: any[] = [];
branches: any[] = [];

  overviewKpis: any[] = [];

  enrollmentLabels: any[] = [];
  enrollmentData: any[] = [];

  feeLabels: any[] = [];
  feeCollectionData: any[] = [];

  moduleLabels: any[] = [];
  moduleData: any[] = [];
  tenantId =
localStorage.getItem('tenantId') || '1';

  moduleChartColors = [
    {
      backgroundColor: [
        "#10a56f",
        "#2f80ed",
        "#d97706",
        "#7c3aed",
        "#dc2626",
        "#0891b2",
        "#6b7280",
      ],
    },
  ];

  enrollmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  horizontalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 100,
          },
        },
      ],
    },
  };

ngOnInit() {

  this.loadStates();
  this.loadBranches();

  this.loadDashboard();

  setTimeout(() => {
    this.pageDataService.setPageData(
      "overview-dashboard",
      this.prepareExportData()
    );
  }, 1000);

}

onSessionChange(session: string) {

  this.selectedSession = session;

  this.compareMode = false;

  this.loadDashboard();

}

onStateChange(state: string) {

  this.selectedState = state;

  this.selectedBranch = "all";

  this.loadBranches();

  this.loadDashboard();

}

onBranchChange(branch: string) {

  this.selectedBranch = branch;

  this.loadDashboard();

}

showCompare() {

  this.compareMode = true;

  this.loadDashboard();

}

loadDashboard() {

  this.loadOverviewData();

  this.loadEnrollmentData();

  this.loadFeeCollectionData();

  this.loadModuleData();

}
loadStates() {

  this.overviewService
    .getStates (Number(this.tenantId))
    .subscribe(res => {

      console.log('States =', res);

      this.states = res;

    });

}

loadBranches() {

  this.overviewService
    .getBranches(
      this.selectedState,
      Number(this.tenantId)
    )
    .subscribe(res => {

      console.log('Branches Response:', res);

      this.branches = res;

    });

}

loadOverviewData() {

  this.overviewService
    .getOverviewKpis(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
    Number(this.tenantId)
    )
    .subscribe(res => {

      this.overviewKpis = [

        {
          title: "Active Branches",
          value: res.active_branches || 0,
          trend: "",
          color: "green"
        },

        {
          title: "Total Students",
          value: res.total_students || 0,
          trend: "",
          color: "blue"
        },

        {
          title: "Fee Collection %",
          value: (res.fee_collection || 0) + "%",
          trend: "",
          color: "green"
        },

        {
          title: "Pass Rate",
          value: (res.pass_rate || 0) + "%",
          trend: "",
          color: "orange"
        },

        {
          title: "Attendance %",
          value: (res.attendance_rate || 0) + "%",
          trend: "",
          color: "blue"
        },

        {
          title: "Parent App Use",
          value: (res.parent_app_use || 0) + "%",
          trend: "",
          color: "green"
        }

      ];

    });

}

loadEnrollmentData() {

  const request = this.compareMode
    ? this.overviewService.getEnrollmentCompare(
        this.selectedSession,
        this.selectedState,
        this.selectedBranch,
       Number(this.tenantId)
      )
    : this.overviewService.getEnrollment(
        this.selectedSession,
        this.selectedState,
        this.selectedBranch,
         Number(this.tenantId)
      );

  request.subscribe((res: any[]) => {

    if (!res || res.length === 0) {

      this.enrollmentLabels = [];

      this.enrollmentData = [{
        label: this.selectedSession,
        data: []
      }];

      return;
    }

    if (this.compareMode) {

      this.enrollmentLabels =
        [...new Set(res.map(x => x.StateName))];

      this.enrollmentData = [

        {
          label: "2026-27",
          data: this.enrollmentLabels.map(label => {

            const row = res.find(x =>
              x.StateName === label &&
              x.AcademicYear === "2026-27"
            );

            return row ? row.students : 0;

          })
        },

        {
          label: "2025-26",
          data: this.enrollmentLabels.map(label => {

            const row = res.find(x =>
              x.StateName === label &&
              x.AcademicYear === "2025-26"
            );

            return row ? row.students : 0;

          })
        }

      ];

    } else {

      this.enrollmentLabels =
        res.map(x => x.StateName);

      this.enrollmentData = [

        {
          label: this.selectedSession,
          data: res.map(x => x.students)
        }

      ];

    }

  });

}

loadFeeCollectionData() {

  this.overviewService
    .getStateFeeCollection(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
       Number(this.tenantId)
    )
    .subscribe(res => {

      this.feeLabels =
        res.map(x => x.StateName);

      this.feeCollectionData = [

        {
          data: res.map(x =>
            Number(x.collection_rate)
          )
        }

      ];

    });

}

loadModuleData() {

  this.overviewService
    .getModuleAdoption(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
       Number(this.tenantId)
    )
    .subscribe(res => {

      this.moduleLabels =
        res.map(x => x.ModuleName);

      this.moduleData =
        res.map(x =>
          Number(x.usage_percent)
        );

    });

}


  prepareExportData() {

    const exportData: any[] = [];

    this.overviewKpis.forEach(item => {
      exportData.push({
        Section: "KPI",
        Item: item.title,
        Current: item.value,
        Previous: item.trend,
        Remarks: item.description
      });
    });

this.enrollmentLabels.forEach((state, i) => {
  exportData.push({
    Section: "Enrollment",
    Item: state,
    Current:
      this.enrollmentData.length > 0
        ? this.enrollmentData[0].data[i]
        : "",
    Previous:
      this.enrollmentData.length > 1
        ? this.enrollmentData[1].data[i]
        : "",
    Remarks: "Student Count"
  });
});

this.feeLabels.forEach((state, i) => {
  exportData.push({
    Section: "Fee Collection",
    Item: state,
    Current:
      this.feeCollectionData.length > 0
        ? this.feeCollectionData[0].data[i] + "%"
        : "",
    Previous: "",
    Remarks: "Collection Rate"
  });
});

    this.moduleLabels.forEach((module, i) => {
      exportData.push({
        Section: "Module Adoption",
        Item: module,
        Current: this.moduleData[i] + "%",
        Previous: "",
        Remarks: "Adoption Rate"
      });
    });

    return exportData;
  }


  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: {
      display: false
    }
  };
}
