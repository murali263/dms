import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { reports } from 'app/sd-services/reports';

@Component({
  selector: 'app-reports-by-action',
  templateUrl: './reports-by-action.component.html',
  styleUrls: ['./reports-by-action.component.scss']
})
export class ReportsByActionComponent implements OnInit {

  chartDuration = -30;
  filterArray = [
    { description: 'Last 30 Days', value: -30 },
    { description: 'Last 60 Days', value: -60 },
    { description: 'Last 90 Days', value: -90 }
  ];
  enableChart: boolean = false;
  result = [];
  view: any[] = [500, 300];
  maxXAxisTickLength = 12;
  colorScheme = {
    domain: ['#4DCFE0', ' #2D9CDB', '#F6A609', '#EB5757', '#4F4F4F']
  };

  constructor(
    private reportsService: reports,
    private router: Router
  ) { }

  ngOnInit() {
    this.getChartFilteredData(-30);
  }

  /**
     * method returns current date with time as 00:00:00
     */
  _setDate() {
    let date = new Date();
    date.setHours(23, 59)
    return date;
  }

  /**
     * Returns the updated date as timestamp
     * @param value : number to be add or deduct from current date
     */
  _updatedDate(value) {
    let date = this._setDate();
    return date.setDate(date.getDate() + (value));
  }

  _getChartData(chartval) {
    this.enableChart = false;
    let lowerBound = this._updatedDate(chartval);
    this.reportsService.reportsCharts(lowerBound, this._updatedDate(-1)).then(res => {
      this.result = res.local.res.filter(el => el.value !== 0);
      this.enableChart = true;
    });
  }

  getChartFilteredData(key) {
    console.log(key)
    this._getChartData(Number(key));
  }

  onReportsByExpiry(){
    this.router.navigate(['/home/reports-by-expiry'])
  }

}
