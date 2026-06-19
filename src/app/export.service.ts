import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToExcel(fileName: string, data: any[]) {

    if (!data || !data.length) {
      return;
    }

    const allKeys: string[] = [];

    data.forEach((row: any) => {

      Object.keys(row).forEach((key: string) => {

        if (!allKeys.includes(key)) {
          allKeys.push(key);
        }

      });

    });

    const normalizedData = data.map((row: any) => {

      const newRow: any = {};

      allKeys.forEach((key: string) => {
        newRow[key] = row[key] !== undefined ? row[key] : '';
      });

      return newRow;

    });

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(normalizedData);

    const workbook: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Dashboard'
    );

    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );
  }
}
