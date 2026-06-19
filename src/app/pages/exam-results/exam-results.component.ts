import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { PageDataService } from "src/app/page-data.service";
import { ExportService } from "src/app/export.service";
import { ExamService } from '../../services/exam.service';

@Component({
  selector: "app-exam-results",
  templateUrl: "./exam-results.component.html",
  styleUrls: ["./exam-results.component.css"]
})
export class ExamResultsComponent implements OnInit {

 constructor(
    private pageDataService: PageDataService,
      private exportService: ExportService,
    private http: HttpClient,
     private examService: ExamService
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
  searchText = "";
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

  ngOnInit() {
  this.loadStates();
  this.loadBranchDropdown();
    this.loadKpis();
    this.loadSubjectScores();
    this.loadGradeDistribution();
    this.loadClassPassRate();
    this.loadTermTrend();

    setTimeout(() => {
      this.pageDataService.setPageData(
        "exam-results-dashboard",
        this.prepareExportData()
      );
    }, 1000);
  }

changeSession(session:string){

this.selectedSession=session;

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

toggleCompare(){

this.compareMode=!this.compareMode;

this.loadDashboard();

}

loadDashboard(){

 this.loadKpis();
 this.loadBranchDropdown() ;
  this.loadSubjectScores();
  this.loadGradeDistribution();
  this.loadClassPassRate();
  this.loadTermTrend();

}
loadKpis() {

  this.examService
    .getExamKpis(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any) => {

      this.kpis = [

        {
          title: 'Overall Pass %',
          value: res.overall_pass + '%',
          color: 'green'
        },

        {
          title: 'Distinctions',
          value: res.distinctions + '%',
          color: 'blue'
        },

        {
          title: 'Avg Score',
          value: res.avg_score,
          color: 'amber'
        },

        {
          title: 'Failures',
          value: res.failures + '%',
          color: 'red'
        },

        {
          title: 'Toppers',
          value: res.toppers + '%',
          color: 'purple'
        }

      ];

    });

}

loadSubjectScores() {

  this.examService
    .getSubjectScores(
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.subjectLabels =
        res.map(x => x.SubjectName);

      if (this.compareMode) {

        this.subjectData = [

          {
            label: '2026-27',
            data: res.map(x => Number(x.score_2027))
          },

          {
            label: '2025-26',
            data: res.map(x => Number(x.score_2026))
          }

        ];

      } else {

        this.subjectData = [

          {
            label: this.selectedSession,
            data:
              this.selectedSession === '2026-27'
                ? res.map(x => Number(x.score_2027))
                : res.map(x => Number(x.score_2026))
          }

        ];

      }

    });

}

loadGradeDistribution() {

  this.examService
    .getGradeDistribution(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.gradeLabels =
        res.map(x => x.grade_name);

      this.gradeData =
        res.map(x => Number(x.student_percent));

    });

}

loadClassPassRate() {

  this.examService
    .getClassPassRate(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      this.compareMode,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.classLabels =
        res.map(x => x.ClassName);

      if (this.compareMode) {

        this.classData = [

          {
            label: '2025-26',
            backgroundColor: '#8ab3e5',
            data: res.map(
              x => Number(x.passrate_2025 || 0)
            )
          },

          {
            label: '2026-27',
            backgroundColor: '#18a36f',
            data: res.map(
              x => Number(x.passrate_2026 || 0)
            )
          }

        ];

      } else {

        this.classData = [

          {
            label: this.selectedSession,
            backgroundColor: '#18a36f',
            data: res.map(
              x => Number(x.pass_rate || 0)
            )
          }

        ];

      }

    });

}

loadTermTrend() {

  this.examService
    .getTermTrend(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      this.compareMode,
      Number(this.tenantId)
    )
    .subscribe({

      next: (res: any[]) => {

        this.termLabels =
          res.map(x => x.ExamName);

        if (this.compareMode) {

          this.termData = [

            {
              label: '2025-26',
              data: res.map(
                x => Number(x.score_2025 || 0)
              ),
              borderColor: '#fbbf24',
              fill: false,
              tension: 0.4
            },

            {
              label: '2026-27',
              data: res.map(
                x => Number(x.score_2026 || 0)
              ),
              borderColor: '#d97706',
              fill: false,
              tension: 0.4
            }

          ];

        } else {

          this.termData = [

            {
              label: this.selectedSession,
              data: res.map(
                x => Number(x.score || 0)
              ),
              borderColor: '#d97706',
              fill: true,
              tension: 0.4
            }

          ];

        }

      },

      error: err => {
        console.error(err);
      }

    });

}

loadBranchDropdown() {

  this.examService
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

  this.examService
    .getStates(
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      console.log('States =', res);

      this.states = [

        'All States',

        ...res.map(x => x.StateName)

      ];

    });

}

barOptions: any = {
  responsive: true,
  maintainAspectRatio: false,

  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 100
        }
      }
    ]
  },

  legend: {
    position: "top"
  }
};

  lineOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top"
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

    this.kpis.forEach(item => {
      exportData.push({
        Section: "KPI",
        Item: item.title,
        Current: item.value,
        Previous: item.trend,
        Remarks: ""
      });
    });

    this.subjectLabels.forEach((subject: any, i) => {
      exportData.push({
        Section: "Subject Score",
        Item: subject,
        Current: this.subjectData[0]
          ? this.subjectData[0].data[i]
          : "",
        Previous: this.subjectData[1]
          ? this.subjectData[1].data[i]
          : "",
        Remarks: "Average Marks"
      });
    });

    this.gradeLabels.forEach((grade, i) => {
      exportData.push({
        Section: "Grade Distribution",
        Item: grade,
        Current: this.gradeData[i] + "%",
        Previous: "",
        Remarks: "Students"
      });
    });

    this.classLabels.forEach((cls: any, i) => {
      exportData.push({
        Section: "Class Pass Rate",
        Item: cls,
        Current: this.classData[0]
          ? this.classData[0].data[i] + "%"
          : "",
        Previous: this.classData[1]
          ? this.classData[1].data[i] + "%"
          : "",
        Remarks: ""
      });
    });

    this.termLabels.forEach((term: any, i) => {
      exportData.push({
        Section: "Term Trend",
        Item: term,
        Current: this.termData[0]
          ? this.termData[0].data[i]
          : "",
        Previous: this.termData[1]
          ? this.termData[1].data[i]
          : "",
        Remarks: "Average Score"
      });
    });

    return exportData;
  }
}
