
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { dmsstatus } from '../../sd-services/dmsstatus';
import { DatePipe } from '@angular/common';
import { backendService } from 'app/services/backend/backend.service';
import { backend } from 'app/sd-services/backend';
import { dilogueComponent } from '../dilogueComponent/dilogue.component';
import { genericService } from '../../services/generic/generic.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';



export interface PeriodicElement {
    _id: string;
}

@Component({
    selector: 'bh-statusapproved',
    templateUrl: './statusapproved.template.html',
    styleUrls: ['./statusapproved.component.scss']
})



export class statusapprovedComponent implements OnInit {
    @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns: string[] = ['name', 'owner','rejectedby','removeddate', 'action'];
    dataSource: any;
    pageMetadata;
    sortData: any = { 'timestamp': -1 };
    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 10;          //  Pagination size
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
    activedetails:string;
    activelog:string;
    activefontdetails:string;
    activefontlog:string;
    detailsdata:any;
    isChild:boolean;
    isdetailschild:boolean;
    islogchild:boolean;
    isfolder:boolean;
    isfile:boolean;
    metadata;
    auditList = [];
    showloadmore:boolean;
    auditPagenumber: number;
    rowback: string;
    clickedRows = null;
    isShown: boolean = false ; 
    encodedObj;
    Filearray;
    result2:any;
    blocknext: boolean;

    totalpage: number;
    currentFileIndex = 0;
    cuurentFile = false;
    clearpubsub: any;
    showPreview = false;
    supported_extensions: string[] = ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png','pdf'];
    mainapproval: boolean = true; // hidden by default
    showDocument = false;
    currentDocView;
    currentDoc;
    


    constructor( private nLocalStorage: NLocalStorageService,public dmStatus: dmsstatus,private route: ActivatedRoute,private backend: backend, private backendService: backendService, public dialog: MatDialog,
        public activeRoute: ActivatedRoute, private genericService: genericService, private snackBarService: NSnackbarService,
        public pubSubService: NPubSubService, private snackBar: NSnackbarService,
        private router: Router,private dmsconfiguration: dmsconfiguration) {
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
        this.rowback='none';
        this.clickedRows = new Set<PeriodicElement>();
       this.result2=null;
       this.blocknext=false;
       this.filterObj = {"hidden": { "$exists": false }};


        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.encodedObj = btoa(JSON.stringify(res))
            //console.log('+++++++++++++++++++++++');
            //console.log(this.encodedObj);
            this.searchFiles(this.pageNumber, this.pageSize,this.encodedObj);
        })

        this.clearpubsub = this.pubSubService.$sub('clearall').subscribe(res => {
            this.filterObj =   {"hidden": { "$exists": false }};
            this._getTableData(1,this.pageSize);
        })

        let filter = this.route.snapshot.queryParamMap.get('filter');

        if (filter) {
            filter = JSON.parse(decodeURIComponent(atob(filter)));
            this.searchFilter = filter;
            this.triggerSearch(this.pageNumber, this.pageSize, filter);
        } else {
            this._getTableData(this.page_Index, this.pageSize);
        }

    }



    clearsearch() {
        this.pubSubService.$pub('clearsearach', '')
    }

 


    redirectToEditUploadFile(id, currentTab?) {        
        let filterObj = { "uuid": id };
        let businessDept;
        this.dmStatus.getFileByUuid(filterObj).then((res) => {
            let businessDept = res.local.res[0].businessDepartment;
            if ((res.local.res[0].approvalStatus == "approved" || res.local.res[0].approvalStatus == "rejected") && currentTab == "awaiting") {
                this.snackBar.openSnackBar('File is no longer in awaiting approval');
                return false    
            }
            else {
                let encodedUUId = btoa(encodeURIComponent(JSON.stringify(id)));
                this.nLocalStorage.setValue('id', encodedUUId);
                this.router.navigate([`home/documents/editfile`], { queryParams: { id: encodedUUId, currentID: 'uuid', action: 'reset',businessDept: businessDept, currentTab: currentTab || 'approved' } });
            }
        });
    }


    _getTableData(pageNumber?, pageSize?, filterValue?) {
            
            
            
            this.dmStatus.getMyFiles(pageSize, 'approved', pageNumber,  this.filterObj , { timestamp: -1 })
                .then((res) => {
                    this.result2 = res.local.files.fileList;
                    this.totalCount = res.local.files.pageNumber * pageSize;
                    // //console.log(this.result2.length);
                    if(this.result2.length == 0){
                        this.blocknext = true; 
                    }else{
                        // //console.log('===============')
                        this.dmStatus.getMyFiles(pageSize, 'approved', pageNumber+1,  this.filterObj , { timestamp: -1 })
                        .then((res3) => {
                           
                            if(res3.local.files.fileList.length == 0){
                                this.blocknext = true; 
                            }else{
                                this.blocknext = false; 
                            }
                        })
                        this._setDataSource(this.result2);
                    }
                    if (this.page_Index == 1)
                        this.setPagination(this.page_Index);
            })

    }




    searchFiles(pageNumber?, pageSize?, filterObj?) {
        this.triggerSearch(pageNumber, pageSize, filterObj);

    }

    triggerSearch(pageNumber?, pageSize?, filterObj?) {
        this.page_Index = pageNumber;
        this.currntPageNum = pageNumber;
        let decodedFilter = JSON.parse(atob(filterObj));
        this.filterObj = {
            "type": "File",
            "name": decodedFilter.name,
            "$and": decodedFilter.$and,
            "hidden": { "$exists": false }
        };

        //looping through keys Ri
        for(var k in decodedFilter.meta){
            let configStr = "configData." + k;
            this.filterObj[configStr] = { $all:decodedFilter.meta[k]};
        }
        this._getTableData(pageNumber,pageSize);
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
    changedetails(){
        this.activedetails = "trashborderactive" ;
        this.activelog = "trashborder";
        this.activefontdetails = "trashchildactive";
        this.activefontlog = "trashchild";
        this.islogchild = false;
        this.isdetailschild = true;
    }

    changelog(){
        this.activedetails = "trashborder" ;
        this.activelog = "trashborderactive";
        this.activefontdetails = "trashchild";
        this.activefontlog = "trashchildactive";
        this.islogchild = true;
        this.isdetailschild = false;
        this.auditList = [];
        this.loadAudit();
    }
    // onrowclick(data){
    //     this.clickedRows = new Set<PeriodicElement>();
    //     this.changedetails();
    //     this.detailsdata = data ;
    //     if(this.detailsdata.type == 'File'){
    //         this.isfile = true;
    //         this.isfolder = false;
    //         this.dmsconfiguration.getConfigdataByUuid(this.detailsdata.fsuuid).then(res => {
    //             this.metadata = res.local.res.filter(e => e.value != "");
    //         })
    //     }else{
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
    loadPrevious(page,pageSize) {
        page = page-1;
        this.pageItem(page ,pageSize);
    }

    loadNext(page,pageSize) {
        page = page+1;
        this.pageItem(page ,pageSize);
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


    // for details 

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