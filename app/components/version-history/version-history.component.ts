import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { backend } from 'app/sd-services/backend';
import { dmsconfiguration } from 'app/sd-services/dmsconfiguration';
import { dmsusers } from 'app/sd-services/dmsusers';
import { backendService } from 'app/services/backend/backend.service';
import { genericService } from 'app/services/generic/generic.service';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { dilogueComponent } from '../dilogueComponent/dilogue.component';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { NSnackbarService } from 'neutrinos-seed-services';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.scss']
})
export class VersionHistoryComponent implements OnInit {
  [x: string]: any;
  @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;
  isAllSelected: boolean;
  isSelected: boolean;
  totalCount = 0;
  expiryDate = 30;
  page_Index = 1;
  pageSize = 10;
  isEndList: boolean = false;
  tempTableDta = [];
  tableRowIndex = -1;
  paginationIndex = 1;
  expiryFilter;
  displayedColumns = ['name', 'owner', 'version', 'creationDate', 'expiryDate', 'action'];
  metadata = [];
  filedetails;
  selectedRowIndex:any;
  isClicked: boolean = false;

  fsuuid;
  dataSource = new MatTableDataSource();
  searchPubSub: any;
  DocumentView: any;
  viewFile: boolean = false; // hidden by default
  currentDoc: any;
  showRestore:boolean = true;


  constructor(
    private backend: backend,
    private genericService: genericService,
    private router: Router,
    private dmsconfiguration: dmsconfiguration,
    private activatedRoute: ActivatedRoute,
    private userService: dmsusers,
    private backendService: backendService,
    private dialog: MatDialog,
    private snackBar: NSnackbarService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['fsuuid']) {
        this.fsuuid = params['fsuuid'];
        this._getHistoryData(this.fsuuid);

      }
    });

  }
  _getHistoryData(fsuuid) {
    let filterObj = {
      "fsuuid": fsuuid,
      "type": 'File',
      "trash": false,
      "approvalStatus": "approved",
      "hidden": { "$exists": false }
    };
    let sortObj = { 'timestamp': 1 };
    this.userService.getVersionHistory(1, sortObj, filterObj).then(res => {
      let versionData = res.local.res;
      console.log("version data",versionData.length);
      if(versionData.length <=1)
       this.showRestore = false;
      

      if (versionData && versionData.length > 0) {
        let data = res.local.res;
        data.map(el => el['fsuuid'] = fsuuid);
        this._setDataSource(data);
        this.tempTableDta = data;
      }

    })
  }


  _setDataSource(tableData) {
    this.dataSource = new MatTableDataSource(tableData);
  }
  /**
       * Creates an downloadable link of the file.
       * @param filePath :FileName or FilePath url
       */
  downloadFile(filePath, fileName, fsuuid, clientContainerName) {
    this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
  }


  //restore function
  _restore(version) {
    let currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    let payload = {
      fsuuid: this.fsuuid,
      version,
      latest: true,
      updatedByName: currentUserInfo.displayName,
      updatedByEmail: currentUserInfo.username
    }

    this.dialog.open(deletegroupComponent, {
      width: '32%',
      data: {
        msg: 'Are you sure you want to replace current version of the document with the selected document ?',
        positiveButton: 'Yes',
        negativebuuton: 'No'
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (res['status']) {
        this._restoreReasonDialog(payload);
      }
    });

  }

  _restoreReasonDialog(payload) {
    this.dialog.open(dilogueComponent, {
      width: '22em',
      panelClass: 'custom-dialog-container',
      data: { msg: 'restore', loader: false },
      autoFocus: false,
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (res['status']) {
        payload['restoreReason'] = res['reason'];
        this.backendService.restoreDocVersion(payload).subscribe(res => {
          this.dialog.open(DeletePopupComponent, {
            panelClass: "deletePopupDialog",
            data: { msg: 'restore' }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['home/documents'])
          })
        })
      }
    });
  }


  onRowClick(ele, i,row) {
    
    let newEle = ele;
    newEle.uuid = newEle.fsuuid.replace('FL_', '');
    this.docsChildDetails._getFSObject(newEle);
    
  }

  view(data) {
    let extension, extensions;
    extension = data.fileName.split('.')[1];
    extensions = ["jpg", "png", "jpeg", "pdf"];

    if (extensions.indexOf(extension) != -1) {
      this.viewFile = true;
      this.DocumentView = `${this.backendService.modelerUrl}modelr/api/getFile?fileName=${data.fileName}&clientContainerName=${data.clientContainerName}&view=true`;
      this.currentDoc = data;
      this.currentDoc['extension'] = extension;
    }
    else {
      this.snackBar.openSnackBar('Preview not support');
    }

  }

  closeView() {
    this.viewFile = false; //
  }

  // onArrowLeft() {
  //   this.page_Index = this.page_Index - 1;
  //   this._getTableData(this.page_Index, this.pageSize);
  // }

  // onArrowRight() {
  //   this.page_Index = this.page_Index + 1;
  //   this._getTableData(this.page_Index, this.pageSize);
  // }

}
