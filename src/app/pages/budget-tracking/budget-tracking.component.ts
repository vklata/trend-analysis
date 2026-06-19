import { Component, OnInit } from "@angular/core";
import { ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import { PageDataService } from "src/app/page-data.service";
import { HttpClient } from "@angular/common/http";
import { ExportService } from "src/app/export.service";
import { ChangeDetectorRef } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: "app-budget-tracking",
  templateUrl: "./budget-tracking.component.html",
  styleUrls: ["./budget-tracking.component.css"],
})
export class BudgetTrackingComponent implements OnInit {
  constructor(
    private pageDataService: PageDataService,
    private exportService: ExportService,
    private http: HttpClient,
      private cdr: ChangeDetectorRef,
        private budgetService: BudgetService


  ) {}

  get pageName(): string {
    const page = this.pageDataService.getPageName();

    switch (page) {
      case "overview-dashboard":
        return "Overview";

      case "fee-collection-dashboard":
        return "Fee Collection";

      case "exam-results-dashboard":
        return "Exam Results";

      case "attendance-dashboard":
        return "Attendance";

      case "budget-tracking-dashboard":
        return "Budget Tracking";

      case "branch-directory-dashboard":
        return "Branch Directory";

      default:
        return "Overview";
    }
  }

exportCurrentPage() {

  const data = this.prepareExportData();

  console.log('Budget Export Data', data);

  if (!data || data.length === 0) {

    alert('No data available for export');

    return;
  }

  this.exportService.exportToExcel(
    'Budget Tracking Report',
    data
  );

}

  ngOnInit() {
    this.loadStates();
    this.loadBranchDropdown();
    this.loadKpis();
    this.loadMonthlyTrend();
    this.loadIncomeBreakdown();
    this.loadExpenseBreakdown();
    this.loadExpenseTrend();
    this.loadBudgetDetails();

    setTimeout(() => {
      this.pageDataService.setPageData(
        "budget-tracking-dashboard",
        this.prepareExportData()
      );
    }, 1000);
  }

  changeSession(session: string) {
    this.selectedSession = session;

    this.compareMode = false;

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

  loadDashboard() {
    this.loadKpis();
    this.loadBranchDropdown();
    this.loadMonthlyTrend();
    this.loadExpenseTrend();
    this.loadIncomeBreakdown();
    this.loadExpenseBreakdown();
    this.loadBudgetDetails();
  }

  onBranchChange() {
    this.loadKpis();

    this.loadMonthlyTrend();
    this.loadExpenseTrend();
    this.loadIncomeBreakdown();
    this.loadExpenseBreakdown();
    this.loadBudgetDetails();
  }

  onStateChange() {
    this.selectedBranch = "all";

    this.loadBranchDropdown();

    this.loadKpis();

    this.loadMonthlyTrend();
    this.loadExpenseTrend();
    this.loadIncomeBreakdown();
    this.loadExpenseBreakdown();
    this.loadBudgetDetails();
  }




  states: any[] = [];
  selectedSession = "2026-27";
  selectedState = "All States";
  selectedBranch = "all";
  compareMode = false;
  kpis: any[] = [];
  showExpenseChart = true;
  branchOptions: any[] = [];

  monthlyLabels: Label[] = [];
        tenantId =
localStorage.getItem('tenantId') || '1';

  incomeExpenseData: any[] = [
    {
      label: "Income 2026-27",
      data: [] as number[],
      borderColor: "#18a36f",
      backgroundColor: "rgba(24,163,111,0.08)",
      fill: false,
    },
    {
      label: "Expense 2026-27",
      data: [] as number[],
      borderColor: "#276fd1",
      backgroundColor: "rgba(39,111,209,0.08)",
      fill: false,
    },
    {
      label: "Income 2025-26",
      data: [] as number[],
      borderColor: "#73e79f",
      borderDash: [5, 5],
      fill: false,
    },
    {
      label: "Expense 2025-26",
      data: [] as number[],
      borderColor: "#8fc1ff",
      borderDash: [5, 5],
      fill: false,
    },
  ];

  incomeLabels: string[] = [];
  incomeData: number[] = [];


  expenseLabels: string[] = [];
  expenseData: number[] = [];

  expenseTrendLabels: Label[] = [];
public expenseTrendData: any[] = [];

loadStates() {

  this.budgetService
    .getStates(Number(this.tenantId))
    .subscribe((res: any[]) => {

      this.states = [
        'All States',
        ...res.map(x => x.StateName)
      ];

    });

}

loadBranchDropdown() {

  this.budgetService
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

  this.budgetService
    .getBudgetSummary(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any) => {

      this.kpis = [

        {
          title: "Total Income " + this.selectedSession,
          value: "₹" + this.formatCr(res.total_income) + " Cr",
          trend: res.income_trend,
          color: "green",
          icon: "₹",
          progress: res.income_progress
        },

        {
          title: "Total Expense " + this.selectedSession,
          value: "₹" + this.formatCr(res.total_expense) + " Cr",
          trend: res.expense_trend,
          color: "blue",
          icon: "🛒",
          progress: res.expense_progress
        },

        {
          title: "Net Surplus " + this.selectedSession,
          value: "₹" + this.formatCr(res.net_surplus) + " Cr",
          trend: res.surplus_trend,
          color: "green",
          icon: "↗",
          progress: res.surplus_progress
        },

        {
          title: "Budget Utilization",
          value:
            Number(res.budget_utilization || 0)
              .toFixed(1) + "%",
          trend: res.utilization_trend,
          color: "orange",
          icon: "⏱",
          progress: res.utilization_progress
        }

      ];

    });

}

loadMonthlyTrend() {

  this.budgetService
    .getMonthlyTrend(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      console.log('Monthly Trend API:', res);

      const months = [
        '',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar'
      ];

      this.monthlyLabels =
        res.map(x => months[Number(x.MonthNo)]);

      if (this.compareMode) {

        this.incomeExpenseData = [

          {
            label: 'Income 2026-27',
            data: res.map(x => Number(x.income2026 || 0)),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.15)',
            fill: false
          },

          {
            label: 'Expense 2026-27',
            data: res.map(x => Number(x.expense2026 || 0)),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.15)',
            fill: false
          },

          {
            label: 'Income 2025-26',
            data: res.map(x => Number(x.income2025 || 0)),
            borderDash: [5, 5],
            fill: false
          },

          {
            label: 'Expense 2025-26',
            data: res.map(x => Number(x.expense2025 || 0)),
            borderDash: [5, 5],
            fill: false
          }

        ];

      } else {

        if (this.selectedSession === '2026-27') {

          this.incomeExpenseData = [

            {
              label: 'Income',
              data: res.map(x => Number(x.income2026 || 0)),
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22,163,74,0.15)',
              fill: false
            },

            {
              label: 'Expense',
              data: res.map(x => Number(x.expense2026 || 0)),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.15)',
              fill: false
            }

          ];

        } else {

          this.incomeExpenseData = [

            {
              label: 'Income',
              data: res.map(x => Number(x.income2025 || 0)),
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22,163,74,0.15)',
              fill: false
            },

            {
              label: 'Expense',
              data: res.map(x => Number(x.expense2025 || 0)),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37,99,235,0.15)',
              fill: false
            }

          ];

        }

      }

      this.monthlyLabels = [...this.monthlyLabels];
      this.incomeExpenseData = [...this.incomeExpenseData];

      console.log('Labels:', this.monthlyLabels);
      console.log('Datasets:', this.incomeExpenseData);

    });

}

loadIncomeBreakdown() {

  this.budgetService
    .getIncomeBreakdown(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      this.incomeLabels =
        res.map(
          x => `${x.name} ${x.percentage}%`
        );

      this.incomeData =
        res.map(
          x => Number(x.value)
        );

    });

}

loadExpenseBreakdown() {

  this.budgetService
    .getExpenseBreakdown(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      const total = res.reduce(
        (sum, item) =>
          sum + Number(item.value),
        0
      );

      const labels = res.map(
        item =>
          `${item.name} ${(
            Number(item.value) /
            total * 100
          ).toFixed(0)}%`
      );

      const data = res.map(
        item => Number(item.value)
      );

      this.expenseLabels = labels;
      this.expenseData = data;

    });

}

loadExpenseTrend() {

  this.budgetService
    .getExpenseTrend(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      console.log('Expense Trend API', res);

      this.expenseTrendLabels =
        res.map(x => x.MonthName);

      if (this.compareMode) {

        this.expenseTrendData = [

          {
            label: 'Salaries 2025-26',
            data: res.map(
              x => Number(x.salaries_2025 || 0)
            ),
            backgroundColor: '#276fd1',
            stack: '2025'
          },

          {
            label: 'Infrastructure 2025-26',
            data: res.map(
              x => Number(x.infra_2025 || 0)
            ),
            backgroundColor: '#de7b00',
            stack: '2025'
          },

          {
            label: 'Operations 2025-26',
            data: res.map(
              x => Number(x.operations_2025 || 0)
            ),
            backgroundColor: '#7c3aed',
            stack: '2025'
          },

          {
            label: 'Technology 2025-26',
            data: res.map(
              x => Number(x.tech_2025 || 0)
            ),
            backgroundColor: '#18a36f',
            stack: '2025'
          },

          {
            label: 'Other 2025-26',
            data: res.map(
              x => Number(x.other_2025 || 0)
            ),
            backgroundColor: '#dc2626',
            stack: '2025'
          },

          {
            label: 'Salaries 2026-27',
            data: res.map(
              x => Number(x.salaries_2026 || 0)
            ),
            backgroundColor: '#5b8ff9',
            stack: '2026'
          },

          {
            label: 'Infrastructure 2026-27',
            data: res.map(
              x => Number(x.infra_2026 || 0)
            ),
            backgroundColor: '#f59e0b',
            stack: '2026'
          },

          {
            label: 'Operations 2026-27',
            data: res.map(
              x => Number(x.operations_2026 || 0)
            ),
            backgroundColor: '#8b5cf6',
            stack: '2026'
          },

          {
            label: 'Technology 2026-27',
            data: res.map(
              x => Number(x.tech_2026 || 0)
            ),
            backgroundColor: '#10b981',
            stack: '2026'
          },

          {
            label: 'Other 2026-27',
            data: res.map(
              x => Number(x.other_2026 || 0)
            ),
            backgroundColor: '#ef4444',
            stack: '2026'
          }

        ];

      }
      else {

        const year =
          this.selectedSession === '2026-27'
            ? '2026'
            : '2025';

        this.expenseTrendData = [

          {
            label: 'Salaries',
            data: res.map(
              x => Number(x['salaries_' + year] || 0)
            ),
            backgroundColor: '#276fd1'
          },

          {
            label: 'Infrastructure',
            data: res.map(
              x => Number(x['infra_' + year] || 0)
            ),
            backgroundColor: '#de7b00'
          },

          {
            label: 'Operations',
            data: res.map(
              x => Number(x['operations_' + year] || 0)
            ),
            backgroundColor: '#7c3aed'
          },

          {
            label: 'Technology',
            data: res.map(
              x => Number(x['tech_' + year] || 0)
            ),
            backgroundColor: '#18a36f'
          },

          {
            label: 'Other',
            data: res.map(
              x => Number(x['other_' + year] || 0)
            ),
            backgroundColor: '#dc2626'
          }

        ];

      }

      this.expenseTrendLabels = [
        ...this.expenseTrendLabels
      ];

      this.expenseTrendData = [
        ...this.expenseTrendData
      ];

      console.log(
        'Expense Labels:',
        this.expenseTrendLabels
      );

      console.log(
        'Expense Datasets:',
        this.expenseTrendData
      );

    });

}

loadBudgetDetails() {

  this.budgetService
    .getBudgetHeadwise(
      this.selectedSession,
      this.selectedState,
      this.selectedBranch,
      Number(this.tenantId)
    )
    .subscribe({

      next: (res: any[]) => {

        console.log(
          'Budget Headwise API',
          res
        );

        this.budgetRows = res.map(row => {

          const used =
            Number(row.used_percent || 0);

          let status = '';
          let statusClass = '';
          let barClass = '';

          if (used >= 100) {

            status = 'Over Budget';
            statusClass = 'status-danger';
            barClass = 'danger';

          }
          else if (used >= 90) {

            status = 'On Watch';
            statusClass = 'status-warning';
            barClass = 'warning';

          }
          else {

            status = 'On Track';
            statusClass = 'status-success';
            barClass = 'success';

          }

          return {

            head: row.HeadName,

            budget:
              '₹' +
              Number(row.budget || 0)
                .toFixed(2) +
              ' Cr',

            actual:
              '₹' +
              Number(row.actual || 0)
                .toFixed(2) +
              ' Cr',

            variance:
              Number(row.variance || 0) < 0
                ? '-₹' +
                  Math.abs(
                    Number(row.variance || 0)
                  ).toFixed(2) +
                  ' Cr'
                : '₹' +
                  Number(row.variance || 0)
                    .toFixed(2) +
                  ' Cr',

            used,

            status,

            statusClass,

            barClass

          };

        });

        console.log(
          'Budget Rows:',
          this.budgetRows
        );

      },

      error: (err) => {

        console.error(
          'Budget Headwise Error:',
          err
        );

      }

    });

}


  budgetRows: any[] = [];
  formatCr(value: any): string {
  const amount = Number(value || 0);

  return (amount / 10000000).toFixed(1);
}


  incomeColors = [
    {
      backgroundColor: [
        "#18a36f",
        "#276fd1",
        "#de7b00",
        "#7c3aed",
        "#e52424",
        "#6b7280",
      ],
    },
  ];


  expenseColors = [
    {
      backgroundColor: [
        "#276fd1",
        "#de7b00",
        "#7c3aed",
        "#18a36f",
        "#e52424",
        "#6b7280",
        "#0891b2",
        "#ca8a04",
      ],
    },
  ];


  lineOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            fontSize: 10,
          },
        },
      ],
    },
  };

  doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: {
      position: "top",
    },
  };

  stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top",
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            fontSize: 9,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };
expenseTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
      stacked: true
    }],
    yAxes: [{
      stacked: true
    }]
  },
  legend: {
    position: 'top'
  }
};
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

    /* MONTHLY INCOME EXPENSE */
this.monthlyLabels.forEach((month, i) => {

  exportData.push({

    Section: 'Income vs Expense',

    Item: month,

    Income:
      this.incomeExpenseData[0]
        ? this.incomeExpenseData[0].data[i]
        : 0,

    Expense:
      this.incomeExpenseData[1]
        ? this.incomeExpenseData[1].data[i]
        : 0

  });

  if (this.compareMode) {

    exportData.push({

      Section: 'Income vs Expense Compare',

      Item: month,

      Income:
        this.incomeExpenseData[2]
          ? this.incomeExpenseData[2].data[i]
          : 0,

      Expense:
        this.incomeExpenseData[3]
          ? this.incomeExpenseData[3].data[i]
          : 0

    });

  }

});

    /* INCOME BREAKDOWN */

    this.incomeLabels.forEach((item, i) => {
      exportData.push({
        Section: "Income Breakdown",
        Item: item,
        Current: this.incomeData[i] + "%",
        Previous: "",
        Remarks: ""
      });
    });

    /* EXPENSE BREAKDOWN */

    this.expenseLabels.forEach((item, i) => {
      exportData.push({
        Section: "Expense Breakdown",
        Item: item,
        Current: this.expenseData[i] + "%",
        Previous: "",
        Remarks: ""
      });
    });

    /* EXPENSE TREND */

    this.expenseTrendLabels.forEach((month, i) => {

      exportData.push({
        Section: "Expense Trend",
        Item: month,
        Salaries: this.expenseTrendData[0].data[i],
        Infrastructure: this.expenseTrendData[1].data[i],
        Operations: this.expenseTrendData[2].data[i],
        Technology: this.expenseTrendData[3].data[i],
        Other: this.expenseTrendData[4].data[i]
      });

    });

    /* BUDGET TABLE */

    this.budgetRows.forEach(row => {
      exportData.push({
        Section: "Budget Detail",
        Head: row.head,
        Budget: row.budget,
        Actual: row.actual,
        Variance: row.variance,
        Used: row.used + "%",
        Status: row.status
      });
    });

    return exportData;
  }
}
