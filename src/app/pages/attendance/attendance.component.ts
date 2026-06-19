import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Label } from "ng2-charts";
import { PageDataService } from "src/app/page-data.service";
import { ExportService } from "src/app/export.service";
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.css"]
})
export class AttendanceComponent implements OnInit {

  constructor(
    private pageDataService: PageDataService,
      private exportService: ExportService,
    private http: HttpClient,
    private attendanceService: AttendanceService

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

  if (!data || !data.length) {

    alert('No data available for export');

    return;

  }

  this.exportService.exportToExcel(
    'attendance-dashboard',
    data
  );

}

  ngOnInit() {
  this.loadStates();
  this.loadBranchDropdown();
    this.loadKpis();
    this.loadMonthlyTrend();
    this.loadDayWiseAttendance();
    this.loadAttendanceBands();

    setTimeout(() => {
      this.pageDataService.setPageData(
        "attendance-dashboard",
        this.prepareExportData()
      );
    }, 1000);
  }

  changeSession(session:string){

 this.selectedSession=session;

 this.compareMode=false;

 this.loadDashboard();

}

// toggleCompare(){

//  this.compareMode=true;

//  this.loadDashboard();

// }
toggleCompare() {

  this.compareMode = !this.compareMode;

  this.loadDashboard();

}

loadDashboard(){

 this.loadKpis();
 this.loadBranchDropdown() ;
    this.loadMonthlyTrend();
    this.loadDayWiseAttendance();
    this.loadAttendanceBands();


}

onBranchChange() {

  this.loadKpis();
   this.loadMonthlyTrend();
    this.loadDayWiseAttendance();
    this.loadAttendanceBands();

}

onStateChange(){

  this.selectedBranch = "all";

  this.loadBranchDropdown();

  this.loadKpis();
   this.loadMonthlyTrend();
    this.loadDayWiseAttendance();
    this.loadAttendanceBands();

}



    selectedSession = "2026-27";
selectedState = "All States";
selectedBranch = "all";
compareMode = false;

  kpis: any[] = [];
  states: any[] = [];

  subjectLabels: Label[] = [];
  subjectData: any[] = [];

  gradeLabels: string[] = [];
  gradeData: number[] = [];

      tenantId =
localStorage.getItem('tenantId') || '1';

  gradeColors = [
    {
      backgroundColor: [
        "#18a36f",
        "#62c7a4",
        "#276fd1",
        "#de7b00",
        "#e42a2a",
        "#6b7280"
      ]
    }
  ];

  classLabels: Label[] = [];
  classData: any[] = [];

  termLabels: Label[] = [];
  termData: any[] = [];
  branchOptions:any[] = [];
branchSummary:any[] = [];


  monthlyLabels: Label[] = [];
  monthlyData: any[] = [];

  weekdayLabels: Label[] = [];
  weekdayData: any[] = [];

  bandLabels: string[] = [];
  bandData: number[] = [];


loadStates() {

  this.attendanceService
    .getStates(Number(this.tenantId))
    .subscribe((res: any[]) => {

      console.log('States =', res);

      this.states = [

        'All States',

        ...res.map(x => x.StateName)

      ];

    });

}

loadBranchDropdown() {

  this.attendanceService
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

loadKpis() {

  this.attendanceService
    .getAttendanceSummary(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any) => {

      console.log('Attendance KPI:', res);

      this.kpis = [

        {
          title: 'Average Attendance',
          value: res.averageAttendance + '%',
          color: 'green'
        },

        {
          title: 'Best Branch',
          value: res.bestBranchAttendance + '%',
          trend: res.bestBranch,
          color: 'blue'
        },

        {
          title: 'Below 80%',
          value: res.below80,
          color: 'amber'
        },

        {
          title: 'Chronic Absent',
          value: res.chronicAbsent,
          color: 'red'
        }

      ];

    });

}

loadMonthlyTrend() {

  this.attendanceService
    .getMonthlyTrend(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.monthlyLabels =
        res.map(x => x.MonthName);

      const compareSession =
        this.selectedSession === '2026-27'
          ? '2025-26'
          : '2026-27';

      if (this.compareMode) {

        this.monthlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session))
          },

          {
            label: compareSession,
            data: res.map(x => Number(x.compare_session))
          },

          {
            label: 'Target',
            data: res.map(x => Number(x.target))
          }

        ];

      } else {

        this.monthlyData = [

          {
            label: this.selectedSession,
            data: res.map(x => Number(x.current_session))
          },

          {
            label: 'Target',
            data: res.map(x => Number(x.target))
          }

        ];

      }

    });

}

loadDayWiseAttendance() {

  this.attendanceService
    .getDayWiseAttendance(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe({

      next: (res: any[]) => {

        this.weekdayLabels =
          res.map(x => x.day_name);

        this.weekdayData = [

          {
            label: this.selectedSession,
            data: res.map(
              x => Number(x.attendance_percent)
            )
          }

        ];

      },

      error: (err) => {

        console.error(
          'Day Wise Attendance Error:',
          err
        );

      }

    });

}

loadAttendanceBands() {

  this.attendanceService
    .getAttendanceBands(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe({

      next: (res: any[]) => {

        this.bandLabels =
          res.map(x => x.band_name);

        this.bandData =
          res.map(x => Number(x.student_count));

      },

      error: (err) => {

        console.error(
          'Attendance Bands Error:',
          err
        );

      }

    });

}


  bandColors = [{
    backgroundColor: [
      "#18a36f",
      "#276fd1",
      "#de7b00",
      "#e52424"
    ]
  }];

  lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top"
    },
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false
        }
      }]
    }
  };

  barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          min: 60,
          max: 110
        }
      }]
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


 prepareExportData() {

  const exportData: any[] = [];

  /* KPI */

  if (this.kpis && this.kpis.length) {

    this.kpis.forEach((kpi: any) => {

      exportData.push({

        Section: 'KPI',

        Item: kpi.title,

        Current: kpi.value,

        Previous: kpi.trend || '',

        Remarks: ''

      });

    });

  }

  /* Monthly Attendance */

  if (
    this.monthlyLabels &&
    this.monthlyLabels.length &&
    this.monthlyData &&
    this.monthlyData.length
  ) {

    this.monthlyLabels.forEach((month, i) => {

      exportData.push({

        Section: 'Monthly Attendance',

        Item: month,

        Current:
          this.monthlyData[0]
            ? this.monthlyData[0].data[i]
            : '',

        Previous:
          this.monthlyData.length > 1
            ? this.monthlyData[1].data[i]
            : '',

        Target:
          this.monthlyData.length > 2
            ? this.monthlyData[2].data[i]
            : '',

        Remarks: ''

      });

    });

  }

  /* Day Wise */

  if (
    this.weekdayLabels &&
    this.weekdayLabels.length &&
    this.weekdayData &&
    this.weekdayData.length
  ) {

    this.weekdayLabels.forEach((day, i) => {

      exportData.push({

        Section: 'Weekday Attendance',

        Item: day,

        Current: this.weekdayData[0].data[i],

        Previous: '',

        Target: '',

        Remarks: ''

      });

    });

  }

  /* Attendance Bands */

  if (
    this.bandLabels &&
    this.bandLabels.length
  ) {

    this.bandLabels.forEach((band, i) => {

      exportData.push({

        Section: 'Attendance Band',

        Item: band,

        Current: this.bandData[i],

        Previous: '',

        Target: '',

        Remarks: 'Student Distribution'

      });

    });

  }

  return exportData;

}
}
