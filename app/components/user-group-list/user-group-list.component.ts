import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { backendService } from '../../services/backend/backend.service';
import { genericService } from '../../services/generic/generic.service';
import { backend } from '../../sd-services/backend';
import { Router, Route } from '@angular/router';
import { NSnackbarService } from 'neutrinos-seed-services';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { MatDialog } from '@angular/material';
import { listdialogComponent } from '../listdialogComponent/listdialog.component';
import { ListUserGroupDialogComponent } from '../list-user-group-dialog/list-user-group-dialog.component';
import { group } from '@angular/animations';
import { AuthService } from 'app/services/authService/auth.service';

@Component({
    selector: 'app-user-group-list',
    templateUrl: './user-group-list.component.html',
    styleUrls: ['./user-group-list.component.scss']
})
export class UserGroupListComponent implements OnInit {
    displayedColumns: string[] = ['select', 'name', 'users', 'createdBy'];
    dataSource = new MatTableDataSource();
    selection = new SelectionModel(true, []);
    elements = [];
    groupIdArray = [];
    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 10;          //  Pagination size
    pager = [];             //  Array of paginator
    currntPageNum = 1;      //  Current page number
    tableData = [];         //  Table Data
    totalCount;             //  Total Data Count
    paginationIndex = 1;    // pager next slot
    enableLoadMore: boolean = true;

    constructor(private backendService: backendService,
        private router: Router,
        public dialog: MatDialog) {
        this._getTableData(this.page_Index, this.pageSize);
    }

    checkedObj;
    resourceGrpList;
    ngOnInit() {

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
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    assignCheckedIndex(checkedStatus, index) {
        if (checkedStatus)
            this.checkedObj = this.resourceGrpList[index];
        else
            this.checkedObj = null;
    }


    _getTableData(pageNumber?, pageSize?) {
        this.page_Index = pageNumber;
        // let params = { page: pageNumber, limit: pageSize }
        this.backendService.apiGetUserGroup(pageNumber).subscribe(res => {
            this._setDataSource(res['data']);
            this.totalCount = res['count'];
            console.log("res",res['data']);
            console.log("size",this.pageSize);
            

            if(this.totalCount <= this.pageSize){
                this.enableLoadMore=false
            }
            
        });
    }


    editResource() {
        this.backendService.currentUserObj
        let selectedItems = this.selection['selected'] || [];

        let groupId = selectedItems[0]['groupId'];
        this.router.navigate(['/home/user-groups/create'], { queryParams: { groupId: groupId } })
    }

    deleteGrpDilogue() {
        this.groupIdArray = this.selection.selected.map(el => { return el['groupId'] });

        this.dialog.open(deletegroupComponent, {
            width: '32%',
            data: {
                msg: 'Are you sure you want to delete this user group?',
                positiveButton: 'Yes',
                negativebuuton: 'No'
            },
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {

            if (res['status']) {
                this.deleteResourceGroups(this.groupIdArray);
                this.selection.clear();

            }
        })
    }
    deleteResourceGroups(selectedGroupsIds) {

        let params = { action: "deleteMany", updatedByName: localStorage.getItem("displayName"), updatedByEmail: localStorage.getItem("email"), groupIdsArray: selectedGroupsIds }
        this.backendService.deleteResourceGroups(params).subscribe(res => {
            this._getTableData(this.currntPageNum, this.pageSize);

        })
    }

    /** Method calling to assiagn datasource to table data list
     * Based on tabs
     * @param tableData table data list
     */
    _setDataSource(tableData) {
        this.resourceGrpList = tableData;
        this.dataSource = new MatTableDataSource(tableData);
        this.dataSource.data.forEach(row => {
            let finder = this.selection.selected.findIndex(el => row['groupId'] === el['groupId']);
            if (finder >= 0) {

                this.selection.deselect(this.selection.selected[finder]);
                this.selection.select(row);
            }

        });
    }

    pageItem(start, pageSize) {

        this.currntPageNum = start;
        this.pageSize = pageSize;
        //this.setPagination(this.paginationIndex);
        this._getTableData(start, this.pageSize)
    }


    onArrowRight() {

        this.pageItem(this.page_Index + 1, this.pageSize)
        if (this.totalCount < this.pageSize * this.page_Index) {
            this.enableLoadMore = false;
        }
    }

    onArrowLeft() {
        this.enableLoadMore = true
        this.pageItem(this.page_Index - 1, this.pageSize)
    }





    userNameList(userdata) {
        if (userdata.length) {
            let listArr = userdata.map(user => {
                return user
            })


            this.dialog.open(ListUserGroupDialogComponent, {
                panelClass: "listUserGroupDialog",
                data: {
                    listHeader: 'User Names',
                    listdata: listArr
                }
            })
        }
    }


}
