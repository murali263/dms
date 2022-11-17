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
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
    selector: 'bh-privilegegroups',
    templateUrl: './privilegegroups.template.html'
})

export class privilegegroupsComponent implements OnInit {

    displayedColumns: string[] = ['select', 'name', 'users', 'userGroups', 'createdBy'];
    dataSource = new MatTableDataSource();
    selection = new SelectionModel(true, []);

    //Pagination
    page_Index = 1;         //  Paginator index
    pageSize = 10;          //  Pagination size
    pager = [];             //  Array of paginator
    currntPageNum = 1;      //  Current page number
    tableData = [];         //  Table Data
    totalCount;             //  Total Data Count
    paginationIndex = 1;    // pager next slot
    enableLoadMore:boolean=true;
    hideright: boolean = true; // hidden by default
  hideleft: boolean = true; // hidden by default
    constructor(private backendService: backendService,
        private backend: backend,
        private router: Router,
        private genericService: genericService,
        private snackBarService: NSnackbarService,
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


    editResource() {
        this.backendService.currentUserObj
        let selectedItems = this.selection['selected'] || [];
        if (selectedItems && selectedItems.length == 1) {

            let groupObj = {
                groupId: selectedItems[0]['groupId'],
                name: selectedItems[0]['name'],
                feature: selectedItems[0]['feature'],
                users: selectedItems[0]['users'],
                userGroups: selectedItems[0]['userGroups'],
            }
            if (selectedItems[0]['groupId'] == 'super_user')
                if (this.backendService.currentUserObj.su)
                    this.router.navigate(['/home/accessAction/groups/create'], { queryParams: { groupObj: btoa(JSON.stringify(groupObj)) } });
                else
                    this.snackBarService.openSnackBar('Not an super user to edit');
            else
                this.router.navigate(['/home/accessAction/groups/create'], { queryParams: { groupObj: btoa(JSON.stringify(groupObj)) } });
        }
        else
            this.snackBarService.openSnackBar('Please select any one group to edit')

    }

    assignCheckedIndex(checkedStatus, index) {
        if (checkedStatus)
            this.checkedObj = this.resourceGrpList[index];
        else
            this.checkedObj = null;
    }


    onArrowRight(){

      this.pageItem(this.page_Index+1,this.pageSize)
      if(this.totalCount<this.pageSize*this.page_Index){
        this.enableLoadMore=false;
      }
   }

    onArrowLeft(){
        this.enableLoadMore=true
        this.pageItem(this.page_Index-1,this.pageSize)
    }

    _getTableData(pageNumber?, pageSize?, filterValue?) {
        this.page_Index = pageNumber;
        let params={page: pageNumber,limit:pageSize}
        this.backendService.getResourceGroupMod(params).then(res=>{

          this._setDataSource(res['data']);
          this.totalCount = res['count'];
          if(this.totalCount <= this.pageSize){
            this.enableLoadMore=false
        }
        });
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

    //Set Intial Pagination on UI
    /**
     * change page number on view
     * @param index page number
     * @param totalPagesize - Total Page size of tab
     */


    /**
     * Method for Pagination list
     * @param start - start page
     * @param pageSize - Total Page size
     */
    pageItem(start, pageSize) {

        this.currntPageNum = start;
        this.pageSize = pageSize;
        //this.setPagination(this.paginationIndex);
        this._getTableData(start, this.pageSize)
    }
    //delete group popup
    deleteGrpDilogue() {
        this.dialog.open(deletegroupComponent, {
            width: '32%',
            data: {
                msg: 'Are you sure you want to delete this privilege group?',
                positiveButton: 'Yes',
                negativebuuton: 'No'
            },
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res['status']) {
              this.deleteResourceGroups();
              this.selection.clear();
              const dialogRef =   this.dialog.open(DeletePopupComponent,{
                panelClass:"deletePopupDialog",
                data:{
                  msg:"privilegeDelete"
                }
              })
              setTimeout(() => {
                dialogRef.close();
              }, 4000);
            }
        })
    }

    //Delete Resource Groups
    deleteResourceGroups() {

        let selectedGroupsIds = this.selection.selected.map(el => { return el['groupId'] });
        if (selectedGroupsIds.length > 0)
            if (selectedGroupsIds.includes('super_user'))
                this.snackBarService.openSnackBar('Sorry , SUPER USER group cannot be deleted');
            else
              {
                console.log(selectedGroupsIds)
                let reqObj={action:"deleteMany",groupIdsArr:selectedGroupsIds}
                this.backendService.createUpdatePrivilegeGroup(reqObj).then(res=>{
                    if (this.dataSource.data.length == 1) {
                          this.page_Index--;
                          this.currntPageNum--;
                      }
                      if ((this.totalCount - selectedGroupsIds.length) <= 10) {
                          this.page_Index = 1;
                          this.currntPageNum = 1;
                      }
                      this._getTableData(this.currntPageNum, this.pageSize);
                })
              }
               
        else
            this.snackBarService.openSnackBar('Please select atleast one group to delete');
    }

    userNameList(userdata) {
        if (userdata.length) {
            let listArr = userdata.map(user => { return {displayName:user.displayName,userPrincipalName:user.userPrincipalName} })
            console.log(listArr);
            this.dialog.open(ListUserGroupDialogComponent, {
                data: {
                    msg:"privilegeListUser",
                    listHeader: 'User names',
                    listdata: listArr,
                    panelClass:"listUserGroupDialog"
                }
            })
        }
    }
    usergroupNameList(usergroupData) {
        if (usergroupData.length) {
            let listArr = usergroupData.map(user => { return user.displayName })
            this.dialog.open(ListUserGroupDialogComponent, {
                data: {
                    msg:"privilegeListUserGroup",
                    listHeader: 'User Groups',
                    listdata: listArr,
                    panelClass:"listUserGroupDialog"
                }
            })
        }

    }

}
