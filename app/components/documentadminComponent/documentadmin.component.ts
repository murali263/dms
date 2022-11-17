
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { dmsstatus } from '../../sd-services/dmsstatus';
import { backendService } from 'app/services/backend/backend.service';
import { backend } from 'app/sd-services/backend';
import { genericService } from '../../services/generic/generic.service';
import { MatTableDataSource, MatPaginator, MatSort, MatAutocompleteSelectedEvent, MatDialog, MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { dmsusers } from '../../sd-services/dmsusers';
import { FormControl } from '@angular/forms';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';




export interface PeriodicElement {
    _id: string;
}

@Component({
    selector: 'bh-documentadmin',
    templateUrl: './documentadmin.template.html',
    styleUrls: ['./documentadmin.component.scss']
})



export class documentadminComponent implements OnInit {
    @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;
    @ViewChild('autoTriggerLvl1', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl1: MatAutocompleteTrigger;
    @ViewChild('autoTriggerLvl2', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl2: MatAutocompleteTrigger;
    @ViewChild('autoTriggerLvl3', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl3: MatAutocompleteTrigger;
    @ViewChild('autoTriggerLvl4', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl4: MatAutocompleteTrigger;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    selection = new SelectionModel<PeriodicElement>(true, []);
    displayedColumns: string[] = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
    // 'select',
    dataSource: any;
    pageMetadata;
    sortData: any = { 'timestamp': -1 };
    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 6;          //  Pagination size
    pager = [];             //  Array of paginator
    currntPageNum = 1;      //  Current page number
    tableData = [];         //  Table Data
    totalCount;             //  Total Data Count
    pubSub: any;
    filterObj;              //  Search Text
    paginationIndex = 1;    // pager next slot
    searchPubSub;
    pageNumber = 1;
    currentFsDataObj = {
        fileArr: []
    };
    searchFilter;
    activedetails: string;
    activelog: string;
    activefontdetails: string;
    activefontlog: string;
    detailsdata: any;
    isChild: boolean;
    isdetailschild: boolean;
    islogchild: boolean;
    isfolder: boolean;
    isfile: boolean;
    metadata;
    auditList = [];
    showloadmore: boolean;
    auditPagenumber: number;
    rowback: string;
    clickedRows = null;
    isShown: boolean = false;
    encodedObj;
    Filearray;
    result2: any;
    blocknext: boolean;
    selectedStatus1: string;
    selectedStatus2: string;
    docowner: string;
    approver1: string;
    approver2: string;
    userList1 = [];
    userList2 = [];
    userList3 = [];
    userList4 = [];
    approval1Selected: string;
    approval2Selected: string;
    searchflag: boolean;
    bulksearchflag: boolean;
    docownerselected: string;
    attributeList: any;
    attributeselected: string;
    atrrTypselected: string;
    typeselected: string;
    attruser: string;
    attruserSelected: any;
    attrValueList: any;
    attrValuearray: any;
    filteredList: any;
    ddlArray: any;
    fttext: string;

    showPreview = false;
    supported_extensions: string[] = ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png','pdf'];
    mainapproval: boolean = true; // hidden by default
    showDocument = false;
    currentDocView;
    currentDoc;

    ddl = new FormControl();
    bulktable: boolean;

    

    constructor(private nLocalStorage: NLocalStorageService, public dmStatus: dmsstatus, private route: ActivatedRoute, private backend: backend, private backendService: backendService, public dialog: MatDialog,
        public activeRoute: ActivatedRoute, private genericService: genericService, private snackBarService: NSnackbarService,
        public pubSubService: NPubSubService, private snackBar: NSnackbarService,
        private router: Router, private dmsconfiguration: dmsconfiguration, private usersService: dmsusers) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }

    ngOnInit() {
        this.activedetails = "trashborderactive";
        this.activelog = "trashborder";
        this.activefontdetails = "trashchildactive";
        this.activefontlog = "trashchild";
        this.detailsdata = null;
        this.isChild = false;
        this.isdetailschild = false;
        this.islogchild = false;
        this.isfolder = false;
        this.isfile = false;
        this.showloadmore = false;
        this.auditPagenumber = 1;
        this.rowback = 'none';
        this.clickedRows = new Set<PeriodicElement>();
        this.result2 = null;
        this.blocknext = false;
        this.selectedStatus1 = "";
        this.selectedStatus2 = "";
        this.approver1 = "";
        this.approver2 = "";
        this.attruser = "";
        this.docowner = "";
        this.searchflag = false;
        this.bulksearchflag = false;
        this.bulktable = false;
        this.approval1Selected = "";
        this.approval2Selected = "";
        this.docownerselected = "";

        this.attributeselected = '0';
        this.typeselected = '';
        this.fttext = '';




        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.encodedObj = btoa(encodeURIComponent(JSON.stringify(res)))
            this.searchFiles(this.encodedObj);
        })

        let filter = this.route.snapshot.queryParamMap.get('filter');

        if (filter) {
            filter = JSON.parse(decodeURIComponent(atob(filter)));
            this.searchFilter = filter;
            this.triggerSearch(this.pageNumber, this.pageSize, filter);
        } else {
            this._getTableData(this.page_Index, this.pageSize);
        }
        this.getAttribute();
    }


    getAttribute() {
        this.getConfigData().then((metadata: any[]) => {
            metadata.push(
                {
                    "_id": "1",
                    "name": "Document Owner",
                    "fieldType": "search",
                    "configId": "1"
                },
                {
                    "_id": "2",
                    "name": "Approver1",
                    "fieldType": "search",
                    "configId": "2"
                },
                {
                    "_id": "3",
                    "name": "Approver2",
                    "fieldType": "search",
                    "configId": "3"
                }

            );


            // ,
            //     {
            //         "_id":"4",
            //         "name":"Expiration date",
            //         "fieldType":"date",
            //         "configId":"4"
            //     }
            this.attributeList = metadata;
        })
        this.getConfigValues().then((metadata2: any[]) => {
            this.attrValueList = metadata2;
        })
    }

    clearsearch() {
        this.pubSubService.$pub('clearsearach', '')
    }


    onUpdateAll() {
        let idarray = this.selection.selected;
        if (idarray.length > 0) {
            if ((this.selectedStatus1 == 'rejected' || this.selectedStatus1 == 'approved') && (this.attributeselected == '2' || this.attributeselected == '3')) {
                if (this.selectedStatus1 == 'rejected') {
                    this.snackBar.openSnackBar('Documents already rejected,hence Approver cannot be changed');
                } else if (this.selectedStatus1 == 'approved') {
                    this.snackBar.openSnackBar('Documents already approved,hence Approver cannot be changed');
                }

            } else {
                const dialogRef = this.dialog.open(updatepopupComponent, {
                    width: '340px',
                    panelClass: 'custom-dialog-container',
                    data: {
                        idarray: idarray,
                        atrrTypselected: this.atrrTypselected,
                        attrValuearray: this.attrValuearray,
                        ddlArray: this.ddlArray,
                        attruser: this.attruser,
                        attruserSelected: this.attruserSelected,
                        userList4: this.userList4,
                        attributeList: this.attributeList,
                        attributeselected: this.attributeselected,
                        alert: false
                    },
                    autoFocus: false,
                    disableClose: true
                });

                dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        // if(success){
                        const dialogRef = this.dialog.open(updatepopupComponent, {
                            width: '740px',
                            panelClass: 'custom-dialog-container',
                            data: {
                                idarray: idarray,
                                atrrTypselected: this.atrrTypselected,
                                attrValuearray: this.attrValuearray,
                                ddlArray: this.ddlArray,
                                attruser: this.attruser,
                                attruserSelected: this.attruserSelected,
                                userList4: this.userList4,
                                attributeList: this.attributeList,
                                attributeselected: this.attributeselected,
                                alert: true
                            },
                            autoFocus: false,
                            disableClose: true
                        });
                    }
                });
            }
        } else {
            this.snackBar.openSnackBar('No row selected');
        }

    }

    onBulksearch() {
        console.log(this.selectedStatus1,this.attributeselected);
        if(this.selectedStatus1 !== "" || this.attributeselected !== "0" ){
            this.selection.clear();
            this.searchflag = false;
            this.bulksearchflag = true;
            let filter = null;

            if (this.attributeselected == "1") {
                filter = [
                    { approvalStatus: this.selectedStatus1 },
                    { "documentOwner.mail":{$in:[this.attruserSelected]}  }
                ];
            } else if (this.attributeselected == "2") {
                filter = [
                    { approvalStatus: this.selectedStatus1 },
                    { "approvalLevels.0.username": this.attruserSelected }
                ];
            } else if (this.attributeselected == "3") {
                filter = [
                    { approvalStatus: this.selectedStatus1 },
                    { "approvalLevels.1.username": this.attruserSelected }
                ];
            } else if (this.attributeselected == "4") {

            } else if (this.atrrTypselected == 'DDL') {
                let configStr = "configData." + this.attributeselected;
                let allFilter = {};
                allFilter[configStr] = { $all: this.ddlArray };
                filter =
                    [
                        { approvalStatus: this.selectedStatus1 },
                        allFilter
                    ];
            } else if (this.atrrTypselected == 'FT') {
                let configStr = "configData." + this.attributeselected;
                let allFilter = {};
                allFilter[configStr] = { $regex: '(?i)^' + this.fttext };
                filter =
                    [
                        { approvalStatus: this.selectedStatus1 },
                        allFilter
                    ];
            }
        
            this._getTableData(0, 0, filter);
        }
    }

    getConfigData() {
        let filterObj = {
            'active': true,
            'visible': true,
        }
        return new Promise((resolve, reject) => {
            this.dmsconfiguration.getConfigsByFilter(filterObj).then(res => {
                if (res && res.local) {
                    resolve(res.local.res);
                }
            })
        })
    }

    getConfigValues(): Promise<any[]> {
        let filterObj = {
            'active': true,
            'visible': true
        }
        return new Promise((resolve, reject) => {
            this.dmsconfiguration.getMetadataValues(filterObj).then(res => {
                if (res && res.local) {
                    const response: any[] = res.local.configValues;
                    resolve(response);
                }
            })
        })

    }

    redirectToEditUploadFile(id, currentTab?) {
        let businessDept;
        let filterObj = { "uuid": id };
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            let businessDept = res.local.res[0].businessDepartment;
            // if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "documentad") {
            //     this.snackBar.openSnackBar('File is no longer in awaiting approval');
            //     return false
            // }
            // else {
                let encodedUUId = btoa(encodeURIComponent(JSON.stringify(id)));
                this.nLocalStorage.setValue('id', encodedUUId);
                this.router.navigate([`home/documents/editfile`], { queryParams: { id: encodedUUId, currentID: 'uuid', action: 'reset',businessDept: businessDept, currentTab: currentTab || 'documentad' } });
            // }
        });
    }


    _getTableData(pageNumber?, pageSize?, filterValue?) {

        let filter = { "hidden": { "$exists": false } }
        if (!this.searchflag && !this.bulksearchflag) {
            this.dmStatus.getMyFiles(pageSize, 'all', pageNumber, filter, { timestamp: -1 })
                .then((res) => {
                    this.result2 = res.local.files.fileList;
                    this.totalCount = res.local.files.pageNumber * pageSize;

                    if (this.result2.length == 0) {
                        this.blocknext = true;
                    } else {
                        this.dmStatus.getMyFiles(pageSize, 'all', pageNumber + 1, filter, { timestamp: -1 })
                            .then((res3) => {
                                if (res3.local.files.fileList.length == 0) {
                                    this.blocknext = true;
                                } else {
                                    this.blocknext = false;
                                }
                            })
                        this._setDataSource(this.result2);
                    }
                    if (this.page_Index == 1)
                        this.setPagination(this.page_Index);
                })
        } else if (this.bulksearchflag) {
            this.backendService.searchuserbyfilter({
                filter: filterValue,
                flag: true
            }).subscribe(response => {

                this.result2 = response.fileList;
                if (this.result2.length == 0) {
                    this.blocknext = true;
                    this.searchflag = true;
                    this.displayedColumns = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
                    this.bulksearchflag = false;
                    this.bulktable = false;
                    this._setDataSource([]);
                } else {
                    this.searchflag = true;
                    this.bulksearchflag = false;
                    this.bulktable = false;
                    this.pageSize = this.result2.length;
                    this._setDataSource(this.result2);
                    if (this.result2) {
                        this.bulksearchflag = true;
                        this.bulktable = true;
                        this.displayedColumns = ['select', 'name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
                    } else {
                        this.bulktable = false;
                    }
                }
                if (this.page_Index == 1)
                    this.setPagination(this.page_Index);
            });
        } else {

            this.backendService.searchuserbyfilter({
                status: this.selectedStatus2,
                owner: this.docownerselected,
                approval1: this.approval1Selected,
                approval2: this.approval2Selected,
                pageNumber: pageNumber,
                bulkFlag: false,
                size: pageSize

            }).subscribe(response => {
                this.result2 = response.fileList;
                if (this.result2.length == 0) {
                    this.blocknext = true;
                } else {
                    this.backendService.searchuserbyfilter({
                        status: this.selectedStatus2,
                        owner: this.docownerselected,
                        approval1: this.approval1Selected,
                        approval2: this.approval2Selected,
                        pageNumber: pageNumber + 1,
                        bulkFlag: false,
                        size: pageSize
                    }).subscribe(response2 => {

                        if (response.fileList.length == 0) {
                            this.blocknext = true;
                        } else {
                            this.blocknext = false;
                        }
                    })
                    this.displayedColumns = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
                    this._setDataSource(this.result2);
                }
                if (this.page_Index == 1)
                    this.setPagination(this.page_Index);
            });
        }


    }




    searchFiles(pageNumber?, pageSize?, filterObj?) {
        let encodedFilter = btoa(JSON.stringify(filterObj));
        this.router.navigate(['/home/status/rejected'], { queryParams: { filter: encodedFilter } });
        this.triggerSearch(pageNumber, pageSize, filterObj);

    }

    triggerSearch(pageNumber?, pageSize?, filterObj?) {
        this.page_Index = pageNumber;
        this.currntPageNum = pageNumber;
        // let decodedFilter = JSON.parse(atob(filterObj));
        let decodedFilter = JSON.parse(decodeURIComponent(atob(filterObj)));
        let filter = { "hidden": { "$exists": false } }
        this.dmStatus.getMyFiles(pageSize, 'all', pageNumber, decodedFilter || filter, { timestamp: -1 })
            .then((res) => {
                let result = res.local.files.fileList;
                if (result.length > 0 || this.dataSource.data.length == 1) {
                    this._setDataSource(result);
                    this.totalCount = res.local.files.pageNumber * pageSize;
                    if (this.page_Index == 1)
                        this.setPagination(this.page_Index);
                } else {
                    this._setDataSource(result);
                    this.totalCount = res.local.files.pageNumber * pageSize;
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
        }
        this.paginationIndex = index;

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
    /**
     * Method which returns page and total no of pages
     * @param index - current page number
     * @param totalCount -total rows in table
     * @param pageSize - Total Page size
     */
    pagination(index, totalCount, pageSize) {
        let pager = [];
        let totalPages = Math.ceil(totalCount / pageSize);
        let i = 0;
        let finalSize = 0;
        if (index * 10 < totalPages) {
            finalSize = index * 10;
        } else {
            finalSize = totalPages;
        }
        i = (index - 1) * 10;
        while (i < finalSize) {
            pager.push(i + 1);
            i = i + 1;
        }
        return { pager: pager, page_Index: totalPages };
    }

    /**
     * Creates an downloadable link of the file.
     * @param filePath :FileName or FilePath url
     * @param fileName the name of the file that is downloaded
     * @param fsuuid  
     */
    // downloadFile(filePath, fileName, fsuuid, clientContainerName) {
    //     this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    // }
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        const data = this.dataSource
        //console.log(data)
        this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    deleteFS(item) {
        let parentId = item['objectPath'][item['objectPath'].length - 1];
        let deleteObj = {
            uuid: item['uuid'],
            parentId: parentId,
            fsuuid: item.fsuuid,
            type: item.type,
            container: item['clientContainerName'],
            name: item['fileName']
        }
        this.backend.deleteFs(deleteObj).then(res => {
            if (this.dataSource.data.length == 1) {
                this.page_Index--;
                this.currntPageNum--;
            }
            if (this.searchFilter != undefined) {
                this.searchFiles(this.currntPageNum, this.pageSize, this.searchFilter)
            } else {
                this._getTableData(this.currntPageNum, this.pageSize);
            }
            // this._getTableData(this.currntPageNum, this.pageSize);
        });
    }

    deleteFilesPopup(item) {
        this.dialog.open(deletegroupComponent, {
            width: '30%',
            data: {
                msg: 'Are you sure you want delete this request and the document permanently?',
                positiveButton: 'Yes',
                negativebuuton: 'No'
            },
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res['status']) {
                this.deleteFS(item);
            }
        })
    }

    ngOnDestroy() {
        if (this.searchPubSub)
            this.searchPubSub.unsubscribe();
    }

    /**
     * Returns an array having trash true, for respective fsuuid
     * @param fsItem : fsObject[FileObject or FolderObject]
     */
    checkHasParentTrash(fsItem) {
        return new Promise((resolve, reject) => {
            let filterObj = { fsuuid: { "$in": fsItem.objectPath }, trash: true };
            let keys = { name: 1, fsuuid: 1, logicalPath: 1 }
            return this.backend.getFolderFS(filterObj, { timestamp: -1 }, keys).then(res => {
                return resolve(res.local.res);
            });
        });
    }

    checkDuplicateFolder(folderItem) {
        return new Promise((resolve, reject) => {
            return this.backend.getFolderFS({ type: 'Folder', name: folderItem.name, logicalPath: folderItem.logicalPath, trash: false }).then(res => {
                return resolve(res.local.res);
            });
        });
    }
    changedetails() {
        this.activedetails = "trashborderactive";
        this.activelog = "trashborder";
        this.activefontdetails = "trashchildactive";
        this.activefontlog = "trashchild";
        this.islogchild = false;
        this.isdetailschild = true;
    }

    changelog() {
        this.activedetails = "trashborder";
        this.activelog = "trashborderactive";
        this.activefontdetails = "trashchild";
        this.activefontlog = "trashchildactive";
        this.islogchild = true;
        this.isdetailschild = false;
        this.auditList = [];
        this.loadAudit();
    }
    // onrowclick(data) {
    //     this.clickedRows = new Set<PeriodicElement>();
    //     this.changedetails();
    //     this.detailsdata = data;
    //     if (this.detailsdata.type == 'File') {
    //         this.isfile = true;
    //         this.isfolder = false;
    //         this.dmsconfiguration.getConfigdataByUuid(this.detailsdata.fsuuid).then(res => {
    //             this.metadata = res.local.res.filter(e => e.value != "");
    //         })
    //     } else {
    //         this.isfolder = true;
    //         this.isfile = false;
    //     }
    //     this.isdetailschild = true;
    //     this.islogchild = false;
    //     this.isChild = true;
    //     this.rowback = "rowback";


    // }

    loadAudit() {
        if (this.detailsdata != null)
            this.backend.auditLog(this.detailsdata.fsuuid, this.auditPagenumber).then(res => {
                this.auditList.push.apply(this.auditList, res.local.res.audit);
                if (res.local.res.audit.length >= 10) {
                    this.showloadmore = true;
                    this.auditPagenumber++;
                } else {
                    this.showloadmore = false;
                }
            });
    }


    // cofig screen 
    loadPrevious(page, pageSize) {
        page = page - 1;
        this.pageItem(page, pageSize);
    }

    loadNext(page, pageSize) {
        page = page + 1;
        this.pageItem(page, pageSize);
    }


    /**
       * Event triggered on sort drop down change
       * @param sortKey  : Sort key value ['name' , 'createdTime'] 
       */
    filterSort(sortKey) {
        let dataType = (sortKey == 'name') ? 'String' : 'Number'
        this.result2 = this._sortArray(sortKey, this.result2, 'name', sortKey == 'name');
    }

    /**
     * Returns an sorted array based on key
     * @param key : Key name on which sort has to happen
     * @param {any}array : Array to be sorted
     * @param {String} dataType : String to make case insensitive sort.
     * @param {Boolean} ascending : sort order [optional]
     */
    _sortArray(key, array, dataType, ascending?) {
        let _convertCase;
        if (dataType == 'String')
            _convertCase = (value) => value.toString().toLowerCase();
        else
            _convertCase = (value) => value;
        return array.sort(function (a, b) {
            if (_convertCase(a[key]) < _convertCase(b[key])) {
                return ascending ? -1 : 1;
            }
            if (_convertCase(a[key]) > _convertCase(b[key])) {
                return ascending ? 1 : -1;
            }
            return 0;
        })
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

    onStatuschange2() {
        //// console.log(this.selectedStatus2);
    }

    onStatuschange1() {

        this.selection.clear();

        this.searchflag = true;
        this.bulksearchflag = false;
        this.bulktable = false;
        // this.displayedColumns = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
        // this._setDataSource([]);

        this.bulksearchflag = false;
    }


    onSinglesearch() {

        if (this.selectedStatus2 == "" && this.docowner == "" && this.approver1 == "" && this.approver2 == "") {
            this.snackBar.openSnackBar('Select at least one filter!');
        } else {
            this.searchflag = true;
            this.bulksearchflag = false;
            this.bulktable = false;
            this.page_Index = 1;
            this.pageSize = 6;
            this.currntPageNum = 1;
            this.displayedColumns = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
            this._getTableData(this.page_Index, this.pageSize);
        }
    }


    onApproverSearch(level, event) {

        // if (event && event.keyCode == 13)
            this.searchUsers(level);
    }


    searchUsers(level) {
        // let filter = "";
        //   if(level == 1){
        //      filter = `startswith( displayname, '${this.approver1}')`;
        //   }else if(level == 3){
        //     filter = `startswith( displayname, '${this.docowner}')`;
        //   }else{
        //      filter = `startswith( displayname, '${this.approver2}')`;
        //   }


        let searchValue = "";
        if (level == 1) {
            searchValue = this.approver1;
        } else if (level == 3) {
            searchValue = this.docowner;
        } else if (level == 4) {
            searchValue = this.attruser;
        } else {
            searchValue = this.approver2;
        }


        this.backendService.searchUser(searchValue).then(res => {
            if (res instanceof Array) {
                if (level == 1) {
                    this.userList1 = res.map(el => {
                        el.username = el.mail ? el.mail.toLowerCase() : '';
                        return el;
                    });
                    this.autoTriggerLvl1.openPanel();
                }
                else if (level == 2) {
                    this.userList2 = res.map(el => {
                        el.username = el.mail ? el.mail.toLowerCase() : '';
                        return el;
                    });

                    this.autoTriggerLvl2.openPanel();
                } else if (level == 4) {
                    this.userList4 = res.map(el => {
                        el.username = el.mail ? el.mail.toLowerCase() : '';
                        return el;
                    });

                } else {
                    this.userList3 = res.map(el => {
                        el.username = el.mail ? el.mail.toLowerCase() : '';
                        return el;
                    });

                    this.autoTriggerLvl3.openPanel();
                }
            }
        });
    }


    onattributeselection() {
        this.selection.clear();
        this.searchflag = true;
        this.bulksearchflag = false;
        this.bulktable = false;
        this.displayedColumns = ['name', 'owner', 'rejectedby', 'removeddate', 'edit', 'action'];
        // this._setDataSource([]);


        for (let i = 0; i < this.attributeList.length; i++) {
            if (this.attributeList[i].configId == this.attributeselected) {
                this.atrrTypselected = this.attributeList[i].fieldType;
                if (this.atrrTypselected == 'DDL') {
                    this.attrValueList.forEach(element => {
                        if (element._id == this.attributeselected) {
                            this.attrValuearray = element.values;
                            this.filteredList = this.attrValuearray;
                        }
                    });
                }
                break;
            }
        }
    }

    levelOptionSelected(level) {
        if (level == 1) {
            this.userList1 = [];
        } else if (level == 2) {
            this.userList2 = []
        } else if (level == 4) {
            this.userList4 = []
        } else {
            this.userList3 = [];
        }
    }

    displayFnUserList(userObj: any): any | undefined {
        return userObj && userObj['displayName'] || '';
    }

    onselectapp1(approver1mail) {
        this.approval1Selected = approver1mail;
    }

    onselectowner(ownermail) {
        this.docownerselected = ownermail;
    }

    onselectapp2(approver2mail) {
        this.approval2Selected = approver2mail;
    }

    onselectattrUser(mail) {
        this.attruserSelected = mail;
    }

    rowdata(rowdata) {
        this.docsChildDetails.filedetails = false;
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
    checkextention(element){        
        let extension = element.extension.toLowerCase() || '';
        if (this.supported_extensions.includes(extension)) {
            this.showPreview = true;
        }
        else{
            this.showPreview = false;
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
    showawaiting() {
        this.showDocument = false;
        this.mainapproval = true;
    }
}

@Component({
    selector: 'bh-updatepopup',
    templateUrl: './updatepopup.template.html',
    styleUrls: ['./updatepopup.component.scss']
})

export class updatepopupComponent implements OnInit {


    @ViewChild('autoTriggerLvl4', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl4: MatAutocompleteTrigger;
    ddlArray: any;
    filteredList: any;
    atrrTypselected: any;
    attrValuearray: any;
    attruser: any;
    attruserold:any;
    attruserSelected: any;
    userList4: any[];
    idarray: string[];
    tablearray: any[];
    attributeList: any;
    attributeselected: any;
    attributename: any;
    requestUpdate: {};
    alert: boolean;
    success: boolean;
    fttext: string;


    // constructor( private nLocalStorage: NLocalStorageService,public dmStatus: dmsstatus,private route: ActivatedRoute,private backend: backend, private backendService: backendService, public dialog: MatDialog,
    //     public activeRoute: ActivatedRoute, private genericService: genericService, private snackBarService: NSnackbarService,
    //     public pubSubService: NPubSubService, private snackBar: NSnackbarService,
    //     private router: Router,private dmsconfiguration: dmsconfiguration, private usersService: dmsusers) {
    //     this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //         return false;
    //     }
    // }

    constructor(
        public dialogRef: MatDialogRef<updatepopupComponent>, private backendService: backendService, private snackBar: NSnackbarService,
        @Inject(MAT_DIALOG_DATA) public parent) { }

    ngOnInit(): void {
        this.ddlArray = [];
        this.filteredList = this.parent['attrValuearray'];
        this.atrrTypselected = this.parent['atrrTypselected'];
        this.attrValuearray = this.parent['attrValuearray'];
        this.ddlArray = this.parent['ddlArray'];
        this.attruser = this.parent['attruser'];
        this.attruserold = this.parent['attruser'];
        this.attruserSelected = this.parent['attruserSelected'];
        this.userList4 = this.parent['userList4'];
        this.tablearray = this.parent['idarray'];
        this.idarray = [];
        this.attributeList = this.parent['attributeList'];
        this.attributeselected = this.parent['attributeselected'];
        this.alert = this.parent['alert'];
        this.success = false;
        this.getattributename();
        this.fttext = '';
    }

    onApproverSearch(level, event) {
        // if (event && event.keyCode == 13)
            this.searchUsers(level);
    }


    searchUsers(level) {
        let searchValue = this.attruser;
        this.backendService.searchUser(searchValue).then(res => {
            if (res instanceof Array) {

                this.userList4 = res.map(el => {
                    el.username = el.mail ? el.mail.toLowerCase() : '';
                    return el;
                });
            }

        });
    }


    levelOptionSelected(level) {
        if (level == 4) {
            this.userList4 = []
        }
    }

    displayFnUserList(userObj: any): any | undefined {
        return userObj && userObj['displayName'] || '';
    }

    getattributename() {
        this.attributeList.forEach(element => {
            if (this.attributeselected == element.configId) {
                this.attributename = element.name;
            }
        });

    }

    submit() {
        let i = 0;
        this.idarray = [];
        this.tablearray.forEach(element => {
            let id = element.uuid;
            this.idarray.push(id);
        });

        this.getattributename();

        this.requestUpdate = {
            idarray: this.idarray,
            attributename: this.attributename,
            atrrTypselected: this.atrrTypselected,
            ddlArray: this.ddlArray,
            attruser: this.attruser,
            attributeselected: this.attributeselected,
            attruserold:this.attruserold
        };

        this.backendService.bulkupdate(this.requestUpdate).subscribe(res => {
            if (res.success) {
                this.success = true;
                this.close();
            } else {
                this.snackBar.openSnackBar('Something went wrong');
            }
        })


    }

    close() {
        this.dialogRef.close(this.success);
    }
    
}