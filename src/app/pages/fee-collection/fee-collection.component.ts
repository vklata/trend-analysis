import { Component, OnInit } from "@angular/core";
import { PageDataService } from "src/app/page-data.service";
import { ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { HttpClient } from "@angular/common/http";
import { ExportService } from "src/app/export.service";
import { FeeService } from '../../services/fee.service';



@Component({
  selector: "app-fee-collection",
  templateUrl: "./fee-collection.component.html",
  styleUrls: ["./fee-collection.component.css"]
})
export class FeeCollectionComponent implements OnInit {
 constructor(
    private pageDataService: PageDataService,
      private exportService: ExportService,
    private http: HttpClient,
     private feeService: FeeService
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

  const data = this.prepareExportData();

  console.log(data);

  if (!data || data.length === 0) {
    alert('No data available for export');
    return;
  }

  this.exportService.exportToExcel(
    'Fee Collection Report',
    data
  );
}

selectedSession = "2026-27";
selectedState = "All States";
selectedBranch = "all";
compareMode = false;

states: any[] = [];
kpis:any[] = [];

monthlyLabels:any[] = [];
monthlyData:any[] = [];

quarterLabels:any[] = [];
quarterData:any[] = [];

paymentLabels:any[] = [];
paymentData:any[] = [];

agingLabels: string[] = [];
agingData: any[] = [];

branchRows:any[] = [];
branchOptions:any[]=[];
quarterlyLabels: string[] = [];

quarterlyData: any[] = [];
tenantId = localStorage.getItem('tenantId') || '1';

loadDashboard(){

  this.loadKpis();

  this.loadMonthlyCollection();

  this.loadQuarterlyCollection();

  this.loadPaymentModeSplit();

  this.loadOutstandingAging();

  this.loadBranchSummary();

   setTimeout(() => {
console.log("export call not")
    this.pageDataService.setPageData(
      'fee-collection-dashboard',
      this.prepareExportData()
    );
console.log("export call")
  }, 2000);

}
loadKpis() {

  this.feeService
    .getFeeKpis(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any) => {

      this.kpis = [

        {
          title: 'Total Collected',
          value: '₹' + (res.total_collected || 0) + ' Cr',
          trend: 'Collection',
          color: 'green'
        },

        {
          title: 'Outstanding',
          value: '₹' + (res.outstanding || 0) + ' Cr',
          trend: 'Pending',
          color: 'red'
        },

        {
          title: 'Collection Rate',
          value: (res.collection_rate || 0) + '%',
          trend: 'Target',
          color: 'blue'
        },

        {
          title: 'Online Payment',
          value: (res.online_payment || 0) + '%',
          trend: 'Digital',
          color: 'purple'
        },

        {
          title: 'Defaulters',
          value: res.defaulters || 0,
          trend: 'Students',
          color: 'orange'
        }

      ];

    });

}

loadMonthlyCollection() {

  this.feeService
    .getMonthlyCollection(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.monthlyLabels = res.map(x => x.month_name);

      if (this.compareMode) {

        this.monthlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session || 0))
          },

          {
            label:
              this.selectedSession === '2026-27'
                ? '2025-26'
                : '2026-27',

            data: res.map(x => Number(x.compare_session || 0))
          }

        ];

      } else {

        this.monthlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session || 0))
          }

        ];

      }

    });

}

loadQuarterlyCollection() {

  this.feeService
    .getQuarterlyCollection(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.quarterlyLabels =
        res.map(x => x.quarter_name);

      if (this.compareMode) {

        this.quarterlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session))
          },

          {
            label:
              this.selectedSession === '2026-27'
                ? '2025-26'
                : '2026-27',

            data: res.map(x => Number(x.compare_session))
          }

        ];

      } else {

        this.quarterlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session))
          }

        ];

      }

    });

}

loadPaymentModeSplit() {

  this.feeService
    .getPaymentModeSplit(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.paymentLabels =
        res.map(x => x.PaymentMode);

      this.paymentData =
        res.map(x => Number(x.percentage));

    });

}

loadOutstandingAging() {

  this.feeService
    .getOutstandingAging(
      this.selectedSession,
      this.compareMode,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.agingLabels =
        res.map(x => x.DueMonth);

      const compareSession =
        this.selectedSession === '2026-27'
          ? '2025-26'
          : '2026-27';

      if (this.compareMode) {

        this.agingData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session))
          },

          {
            label: compareSession,
            data: res.map(x => Number(x.compare_session))
          }

        ];

      } else {

        this.agingData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.amount))
          }

        ];

      }

    });

}

loadBranchSummary() {

  this.feeService
    .getBranchSummary(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.branchRows = res.map(row => ({

        branch: row.branch_name,

        state: row.state_name,

        rate2027: row.current_rate + '%',

        rate2026: row.compare_rate + '%',

        change:
          Number(row.change_percent || 0).toFixed(2) + '%',

        outstanding:
          '₹' + row.outstanding + ' L',

        status: row.status

      }));

    });

}

loadBranchDropdown() {

  this.feeService
    .getBranches(
      this.selectedState,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.branchOptions = [

        {
          SchoolId: 'all',
          SchoolName: 'All Branches'
        },

        ...res

      ];

    });

}

loadStates() {

  this.feeService
    .getStates(Number(this.tenantId))
    .subscribe((res: any[]) => {

      console.log('States =', res);

      this.states = [

        'All States',

        ...res.map(x => x.StateName)

      ];

    });

}



changeSession(session:string){

this.selectedSession=session;

this.compareMode=false;

this.loadDashboard();

}

toggleCompare(){

this.compareMode=!this.compareMode;

this.loadDashboard();

}

onStateChange(){

this.selectedBranch='all';

this.loadBranchDropdown();

this.loadDashboard();

}

onBranchChange(){

this.loadDashboard();

}

ngOnInit(){

this.loadStates();

this.loadBranchDropdown();

this.loadDashboard();

}

get filteredBranches() {

  const search =
    this.searchText.toLowerCase().trim();

  if (!search) {
    return this.branchRows;
  }

  return this.branchRows.filter(branch =>

    (branch.branch || "")
      .toLowerCase()
      .includes(search)

    ||

    (branch.state || "")
      .toLowerCase()
      .includes(search)

    ||

    String(branch.rate2027 || "")
      .toLowerCase()
      .includes(search)

    ||

    String(branch.rate2026 || "")
      .toLowerCase()
      .includes(search)

    ||

    String(branch.change || "")
      .toLowerCase()
      .includes(search)

    ||

    String(branch.outstanding || "")
      .toLowerCase()
      .includes(search)

    ||

    (branch.status || "")
      .toLowerCase()
      .includes(search)

  );

}
  

  paymentColors = [
    {
      backgroundColor: [
        "#10a56f",
        "#2f80ed",
        "#6b7280"
      ]
    }
  ];

  lineOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top"
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            fontSize: 10
          }
        }
      ]
    }
  };

chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  scales: {
    xAxes: [{
      ticks: {
        fontColor: '#666'
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
};

  agingOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top"
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            fontSize: 10
          }
        }
      ]
    }
  };


  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: {
      display: false
    }
  };

  searchText = "";


prepareExportData() {

  const exportData: any[] = [];

  /* KPI */

  this.kpis.forEach(item => {
    exportData.push({
      Section: "KPI",
      Item: item.title,
      Current: item.value,
      Previous: item.trend,
      Remarks: ""
    });
  });

  /* MONTHLY COLLECTION */

  this.monthlyLabels.forEach((month, i) => {
    exportData.push({
      Section: "Monthly Collection",
      Item: month,
Current:
  (this.monthlyData &&
   this.monthlyData.length > 0 &&
   this.monthlyData[0].data)
    ? this.monthlyData[0].data[i]
    : "",

Previous:
  (this.monthlyData &&
   this.monthlyData.length > 1 &&
   this.monthlyData[1].data)
    ? this.monthlyData[1].data[i]
    : "",
      Remarks: "₹ Crore"
    });
  });

  /* QUARTERLY */

  this.quarterlyLabels.forEach((quarter, i) => {
    exportData.push({
      Section: "Quarterly Collection",
      Item: quarter,
Current:
  (this.quarterlyData &&
   this.quarterlyData.length > 0 &&
   this.quarterlyData[0].data)
    ? this.quarterlyData[0].data[i]
    : "",

Previous:
  (this.quarterlyData &&
   this.quarterlyData.length > 1 &&
   this.quarterlyData[1].data)
    ? this.quarterlyData[1].data[i]
    : "",
      Remarks: "₹ Crore"
    });
  });

  /* PAYMENT MODES */

  this.paymentLabels.forEach((mode, i) => {
    exportData.push({
      Section: "Payment Mode",
      Item: mode,
      Current: this.paymentData[i] + "%",
      Previous: "",
      Remarks: "Share"
    });
  });

  /* AGING */

/* AGING */

this.agingLabels.forEach((month, i) => {
  exportData.push({
    Section: "Outstanding Aging",
    Item: month,

Current:
  (this.agingData &&
   this.agingData.length > 0 &&
   this.agingData[0].data)
    ? this.agingData[0].data[i]
    : "",

Previous:
  (this.agingData &&
   this.agingData.length > 1 &&
   this.agingData[1].data)
    ? this.agingData[1].data[i]
    : "",

    Remarks: "₹ Lakh"
  });
});

  /* BRANCH TABLE */

  this.branchRows.forEach(branch => {
    exportData.push({
      Section: "Branch",
      Item: branch.branch,
      Current: branch.rate2027,
      Previous: branch.rate2026,
      Remarks:
        branch.state +
        " | Outstanding: " +
        branch.outstanding +
        " | Status: " +
        branch.status
    });
  });

  return exportData;
}

}
