
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { dmsstatus } from '../../sd-services/dmsstatus';
import { FileDataSource } from './myFilesDatasource';
import { DatePipe } from '@angular/common';
import { backendService } from 'app/services/backend/backend.service';
import { backend } from 'app/sd-services/backend';
import { MatDialog } from '@angular/material';
import { dilogueComponent } from '../dilogueComponent/dilogue.component';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';

@Component({
    selector: 'bh-approvalstatus',
    templateUrl: './approvalstatus.template.html',
    styleUrls: ['./approvalstatus.component.scss']
})

export class approvalstatusComponent implements OnInit {
    @ViewChild(CdkVirtualScrollViewport, { static: true }) vs: CdkVirtualScrollViewport;
    selectedIndex = 0;
    pageSize = 10;
    isFocused = false;
    searchPubSub;
    filterObj;
    currentTab = "approved";
    constructor(public dmStatus: dmsstatus,
        private datePipe: DatePipe,
        private scrollDispatcher: ScrollDispatcher,
        private backendService: backendService,
        private backend: backend,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        public pubSubService: NPubSubService,
        private snackBar: NSnackbarService,
        private nLocalStorage: NLocalStorageService) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }
    Filearray;
    encodedObj;

    ngOnInit() {
        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.encodedObj = btoa(encodeURIComponent(JSON.stringify(res)))
            this.searchFiles(this.encodedObj);
        })
        let filter = this.route.snapshot.queryParamMap.get('filter');
        
        if (filter) {
            filter = JSON.parse(decodeURIComponent(atob(filter)));
            this.filterObj = JSON.parse(decodeURIComponent(atob(filter)));
            this.Filearray = new FileDataSource(this.dmStatus, this.pageSize, this.currentTab, this.filterObj, this.snackBar);
        } else {
            let currentTab = this.route.snapshot.queryParamMap.get('currentTab') || 'approved';
            this.handleCurrentTab(currentTab);
        }

    }


    handleCurrentTab(currentTab) {
        if (currentTab == 'approved')
            this.tabChange({ index: 0 });
        else if (currentTab == 'awaiting')
            this.tabChange({ index: 1 });
        else
            this.tabChange({ index: 2 });
    }
    ngAfterViewInit(): void {
        /**
         *  constructor is called to update the array with new data.
         */
        this.scrollDispatcher.scrolled().subscribe((event: any) => {
            if (this.Filearray.limitReached)
                return;
            this.Filearray.update();
        });
    }

    searchFiles(filterObj) {
      
        let encodedFilter = btoa(encodeURIComponent(JSON.stringify(filterObj)));
        this.router.navigate(['/home/status'], { queryParams: { filter: encodedFilter } });
        // this.Filearray._getData(filterObj, true);
        this.filterObj = JSON.parse(decodeURIComponent(atob(filterObj)));
        this.Filearray = new FileDataSource(this.dmStatus, this.pageSize, this.currentTab, this.filterObj, this.snackBar);
    }

    redirectToEditUploadFile(fsData, currentTab?) {
        let filterObj = { "uuid": fsData.uuid };
        let businessDept = fsData.businessDepartment;
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "awaiting") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false    
            }
            else {
                let encodedUUId = btoa(encodeURIComponent(JSON.stringify(fsData['uuid'])));
                this.nLocalStorage.setValue('id', encodedUUId);
                this.router.navigate([`home/documents/editfile`], { queryParams: { id: encodedUUId, currentID: 'uuid', action: 'reset',businessDept: businessDept, currentTab: currentTab || 'approved' } });
            }
        });
    }


    /**
     * method called to send Date time in the following format: `dd-MM-yyyy   HH:mm`
     * @param file mongo file documents
     */
    computeDate(file) {
        let date;
        let lastObject = this._findLastApprover(file);
        if (lastObject['lastModified'])
            date = lastObject['lastModified'];
        else
            return this.datePipe.transform(file['timestamp'], 'MMM d, y, h:mm:ss a');
        return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
    }
    /**
     * method called to find the last approver or rejecter.
     * @param file mongo file object
     */
    _findLastApprover(file) {
        if (!file)
            return false;
        if (file.approvalLvl2Check)
            return file.approvalLevels[1];
        //Have to remove the undefined check after approvalLvl1Check is added in the dmsFs object.
        else if (file.approvalLvl1Check == undefined || file.approvalLvl1Check)
            return file.approvalLevels[0];
        else if (!file.approvalLvl1Check && file.approvalStatus == 'approved')
            return file.uploadedBy;
        else
            return false;
    }


    computeApprover(file) {
        let lastObject = this._findLastApprover(file);
        if (lastObject) {
            return lastObject['displayName'] || "";
        } else
            return "";
    }

    //rejected tab
    lastapprovalRejectName(file) {

        let lastobj = this.lastrejected(file)

        if (lastobj) {
            return lastobj['displayName'] || "";
        } else
            return "";
    }
    lastapprovalRejectDate(file) {
        let date;
        let lastobj = this.lastrejected(file)
        if (lastobj || (lastobj && lastobj['lastModified']))
            date = lastobj['lastModified'];
        else
            return "";
        return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
    }

    lastrejected(file) {
        return file.approvalLevels.find(el => el.approvalStatus == 'rejected')
    }

    clearsearch() {
        this.pubSubService.$pub('clearsearach', '')
    }
    /**
     * method used to change the data that is shown on the list.
     * @param event 
     */
    tabChange(event) {
        this.selectedIndex = event.index;
        switch (this.selectedIndex) {
            case 0:
                this.Filearray = new FileDataSource(this.dmStatus, this.pageSize, 'approved', this.filterObj, this.snackBar);
                this.clearsearch();
                this.currentTab = 'approved';
                break;
            case 1:
                this.Filearray = new FileDataSource(this.dmStatus, this.pageSize, 'awaiting', this.filterObj, this.snackBar);
                this.clearsearch();
                this.currentTab = 'awaiting';
                break;
            case 2:                
                this.Filearray = new FileDataSource(this.dmStatus, this.pageSize, 'rejected', this.filterObj, this.snackBar);
                this.clearsearch();
                this.currentTab = 'rejected';
                break;
        }

    } 

    /**
     * Creates an downloadable link of the file.
     * @param filePath :FileName or FilePath url
     * @param fileName the name of the file that is downloaded
     * @param fsuuid  
     */
    downloadFile(filePath, fileName, fsuuid, clientContainerName, uuid?,currentTab?) {
        let filterObj = { "uuid": uuid };
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "awaiting") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false
            }
            else {
                this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
            }
        });
        
    }

    deleteFS(item, currentTab?) {
        let filterObj = { "uuid": item.uuid };
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "awaiting") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false
            }
            else {
                let parentId = item['objectPath'][item['objectPath'].length - 1];
                let deleteObj = {
                    uuid: item['uuid'],
                    parentId: parentId,
                    fsuuid: item.fsuuid,
                    type: 'File',
                    container: item['clientContainerName'],
                    name: item['fileName']
                }

                this.dialog.open(deletegroupComponent, {
                    width: '32%',
                    data: {
                        msg: 'Are you sure you want to delete this request and document permanently ?',
                        positiveButton: 'Yes',
                        negativebuuton: 'No'
                    },
                    autoFocus: false,
                    restoreFocus: false,
                    disableClose: true
                }).afterClosed().subscribe(res => {
                    if (res['status']) {
                        this.backend.deleteFs(deleteObj).then(res => {
                            this.tabChange({ index: this.selectedIndex });
                        });
                    }
                });
            }
        });


    }

    triggerPopup(popupText) {
        this.dialog.open(dilogueComponent, {
            width: '32%',
            panelClass: 'custom-dialog-container',
            data: { rejected_reason: popupText },
            autoFocus: false,
            disableClose: true
        })
    }

    ngOnDestroy() {
        this.searchPubSub.unsubscribe();
    }
}