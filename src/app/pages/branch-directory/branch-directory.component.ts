import { Component, OnInit } from "@angular/core";
import { PageDataService } from "src/app/page-data.service";
import { HttpClient } from "@angular/common/http";
import { BranchService } from '../../services/branch.service';

@Component({
  selector: "app-branch-directory",
  templateUrl: "./branch-directory.component.html",
  styleUrls: ["./branch-directory.component.css"]
})
export class BranchDirectoryComponent implements OnInit {
constructor(
  private pageDataService: PageDataService,
  private http: HttpClient,
  private branchService: BranchService,

) {}
branches: any[] = [];
        tenantId =
localStorage.getItem('tenantId') || '1';
  ngOnInit() {

  this.loadBranches();

    this.pageDataService.setPageData(
      "branch-directory-dashboard",
      this.prepareExportData()
    );
  }
  loadBranches() {

  this.branchService
    .getBranchDirectory(
      Number(this.tenantId)
    )
    .subscribe((res: any[]) => {

      console.log(
        'Branch Directory API',
        res
      );

      this.branches =
        res.map(x => ({

          branch:
            x.branch_name,

          state:
            x.state_name,

          students:
            Number(x.students),

          fee2027:
            Number(x.fee_2027),

          fee2026:
            Number(x.fee_2026),

          pass:
            Number(x.pass_rate),

          attendance:
            Number(x.attendance_rate),

          status:
            x.status,

          statusClass:
            x.status_class

        }));

      this.pageDataService
        .setPageData(
          'branch-directory-dashboard',
          this.prepareExportData()
        );

    });

}

searchText = "";

get filteredBranches() {

  const search = this.searchText.toLowerCase().trim();

  if (!search) {
    return this.branches;
  }

  return this.branches.filter(branch =>

    branch.branch.toLowerCase().includes(search) ||

    branch.state.toLowerCase().includes(search) ||

    branch.status.toLowerCase().includes(search) ||

    branch.students.toString().includes(search) ||

    branch.fee2027.toString().includes(search) ||

    branch.fee2026.toString().includes(search) ||

    branch.pass.toString().includes(search) ||

    branch.attendance.toString().includes(search)

  );

}
prepareExportData() {

  const exportData: any[] = [];

  this.branches.forEach(branch => {

    exportData.push({
      Section: "Branch Directory",
      Branch: branch.branch,
      State: branch.state,
      Students: branch.students,
      FeeCollection2027: branch.fee2027 + "%",
      FeeCollection2026: branch.fee2026 + "%",
      PassRate: branch.pass + "%",
      Attendance: branch.attendance + "%",
      Status: branch.status
    });

  });

  return exportData;
}
}