
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { backend } from 'app/sd-services/backend';
import { dmsconfiguration } from 'app/sd-services/dmsconfiguration';
import { genericService } from 'app/services/generic/generic.service';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';

@Component({
  selector: 'bh-reports',
  templateUrl: './reports.template.html',
  styleUrls: ['./reports.component.scss']
})

export class reportsComponent implements OnInit {

  @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;

  isSelected: boolean = false;
  totalCount = 0;
  expiryDate = 30;
  page_Index = 1;
  pageSize = 10;
  isEndList: boolean = false;
  tempTableDta = [];
  tableRowIndex = -1;
  paginationIndex = 1;
  expiryFilter;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'owner', 'expiryDate', 'uploadedBy.displayName'];
  metadata = [];
  filedetails;
  isClicked: boolean = false;
  filterArrayexpriy = [
    { description: 'Next 30 Days', value: 30 },
    { description: 'Next 60 Days', value: 60 },
    { description: 'Next 90 Days', value: 90 }
  ];

  constructor(
    private backend: backend,
    private genericService: genericService,
    private router: Router,
    private dmsconfiguration: dmsconfiguration
  ) {
    this.expiryFilter = { expiryDate: { '$gte': this._updatedDate(1), '$lte': this._updatedDate(this.expiryDate) } }
  }

  ngOnInit() {
    this.getFilterData(30)
  }

  // method returns current date with time as 00:00:00
  _setDate() {
    let date = new Date();
    date.setHours(23, 59)
    return date;
  }

  _updatedDate(value) {
    let date = this._setDate();
    return date.setDate(date.getDate() + (value));
  }

  getFilterData(key) {
    this.page_Index = 1;
    let upperBound = this._updatedDate(Number(key));
    this.expiryFilter = { expiryDate: { '$gte': this._updatedDate(1), '$lte': upperBound } }
    this._getTableData(this.page_Index, this.pageSize);
  }

  _getTableData(pageNumber?, pageSize?) {
    this.isEndList = true;
    this.page_Index = pageNumber;
    let filter = { type: "File", latest: true, approvalStatus: 'approved', trash: { '$ne': true }, "hidden": { "$exists": false }, ...this.expiryFilter }
    this.backend.getTrashList(pageNumber, pageSize, { expiryDate: 1 }, filter).then(res => {
      let result = res.local.res;
      let data = result['data'];
      data.map( el => el['selected'] = false)
      this._setDataSource(data);
      this.tempTableDta = data;
      this.totalCount = result['count'];
      if ((this.page_Index * this.pageSize) > this.totalCount) {
        this.isEndList = false;
      }
    });
  }

  _setDataSource(tableData) {
    this.dataSource = new MatTableDataSource(tableData);
  }

  onReportsByAction() {
    this.router.navigate(['/home/reports-by-action'])
  }

  onRowClick(ele,i) {
    this.tempTableDta.forEach( el => el.selected = false);
    if(this.tableRowIndex != i){
      this.tempTableDta[i].selected = true;
      this.docsChildDetails._getFSObject(ele);
      this.tableRowIndex = i;
    }else{
      this.docsChildDetails._getFSObject(null);
      this.tableRowIndex = -1;
    }
  }

  onArrowLeft() {
    this.page_Index = this.page_Index - 1;
    this._getTableData(this.page_Index, this.pageSize);
  }

  onArrowRight() {
    this.page_Index = this.page_Index + 1;
    this._getTableData(this.page_Index, this.pageSize);
  }

}
