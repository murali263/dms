import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { backend } from '../../sd-services/backend';
import { backendService } from 'app/services/backend/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { genericService } from '../../services/generic/generic.service';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';



export interface PeriodicElement {
    _id: string;
}

@Component({
    selector: 'bh-trash',
    templateUrl: './trash.template.html',
    styleUrls: ['./trash.component.scss']
})

export class trashComponent implements OnInit {
    @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    displayedColumns: string[] = ['name', 'owner', 'deletedAt', 'removeddate', 'action'];
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
    clearpubsub;
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

    totalpage: number;
    currentFileIndex = 0;
    cuurentFile = false;

    constructor(private backend: backend, private backendService: backendService, public dialog: MatDialog,
        public activeRoute: ActivatedRoute, private genericService: genericService, private snackBarService: NSnackbarService,
        public pubSubService: NPubSubService, private snackBar: NSnackbarService,
        private router: Router, private dmsconfiguration: dmsconfiguration) {
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
        this.filterObj = { "hidden": { "$exists": false },"trash": true};
        
        this.totalpage = 1

        let filter = this.activeRoute.snapshot.queryParamMap.get('filter');


        if (filter) {
            filter = JSON.parse(decodeURIComponent(atob(filter)));
            this.searchFilter = filter;
            //console.log('+++++++++++++++++++++++');
            //console.log(this.searchFilter);
            //console.log('again triggeered');
            this.triggerSearch(this.pageNumber, this.pageSize, filter);
        } else {
            let trashData = this.activeRoute.snapshot.data.trashData;
            this.totalCount = trashData.count;
            this.totalpage=Math.floor(this.totalCount/this.pageSize);
            if(this.totalpage == 0 && this.totalCount != 0){
                this.totalpage = 1;
            }
            this.setPagination(this.page_Index);
            this._setDataSource(trashData['data']);

        }
        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.searchFilter = btoa(JSON.stringify(res))
            //console.log('+++++++++++++++++++++++');
            //console.log(this.searchFilter);
            this.searchFiles(this.pageNumber, this.pageSize, this.searchFilter)
        })

        this.clearpubsub = this.pubSubService.$sub('clearall').subscribe(res => {
            this.filterObj =  { "hidden": { "$exists": false }, "trash": true};
            this._getTableData(1,this.pageSize);
        })

    }

    restoreFS(item) {
        this.checkHasParentTrash(item).then(res => {
            if (res && res instanceof Array && res.length > 0) {
                let parentFSName = res.find(el => item.objectPath.includes(el.fsuuid)).name;
                this.dialog.open(deletegroupComponent, {
                    width: '30%',
                    data: {
                        msg: `Cannot restore the folder/file , because one of folder ${parentFSName || ''} is already in trash`,
                        positiveButton: 'Ok'
                    },
                    autoFocus: false,
                    restoreFocus: false,
                    disableClose: true
                });
            } else {
                if (item.type == 'Folder') {
                    this.checkDuplicateFolder(item).then(result => {
                        if (result && result instanceof Array && result.length > 0)
                            this.dialog.open(deletegroupComponent, {
                                width: '30%',
                                data: {
                                    msg: `A folder with same name already exists . Do you want to replace it ?`,
                                    positiveButton: 'Yes',
                                    negativebuuton: 'No'
                                },
                                autoFocus: false,
                                restoreFocus: false,
                                disableClose: true
                            }).afterClosed().subscribe(data => {
                                if (data['status'])
                                    this.backend.deleteFs(result[0]).then(response => {
                                        this.restoreFsItem(item);
                                    });
                            });
                        else
                            this.restoreFsItem(item);
                    });
                } else {
                    this.restoreFsItem(item);
                }
            }

        });


    }


    restoreFsItem(fsItem) {
        this.backend.restoreFS(fsItem).then(res => {
            if (this.dataSource.data.length == 1) {
                this.page_Index--;
                this.currntPageNum--;
            }
            if (this.searchFilter != undefined) {
                this.searchFiles(this.currntPageNum, this.pageSize, this.searchFilter)
            } else {
                this._getTableData(this.currntPageNum, this.pageSize);
            }
        });
    }


    _getTableData(pageNumber?, pageSize?) {
        // let filter = 
        this.page_Index = pageNumber;
        this.backend.getTrashList(pageNumber, pageSize, { deletedAt: -1 }, this.filterObj).then(res => {
            let result = res.local.res;
            this._setDataSource(result['data']);
            this.totalCount = result['count'];
            this.totalpage=Math.floor(this.totalCount/this.pageSize);
            if(this.totalpage == 0 && this.totalCount != 0){
                this.totalpage = 1;
            }
            if (this.page_Index == 1)
                this.setPagination(this.page_Index);
        });
    }

    searchFiles(pageNumber?, pageSize?, filterObj?) {
        // let encodedFilter = btoa(JSON.stringify(filterObj));
        //console.log('triggeered');
        this.triggerSearch(pageNumber, pageSize, filterObj);
       

    }

    triggerSearch(pageNumber?, pageSize?, filterObj?) {
        this.page_Index = pageNumber;
        this.currntPageNum = pageNumber;
        let decodedFilter = JSON.parse(atob(filterObj));
        //console.log('-------------------')
        //console.log(decodedFilter)
        // filterObj = { "trash": true, "name": decodedFilter.name, "hidden": { "$exists": false } }
        this.filterObj = {
            "trash": true,
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
        
        this._getTableData(1,pageSize)
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
        //console.log(this.currntPageNum , this.totalpage);
        //console.log(this.currntPageNum != this.totalpage);

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
        if (this.searchPubSub){
            this.searchPubSub.unsubscribe();
            this.clearpubsub.unsubscribe();
        }
            
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
        this.auditPagenumber = 1;
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
                ////console.log(res)
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

}