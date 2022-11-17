import { Component, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table';
import { backend } from '../../sd-services/backend';
import { MatDialog } from '@angular/material';
import { ListUserGroupDialogComponent } from '../list-user-group-dialog/list-user-group-dialog.component';
import { backendService } from 'app/services/backend/backend.service';

@Component({
    selector: 'bh-userlist',
    templateUrl: './userlist.template.html',
    styleUrls: ['./userlist.component.scss']
})

export class userlistComponent implements OnInit {

    displayedColumns: string[] = ['displayName','mail', 'userGroups', 'groups'];
    dataSource = new MatTableDataSource();

    pageNumber: number = 1;
    pageSize: number = 10;
    enableLoadMore: boolean = true;
    searchValue;

    constructor(private backend: backend,
        public dialog: MatDialog,
        private _backend: backendService) {

    }

    ngOnInit() {
        this._getTableData(this.pageNumber, this.pageSize);
    }

    /**
     *
     * @param pageNumber : PageNumber
     * @param pageSize : PageSixe
     * @param filter : Filter value .
     */
    _getTableData(pageNumber, pageSize, filter?) {
        this.enableLoadMore = true;
        let params = {
            page: pageNumber,
            limit: pageSize
        }
        if(filter){
            params['displayName'] = filter
        }
        this._backend.getUserList(params).subscribe( res => {
            let result = res.data;
            if (result.length < pageSize){
                this.enableLoadMore = false;
            }
            this._setDataSource(result);
        })
        // this.backend.getPrivilegeGroupUsers(pageNumber, pageSize, filter || undefined).then(res => {
        //     let result = res.local.res || [];
        //     if (result.length < pageSize)
        //         this.enableLoadMore = false;
        //     this._setDataSource(result);
        // });
    }


    /**
     * Assigns data to MatTableDataSource
     * @param tableData : Table datasource array
     */
    _setDataSource(tableData) {
        this.dataSource = new MatTableDataSource(tableData);
    }

    /**
     * Load more action
     */
    loadMore() {
        this.pageSize = this.pageSize * 2;
        this._getTableData(this.pageNumber, this.pageSize);
    }

    onArrowRight(){
        this.pageNumber = this.pageNumber + 1;
        this._getTableData(this.pageNumber, this.pageSize);
    }

    onArrowLeft(){
        this.pageNumber = this.pageNumber - 1;
        this._getTableData(this.pageNumber, this.pageSize);
    }


    /**
     * List Dialog open on row click
     * @param element : Current Row object
     */
    showuserGroups(element,groupType) {
        if(groupType == 'privilege'){
            let groupsArr = element.groups;
            if (groupsArr.length > 0){
                this.dialog.open(ListUserGroupDialogComponent, {
                  panelClass:"listUserGroupDialog",
                    data: {
                        listHeader: 'Privilege Groups',
                        listdata: groupsArr,
                        msg: 'user'
                    }
                })
            }
        }else if(groupType == 'user'){
            let groupsArr = element.userGroups;
            if(groupsArr.length > 0){
                this.dialog.open(ListUserGroupDialogComponent, {
                  panelClass:"listUserGroupDialog",
                    data: {
                        listHeader: 'User Groups',
                        listdata: groupsArr,
                        msg: 'user'
                    }
                })
            }
        }

    }

    /**
     * Search event triggered on search button click or key enter
     * @param value : searchValue
     */
    searchUser(value) {
        this.pageNumber = 1
        this.enableLoadMore = true;
        this._getTableData(this.pageNumber, this.pageSize, value);
    }

}
