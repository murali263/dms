import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { dilogueComponent } from '../dilogueComponent/dilogue.component';
import { approvalsection } from '../../sd-services/approvalsection';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { backendService } from '../../services/backend/backend.service';
import { backend } from '../../sd-services/backend';
import { genericService } from '../../services/generic/generic.service';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material';
import { MatDialog } from '@angular/material';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';
import { dmsstatus } from '../../sd-services/dmsstatus';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NSystemService, NSessionStorageService } from 'neutrinos-seed-services';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
export interface PeriodicElement {
    _id: string;
}

export interface inneritem {
    id: number;
    name: string;
}

@Component({
    selector: 'app-awaitingnewapproval',
    templateUrl: './awaitingnewapproval.component.html',
    styleUrls: ['./awaitingnewapproval.component.scss']
})
export class AwaitingnewapprovalComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('dialogDetails', { static: true }) dialogDetails: dilogueComponent;
    @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;
    displayedColumns: string[] = ['select', 'name', 'owner', 'timestamp', 'dateofsubmit', 'edit', 'action'];
    displayedColumnsothers: string[] = ['name', 'owner', 'timestamp', 'dateofsubmit', 'edit', 'action'];
    @ViewChild(MatMenuTrigger, { static: true })
    contextMenu: MatMenuTrigger;
    contextMenuPosition = { x: '0px', y: '0px' };
    selection = new SelectionModel<PeriodicElement>(true, []);
    dataSource = new MatTableDataSource<PeriodicElement>();
    showDocument = false;
    dataSourceothers: any;
    pageMetadata;
    sortData: any = { 'timestamp': -1 };
    rejectionReason;
    approvalReason;
    filedetails;
    filedetailsothers;
    currentFileIndex = 0;
    cuurentFile = false;
    currentDocView;
    private sysServiceObj = NSystemService.getInstance();
    modelerUrl: string;
    DownloadCurrCount = 0;
    currentDoc;
    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 10;          //  Pagination size
    pager = [];             //  Array of paginator
    currntPageNum = 1;      //  Current page number
    tableData = [];         //  Table Data
    tableData1 = [];         //  Table Data
    totalCount;             //  Total Data Count
    paginationIndex = 1;    // pager next slot
    currentTab = 0;
    searchPubSub;
    pageNumber = 1;
    searchFilter;
    isFocused;
    selectedTabIndex: number;
    metadata;
    auditList = [];
    showloadmore: boolean;
    auditPagenumber: number;
    isShownDetails: boolean = false; // hidden by default
    mainapproval: boolean = true; // hidden by default
    isShownRightArrow: boolean = true; // hidden by default
    isShownRightArrowothers: boolean = true; // hidden by default
    checkedObj;
    awaitinglist;
    showPreview = false;
    supported_extensions: string[] = ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png','pdf'];

    constructor(public dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        public dmStatus: dmsstatus,
        private approvalService: approvalsection,
        private backend: backend,
        private backendService: backendService,
        private genericService: genericService,
        public pubSubService: NPubSubService,
        private router: Router,
        private snackBar: NSnackbarService,
        private nLocalStorage: NLocalStorageService,
        public route: ActivatedRoute,
        private dmsconfiguration: dmsconfiguration) {
        this.modelerUrl = this.sysServiceObj.getVal('modelrUrl');

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }


    }

    ngOnInit() {
        this.selectedTabIndex = 0;
        this.showloadmore = false;

        this.auditPagenumber = 1;
        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.searchFilter = btoa(JSON.stringify(res))
            this.searchFiles(this.pageNumber, this.pageSize, this.searchFilter);
        });
        let filter = this.route.snapshot.queryParamMap.get('filter');
        if (filter) {
            this.searchFilter = JSON.parse(atob(filter));
            this.triggerSearch(this.pageNumber, this.pageSize, this.searchFilter);

        } else {
            this.backend.curentSession().then(res => {
                //console.log(res)
                this.backendService.currentUserObj = res['local']['res']['userInfo']
                this._getTableData(this.page_Index, this.pageSize);
            });
        }
        this.isShownDetails = false;

    }

    tabChange(event, pageSize = 10) {
        // on tab change
        this.selectedTabIndex = event.index;
        //console.log(pageSize)
        if (this.selectedTabIndex === 0) {
            //console.log(pageSize)
            this._getTableData();
            this.selection.clear();

        } else if (this.selectedTabIndex === 1) {
            this._getTableDataothers();
            this.selection.clear();
        }

    }

    rowdata(rowdata) {
        this.docsChildDetails.rowdata(rowdata);
    }

    rowdataothers(rowdata) {
        this.docsChildDetails.rowdataothers(rowdata);
    }

    NoDetail(event) {
        this.docsChildDetails.rowdata(event);
    }

    NoDetailothers(event) {
        this.docsChildDetails.rowdataothers(event);
    }

     /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

    assignCheckedIndex(checkedStatus, index, element) {
        if (checkedStatus)
            this.checkedObj = this.awaitinglist[index];
        else
            this.checkedObj = null;

        //console.log(this.checkedObj)
    }

    _getTableData(pageNumber?, pageSize?, filterValue?) {
        pageSize = 10;
        let filter = { "hidden": { "$exists": false } }
        this.approvalService.getApprovalListList(pageNumber, pageSize, this.sortData, filter, 'awaiting').then(res => {
            //console.log(res)
            let result = res.local.res;
            //console.log(result.data.length)
            if (result.data.length > 0) {
                this.awaitinglist = result['data'];
                this._setDataSource(result['data']);
                this.totalCount = result['count'];
            }
            else {
                //console.log("del rec")
                this._setDataSource(result['data']);
                this.snackBar.openSnackBar('No Result Found');
            }
            //console.log(pageNumber,result.data.length,result.count)
            if (((pageNumber - 1) * 10) + result.data.length >= result.count) {
                //console.log("sdsd")
                this.isShownRightArrow = false
            }
            else {
                this.isShownRightArrow = true
            }

            if (this.page_Index == 1)
                this.setPagination(this.page_Index);
        });
    }

    _getTableDataothers(pageNumber = 1, size?, filterValue?) {
        size = this.pageSize;
        status = 'awaiting';
        this.pageNumber = pageNumber;
        let filter = { "hidden": { "$exists": false } };
        this.dmStatus.getMyFiles(size, status, pageNumber, filter, this.sortData).then(res => {
            //console.log(res)
            let result1 = res.local.files['fileList'];
            //console.log(result1)
            //console.log("abcd",pageNumber,result1.length,result1.length)
            if (result1.length < this.pageSize) {
                //console.log("sdsd")
                this.isShownRightArrowothers = false
            }
            else {
                this.isShownRightArrowothers = true
            }
            if (result1.length > 0) {
                this._setDataSourceothers(result1);
                this.totalCount = result1['count'];
            }
            else
                this.snackBar.openSnackBar('No Result Found');



            if (this.page_Index == 1)
                this.setPagination(this.page_Index);
        });
    }


    redirectToEditUploadFile(element, currentTab?) {
        //console.log("hi",element);
        let id = element.data.uuid
        let businessDept = element.data.businessDepartment;
        //console.log(id)
        //console.log(currentTab)
        let filterObj = { "uuid": id };
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            //console.log(res)
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "approval") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false
            }
            else {
                let encodedUUId = btoa(encodeURIComponent(JSON.stringify(id)));
                this.nLocalStorage.setValue('id', encodedUUId);
                this.router.navigate([`home/documents/editfile`], { queryParams: { id: encodedUUId, currentID: 'uuid', action: 'reset',businessDept: businessDept, currentTab: currentTab || 'approval' } });
            }
        });
    }

    redirectToEditUploadFileothers(element, currentTab?) {
        //console.log("hi",element);
        let id = element.uuid
        let businessDept;
        //console.log(id)
        //console.log(currentTab)
        let filterObj = { "uuid": id };
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            //console.log(res)
            let businessDept = res.local.res[0].businessDepartment;
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "awaiting") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false
            }
            else {
                let encodedUUId = btoa(encodeURIComponent(JSON.stringify(id)));
                this.nLocalStorage.setValue('id', encodedUUId);
                this.router.navigate([`home/documents/editfile`], { queryParams: { id: encodedUUId, currentID: 'uuid', action: 'reset',businessDept: businessDept, currentTab: currentTab || 'awaiting' } });
            }
        });
    }






    searchFiles(pageNumber?, pageSize?, filterObj?) {
        let encodedFilter = btoa(JSON.stringify(filterObj));
        this.router.navigate(['/home/status/approval'], { queryParams: { filter: encodedFilter } });
        this.triggerSearch(pageNumber, pageSize, filterObj);
    }

    triggerSearch(pageNumber?, pageSize?, filterObj?) {
        this.page_Index = pageNumber;
        this.currntPageNum = pageNumber;
        let decodedFilter = JSON.parse(atob(filterObj));

        let name = decodedFilter.name;
        decodedFilter = decodedFilter.searchObj || decodedFilter;
        filterObj = {
            "data.name": name,
            "data.businessDivision": decodedFilter.businessDivision,
            "data.supplier": decodedFilter.supplier,
            "data.region": decodedFilter.region,
            "data.language": decodedFilter.language,
            "data.documentType": decodedFilter.documentType,
            "data.uploadedBy.displayName": decodedFilter.submittedBy,
            "$and": decodedFilter.$and,
            "hidden": { "$exists": false }
        };
        if (decodedFilter.meta && Object.keys(decodedFilter.meta).length)
            filterObj['data.meta'] = decodedFilter.meta;

        Object.keys(filterObj).forEach((data, i) => {
            if (!filterObj[data])
                delete filterObj[data];
        })

        this.approvalService.getApprovalListList(pageNumber, pageSize, this.sortData, filterObj, 'awaiting').then(res => {
            //console.log(res)
            this.backendService.emitChange({ closeSearch: true });
            let result = res.local.res;
            if (result['data'].length > 0) {
                this._setDataSource(result['data']);
                this.totalCount = result['count'];
                if (this.page_Index == 1)
                    this.setPagination(this.page_Index);
            } else {
                this._setDataSource(result['data']);
                this.totalCount = result['count'];
                this.snackBar.openSnackBar('No Result Found');
            }

        });
    }

    /** Method calling to assiagn datasource to table data list
     * Based on tabs
     * @param tableData table data list
     */
    _setDataSource(tableData) {
        this.dataSource = new MatTableDataSource(tableData);
        //console.log(this.dataSource)
    }

    _setDataSourceothers(tableData) {
        this.dataSourceothers = new MatTableDataSource(tableData);
        //console.log(this.dataSourceothers);
    }

    //Set Intial Pagination on UI
    /**
     * change page number on view
     * @param index page number  
     * @param totalPagesize - Total Page size of tab
     */

    setPagination(index) {
        let totalPagesize = Math.ceil(this.totalCount / this.pageSize);
        totalPagesize = Math.ceil(totalPagesize / this.pageSize);
        if (totalPagesize >= index && index > 0) {
            let obj = this.genericService.pagination(index, this.totalCount, this.pageSize);
            if (obj) {
                this.pager = obj['pager'];
                this.page_Index = obj['page_Index'];
            }
            this.paginationIndex = index;
        }
    }

    /**
     * Method for Pagination list
     * @param start - start page
     * @param pageSize - Total Page size
     */
    pageItem(start, pageSize) {
        this.currntPageNum = start;
        this.pageSize = pageSize;
        this.setPagination(this.paginationIndex);
        if (this.searchFilter != undefined) {
            this.searchFiles(start, this.pageSize, this.searchFilter)
        } else {
            this._getTableData(start, this.pageSize);
        }
    }

    ApproveDialog(element, action): void {
        this.dialog.open(dilogueComponent, {
            width: '35%',
            panelClass: 'custom-dialog-container',
            data: { 'isApprove': 'true' },
            autoFocus: false,
            disableClose: true,


        }).afterClosed().subscribe(res => {

            if (res['status']) {
                this.approvalReason = res['reason'];
                this.fsAction(element, action);
            }
            this.filedetails = null;

        });
        //console.log("app")



    }

    rejectDialog(element, action): void {
        this.dialog.open(dilogueComponent, {
            width: '32%',
            panelClass: 'custom-dialog-container',
            data: { 'isreject': 'true' },
            autoFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {

            if (res['status']) {
                this.rejectionReason = res['reason'];
                this.fsAction(element, action);
            }
            this.filedetails = null;
        });
    }


    rejectDialogmulti(): void {
        let selectedGroupsIds = this.selection.selected.map(el => { return el['data']['uuid'] });
        //console.log(selectedGroupsIds)
        if (selectedGroupsIds.length > 0) {
            this.dialog.open(dilogueComponent, {
                width: '32%',
                panelClass: 'custom-dialog-container',
                data: { 'isreject': 'true', file: selectedGroupsIds },
                autoFocus: false,
                disableClose: true
            }).afterClosed().subscribe(res => {
                //console.log("dsfsdf", res)
                if (res.cancel == true) {
                    return
                }
                this._getTableData(this.currntPageNum, this.pageSize);
                this.dialog.open(dilogueComponent, {
                    width: '32%',
                    panelClass: 'custom-dialog-container',
                    data: { 'isrejectmsg': 'true' },
                    autoFocus: false,
                    disableClose: true

                })
                this.selection.clear();
            });
        }
        else
            this.snackBar.openSnackBar('Please select item');


    }

    ApprovalDialogmulti(): void {
        let selectedGroupsIdsapprove = this.selection.selected.map(el => { return el['data']['uuid'] });
        let selectedGroupsFsuuidsApprove = this.selection.selected.map(el => { return el['data']['fsuuid'] });
        
        if (selectedGroupsIdsapprove.length > 0) {
            this.dialog.open(dilogueComponent, {
                width: '32%',
                panelClass: 'custom-dialog-container',
                data: { 'isApprove': 'true', file: selectedGroupsIdsapprove,files:selectedGroupsFsuuidsApprove },
                autoFocus: false,
                disableClose: true
            }).afterClosed().subscribe(res => {
                //console.log("dsfsdf",res)
                if (res.cancel == true) {
                    return
                }


                //this.approvalReason = res['reason'];
                this._getTableData(this.currntPageNum, this.pageSize);
                this.dialog.open(dilogueComponent, {
                    width: '32%',
                    panelClass: 'custom-dialog-container',
                    data: { 'isApprovemsg': 'true' },
                    autoFocus: false,
                    disableClose: true

                })
                this.selection.clear();

            });
        }
        else
            this.snackBar.openSnackBar('Please select item');

    }

    showawaiting() {
        this.showDocument = false;
        this.mainapproval = true;
    }

    preview(element) {
        let extension = element.data.extension.toLowerCase() || '';
        if (this.supported_extensions.includes(extension)) {
            this.mainapproval = false;
            this.showDocument = true;
            this.currentDocView = `${this.backendService.modelerUrl}modelr/api/getFile?fileName=${element.data.fileName}&clientContainerName=${element.data.clientContainerName}&view=true`;
            this.currentDoc = element.data;
        }
        else {
            this.snackBar.openSnackBar('Preview not support');
        }

    }

    previewothers(element) {
        let extension = element.extension.toLowerCase() || '';
        if (this.supported_extensions.includes(extension)) {
            this.mainapproval = false;
            this.showDocument = true;
            this.currentDocView = `${this.backendService.modelerUrl}modelr/api/getFile?fileName=${element.fileName}&clientContainerName=${element.clientContainerName}&view=true`;
            this.currentDoc = element;
        }
        else {
            this.snackBar.openSnackBar('Preview not support');
        }

    }

    fsAction(element, action) {
        let reqObj = {
            "uuid": element['uuid'],
            "version": element['version'],
            'fsuuid': element['fsuuid'],
            'submittedBy': element['uploadedBy'],
            'expiryDate': element['expiryDate'],
            'path': element['path'],
            'name': element['name']
        }
        if (action == 'A') {
            reqObj['approvalStatus'] = 'approved';
            reqObj['approvalReason'] = this.approvalReason
        }
        else {
            reqObj['approvalStatus'] = 'rejected';
            reqObj['rejectionReason'] = this.rejectionReason
        }

        this.approvalService.approvalAction(reqObj).then(res => {
            if (this.dataSource.data.length == 1) {
                this.page_Index--;
                this.currntPageNum--;
                this.dataSource.data = [];
                this.totalCount = 0;
            }
            if (this.searchFilter != undefined) {
                this.searchFiles(this.currntPageNum, this.pageSize, this.searchFilter)
            } else {
                this._getTableData(this.currntPageNum, this.pageSize);
            }
        });

    }

    //   fsActionmulti(element, action) {
    //     const data = this.dataSource
    //     console.log(data)
    //     let selectedGroupsIds = this.selection.selected.map(el => { return el['data'] });
    //     console.log(selectedGroupsIds)


    // }

    /**
  * Creates an downloadable link of the file.
  * @param filePath :FileName or FilePath url
  */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        const data = this.dataSource
        //console.log(data)
        this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    ngOnDestroy() {
        if (this.searchPubSub)
            this.searchPubSub.unsubscribe();
    }

    // cofig screen 
    loadPrevious(page, pageSize) {
        page = page - 1;
        this.pageItem(page, pageSize);
    }

    loadNext(page, pageSize) {
        //console.log(page)
        //console.log(pageSize)
        page = page + 1;
        this.pageItem(page, pageSize);
    }

    // cofig screen 
    loadPreviousothers(pageNumber, pageSize) {
        pageNumber = pageNumber - 1;
        this._getTableDataothers(pageNumber, pageSize)
    }

    loadNextothers(pageNumber, pageSize) {
        //console.log(pageNumber)
        //console.log(pageSize)
        pageNumber = pageNumber + 1;
        this._getTableDataothers(pageNumber, pageSize)
    }

    clearSelection(element){
        this.selection.clear();
        let extension = element.data.extension.toLowerCase() || '';
        if (this.supported_extensions.includes(extension)) {
            this.showPreview = true;
        }
        else{
            this.showPreview = false;
        }
    }

    
    checkextention(element){        
        let extension = element.extension.toLowerCase() || '';
        if (this.supported_extensions.includes(extension)) {
            this.showPreview = true;
        }
        else{
            this.showPreview = false;
        }

    }



}
