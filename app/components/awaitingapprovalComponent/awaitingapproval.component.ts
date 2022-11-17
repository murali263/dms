
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { dilogueComponent } from '../dilogueComponent/dilogue.component';
import { approvalsection } from '../../sd-services/approvalsection';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { backendService } from '../../services/backend/backend.service';
import { backend } from '../../sd-services/backend';
import { genericService } from '../../services/generic/generic.service';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { isEmpty } from 'rxjs/operators';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';


@Component({
    selector: 'bh-awaitingapproval',
    templateUrl: './awaitingapproval.template.html',
    styleUrls: ['./awaitingapproval.component.scss']
})

export class awaitingapprovalComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    displayedColumns: string[] = ['name', 'timestamp', 'action'];

    dataSource: any;
    pageMetadata;
    sortData: any = { 'timestamp': -1 };
    rejectionReason;
    filedetails;
    currentFileIndex = 0;
    cuurentFile = false;
    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 10;          //  Pagination size
    pager = [];             //  Array of paginator
    currntPageNum = 1;      //  Current page number
    tableData = [];         //  Table Data
    totalCount;             //  Total Data Count
    paginationIndex = 1;    // pager next slot
    currentTab = 0;
    searchPubSub;
    pageNumber = 1;
    searchFilter;
    isFocused;
    metadata;
    constructor(public dialog: MatDialog,
        private approvalService: approvalsection,
        private backend: backend,
        private backendService: backendService,
        private genericService: genericService,
        public pubSubService: NPubSubService,
        private router: Router,
        private snackBar: NSnackbarService,
        public route: ActivatedRoute,
        private dmsconfiguration: dmsconfiguration) {

        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }

    }

    ngOnInit() {
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
                this._getTableData(this.page_Index, this.pageSize);
            });
        }

    }
    rowdata(rowdata) {
        this.filedetails = rowdata.data;
        let fsuuid = this.filedetails.fsuuid
        this.dmsconfiguration.getConfigdataByUuid(fsuuid).then(res => {
            this.metadata = res.local.res.filter(e=>e.value != "");
        })

    }
    _getTableData(pageNumber?, pageSize?, filterValue?) {
        let filter = { "hidden": { "$exists": false } }
        this.approvalService.getApprovalListList(pageNumber, pageSize, this.sortData, filter, 'awaiting').then(res => {
            let result = res.local.res;
            if (result.data.length > 0) {
                this._setDataSource(result['data']);
                this.totalCount = result['count'];
            }
            else
                this.snackBar.openSnackBar('No Result Found');

            if (this.page_Index == 1)
                this.setPagination(this.page_Index);
        });
    }

    searchFiles(pageNumber?, pageSize?, filterObj?) {
        let encodedFilter = btoa(JSON.stringify(filterObj));
        this.router.navigate(['/home/approval'], { queryParams: { filter: encodedFilter } });
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

    rejectDialog(element, action): void {
        this.dialog.open(dilogueComponent, {
            width: '32%',
            panelClass: 'custom-dialog-container',
            data: '',
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

    fsAction(element, action) {
        // let approverObj = element.approvalLevels.find(x => x.approvalStatus == 'awaiting');
        this.filedetails = null;
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

    /**
* Creates an downloadable link of the file.
* @param filePath :FileName or FilePath url
*/
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    ngOnDestroy() {
        if (this.searchPubSub)
            this.searchPubSub.unsubscribe();
    }
}
