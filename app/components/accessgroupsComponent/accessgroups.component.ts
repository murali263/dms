import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dmsusers } from '../../sd-services/dmsusers';
import { NPubSubService, NSnackbarService } from 'neutrinos-seed-services';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';


import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { listdialogComponent } from '../listdialogComponent/listdialog.component';
import { backendService } from 'app/services/backend/backend.service';

@Component({
    selector: 'bh-accessgroups',
    templateUrl: './accessgroups.template.html',
    styleUrls: ['./accessgroups.component.scss']
})

export class accessgroupsComponent implements OnInit {

    @Input() privilegeForm: FormGroup;
    @Output() userDetails = new EventEmitter();
    @Output() userGroupDetails = new EventEmitter();
    /**
     * Need to specify the service class that has the method that calls the http request. and the size of the initial array.
     * new MyDataSource(<Service>(this.userService), <size>)
     */
    userGroupData = new MyDataSource(this.userService, 10);
    userData = new UserDataSource(this.userService, 10);
    user;
    userGroup;
    userGroupArr = [];
    selected: any;
    userArr = []
    userDetailsArr = [];
    usergroupDetailsArr = [];
    searchedUser=[]
    searchUserName:string;
    public selectedSearchedUser=[];
    tempSelectedUserData=[];
    public searchUserGroupText:string = "";
    public searchUserGroups=[];
    public selectedUserGroup=[]
    public tempSelectedUserGroup=[]
    public searchSelectedUserName:string;
    public searchSelectedUserGroupName:string;
    @ViewChild(CdkVirtualScrollViewport, { static: true }) virtualScroll: CdkVirtualScrollViewport;
    size = 5;
    constructor(private fb: FormBuilder,
        private userService: dmsusers,
        private scrollDispatcher: ScrollDispatcher,
        public pubSubService: NPubSubService,
        public dialog: MatDialog,
        private snackBar: NSnackbarService, private backendService:backendService) {
    }

    ngOnInit() {
        this.privilegeForm = this.fb.group({
            selectUser: ['', [Validators.required]],
            selectUserGroup: ['', [Validators.required]],
            searchUser: [''],
            searchKey: ['all']
        });
        this.selected = "all";
        this.getAllUserGroup()
    }
    
    getAllUserGroup(){
      this.searchUserGroups=[];
      let params={getAll:"all"}
      this.backendService.getUserGroup(params).subscribe(res=>{
          res.data.forEach(el => {
            let tempObj = {};
            tempObj['categoryId'] = el.categoryId;
            tempObj['categoryName'] = el.categoryName;
            tempObj['createdByEmail'] = el.createdByEmail;
            tempObj['createdByName'] = el.createdByName;
            tempObj['createdTime'] = el.createdTime;
            tempObj['groupId'] = el.groupId;
            tempObj['groupName'] = el.groupName;
            tempObj['isActive'] = false;
            tempObj['resourceGroup'] = el.resourceGroup;
            tempObj['updatedByEmail'] = el.updatedByEmail;
            tempObj['updatedByName'] = el.updatedByName;
            tempObj['updatedTime'] = el.updatedTime;
            tempObj['users'] = el.users;
            tempObj['AlreadyAdded'] = this.checkifUserGroupAdded(el);;
            this.searchUserGroups.push(tempObj);
            this.sortOn(this.searchUserGroups,'groupName')
          });        
      })
    }
    applyFilter() {
        let val = this.privilegeForm.value.searchUser;
        if (this.selected == 'all') {
            this.userGroupData.limitReached = false;
            this.userData.limitReached = false;
            this.userGroupData.connect(val);
            this.userData.connect(val);
        }
        else if (this.selected == 'users') {
            this.userData.limitReached = false;
            this.userData.connect(val);
        }
        else if (this.selected == 'groups') {
            this.userGroupData.limitReached = false;
            this.userGroupData.connect(val);
        }
    }

    selectChangeHandler(event: any) {
        this.selected = event.target.value;
    }


    _userDetails(e, user) {
        user['mail'] = user['mail'].toLowerCase();
        let index = this.userDetailsArr.findIndex(x => x.mail == user.mail)
        if (user.checked == true) {
            if (index != -1)
                this.userDetailsArr[index]['checked'] = true;
            else
                this.userDetailsArr.push(user)

        }
        else {
            if (index == -1) {
                user['checked'] = false;
                this.userDetailsArr.push(user);
            } else
                this.userDetailsArr.filter(el => {
                    if (el.mail == user.mail)
                        el.checked = false;
                })
        }
    }

    _userGroupDetails(ug, userGroup) {
        let index = this.usergroupDetailsArr.findIndex(x => x.id == userGroup.id);
        if (userGroup.checked == true) {
            if (index != -1)
                this.usergroupDetailsArr[index]['checked'] = true;
            else
                this.usergroupDetailsArr.push(userGroup)
        }
        else {
            if (index == -1) {
                userGroup['checked'] = false
                this.usergroupDetailsArr.push(userGroup)
            } else
                this.usergroupDetailsArr.filter(el => {
                    if (el.id == userGroup.id)
                        el.checked = false;
                });
        }
    }

    userGroupDialog(usergrp) {
        this.userService.getGroupUserList(usergrp.id).then((res) => {
            let userlistarr = res.local.usergrps.value.map(user => { return user.displayName });
            if (userlistarr.length > 0) {
                this.dialog.open(listdialogComponent, {
                    width: '32%',
                    data: {
                        listHeader: 'Privilege Group',
                        listdata: userlistarr
                    }
                })
            } else {
                this.snackBar.openSnackBar('No users assigned to this group');
            }
        });
    }


    ngAfterViewInit(): void {
        /**
         *  constructor is called to update the array with new data.
         */
        this.scrollDispatcher.scrolled().subscribe(event => {
            if (event['elementRef']['nativeElement']['id'] == 'userGroupId') {
                if (this.userGroupData.limitReached)
                    return;
                this.userGroupData.update();
            }
            else if (event['elementRef']['nativeElement']['id'] == 'userId') {
                if (this.userData.limitReached)
                    return;
                this.userData.update();
            }
        });

    }

    userChecked(e, user) {
      this.searchedUser.forEach(el => {
        if (el.mail === user.mail) {
          el.isActive = e.checked;
        }
      });
    }

    searchUser(){
      this.searchedUser = [];
      this.backendService.searchUser(this.searchUserName).then(res => {
        if (res.length > 0) {
          res.forEach(el => {
            if(el.userPrincipalName.includes('ingredion.com')){             
              let tempObj = {};
              tempObj['mail'] = el.mail;
              tempObj['isActive'] = false;
              tempObj['userPrincipalName'] = el.userPrincipalName;
              tempObj['mobilePhone'] = el.mobilePhone;
              tempObj['officeLocation'] = el.officeLocation;
              tempObj['displayName'] = el.displayName;
              tempObj['givenName'] = el.givenName;
              tempObj['surname'] = el.surname;
              tempObj['preferredLanguage'] = el.preferredLanguage;
              tempObj['AlreadyAdded'] = this.checkifUserAdded(el);
              this.searchedUser.push(tempObj);
            }
          });
        }
      })
    }

    checkifUserAdded(searchedData){
      let counter = 0;
      this.selectedSearchedUser.forEach(element => {
        if(element.mail === searchedData.mail){
         counter ++;         
        }
      });     
      if(counter > 0)  
      {
        return true;
      }
      else{
        return false;
      }
    }

    onSingleAdd(index) {
      this.searchedUser[index].isActive = true;
      this.selectedSearchedUser.push(this.searchedUser[index]);
      this.searchedUser.splice(index, 1);
      this.reduce();
    }

    onAdd() {
      let temp = [];
      this.searchedUser.forEach(el => {
        if (el.isActive == true) {
          this.selectedSearchedUser.push(el);
        } else {
          temp.push(el)
        }
      })
      this.searchedUser = temp;
      this.reduce();
    }

    onRemove() {
      let temp = [];
      let temp1 = [];
      this.selectedSearchedUser.forEach(el => {

        if (el.isActive == true) {
          temp.push(el)
        } else {
          temp1.push(el);
          this.searchedUser.push(el);
        }
      })
      this.selectedSearchedUser = temp;

      this.tempSelectedUserData = [...temp];
      this.reduceUnselectedUser()
    }

    onSingleRemove(index) {
      this.selectedSearchedUser[index].isActive = false;
      this.onRemove();
    }

    selectedUserChecked(e, user) {
      this.selectedSearchedUser.forEach(el => {
        if (el.mail === user.mail) {
          el.isActive = !e.checked;
        }
      });
    }

    reduce() {
      let res = [];
      this.selectedSearchedUser.map((item) => {
        var existItem = res.find(x => x.mail == item.mail);
        if (existItem)
          console.log("item already exist");
        else
          res.push(item);
      });
      this.selectedSearchedUser = res;
      this.tempSelectedUserData = [...res];
    }

    searchUserGroupsfunc(){
      if(this.searchUserGroupText== ""){
        this.getAllUserGroup()
        return;
      }
      this.searchUserGroups=[];
      let params={groupNameSearch:this.searchUserGroupText}
      this.backendService.getUserGroup(params).subscribe(res=>{
        // this.searchUserGroups=res.data;
        if (res.length > 0) {
          res.data.forEach(el => {
            let tempObj = {};
            tempObj['categoryId'] = el.categoryId;
            tempObj['categoryName'] = el.categoryName;
            tempObj['createdByEmail'] = el.createdByEmail;
            tempObj['createdByName'] = el.createdByName;
            tempObj['createdTime'] = el.createdTime;
            tempObj['groupId'] = el.groupId;
            tempObj['groupName'] = el.groupName;
            tempObj['isActive'] = false;
            tempObj['resourceGroup'] = el.resourceGroup;
            tempObj['updatedByEmail'] = el.updatedByEmail;
            tempObj['updatedByName'] = el.updatedByName;
            tempObj['updatedTime'] = el.updatedTime;
            tempObj['users'] = el.users;
            tempObj['AlreadyAdded'] = this.checkifUserGroupAdded(el);;
            this.searchUserGroups.push(tempObj);
            this.sortOn(this.searchUserGroups,'groupName')
          });
        }
      })
    }

    sortOn (arr, prop) {
      arr.sort (
          function (a, b) {
              if (a[prop] < b[prop]){
                  return -1;
              } else if (a[prop] > b[prop]){
                  return 1;
              } else {
                  return 0;   
              }
          }
      );
  }
    
    checkifUserGroupAdded(searchedData){
      let counter = 0;
      this.selectedUserGroup.forEach(element => {
        if(element.groupName === searchedData.groupName){
         counter ++;         
        }
      });   
      if(counter > 0)  
      {
        return true;
      }
      else{
        return false;
      }
    }

    userGroupChecked(e, i){
      this.searchUserGroups[i].isActive=e.checked;
    }

    onSingleUserGroupAdd(index){
      this.searchUserGroups[index].isActive = true;
      this.selectedUserGroup.push(this.searchUserGroups[index]);
      this.searchUserGroups.splice(index, 1);
      this.reduceUserGroup();
    }

    reduceUserGroup() {
      let res = [];
      this.selectedUserGroup.map((item) => {
        var existItem = res.find(x => x.groupId == item.groupId);
        if (existItem)
          console.log("item already exist");
        else
          res.push(item);
      });
      this.selectedUserGroup = res;
      this.tempSelectedUserGroup =[...res];
    }

    onAddUserGroup(){
      let temp = [];
      this.searchUserGroups.forEach(el => {
        if (el.isActive == true) {
          this.selectedUserGroup.push(el);
        } else {
          temp.push(el)
        }
      })
      this.searchUserGroups = temp;
      this.reduceUserGroup();
    }

    onSingleRemoveUserGroup(index){
      this.selectedUserGroup[index].isActive = false;
      this.onRemoveUserGroup();
    }

    onRemoveUserGroup(){
      let temp = [];
      let temp1 = [];
      this.selectedUserGroup.forEach(el => {
        if (el.isActive == true) {
          temp.push(el)
        } else {
          temp1.push(el);
          this.searchUserGroups.push(el);
        }
      })
      this.selectedUserGroup = temp;

      this.tempSelectedUserGroup = [...temp];
      this.reduceUnselectedUserGroup()
    }

    selectedUserGroupChecked(e,userGroup){
      this.selectedUserGroup.forEach(el => {
        if (el.groupId === userGroup.groupId) {
          el.isActive = !e.checked;
        }
      });
    }

    searchSelectedUser(){
      this.selectedSearchedUser = [...this.tempSelectedUserData];
      let temp = []
        this.selectedSearchedUser.forEach( el => {
          let tempDispName = el.displayName.toUpperCase();
          let tempSearch = this.searchSelectedUserName.toUpperCase()
          if(tempDispName.includes(tempSearch)){
            temp.push(el);
          }
        });
        this.selectedSearchedUser = temp;
    }
    searchSelectedUserGroup(){
      this.selectedUserGroup = [...this.tempSelectedUserGroup];
      let temp = []
        this.selectedSearchedUser.forEach( el => {
          let tempDispName = el.displayName.toUpperCase();
          let tempSearch = this.searchSelectedUserGroupName.toUpperCase()
          if(tempDispName.includes(tempSearch)){
            temp.push(el);
          }
        });
        this.selectedUserGroup = temp;
    }
    reduceUnselectedUserGroup(){
      this.searchUserGroupsfunc();
      let res = [];
      this.searchUserGroups.map((item) => {
        var existItem = res.find(x => x.groupId == item.groupId);
        if (existItem)
          console.log("item already exist");
        else
          res.push(item);
      });
      this.searchUserGroups = res;
    }

    reduceUnselectedUser(){
      this.searchUser();
      let res = [];
      this.searchedUser.map((item) => {
        var existItem = res.find(x => x.mail== item.mail);
        if (existItem)
          console.log("item already exist");
        else
          res.push(item);
      });
      this.searchedUser = res;
    }
}


/**
 * New Data Source for cdk scroll.
 */
export class MyDataSource extends DataSource<Groups> {

    private groups: Groups[];
    private dataStream = new BehaviorSubject<Groups[]>([]);
    limitReached = false;
    private skipToken;
    filter;
    currentGroups = [];
    constructor(private api: dmsusers, private size: Number) {
        super();
    }

    connect(collectionViewer: CollectionViewer) {
        this.filter = (collectionViewer && typeof collectionViewer != 'object') ? `startswith( displayname, '${collectionViewer}')` : '';
        this.api.getUserGroups(this.size, this.filter)
            .then((res) => {
                this.groups = res.local.userGroups.value;

                // To patch for current groups
                this.groups = this.groups.map(el => {
                    if (this.currentGroups.includes(el['id']))
                        el['checked'] = true;
                    else
                        el['checked'] = false;
                    return el;
                });
                if (res.local.userGroups["@odata.nextLink"]) {
                    this.skipToken = res.local.userGroups["@odata.nextLink"].split('$skiptoken=')[1];
                } else {
                    this.limitReached = true;
                }
                this.dataStream.next(this.groups);
            });
        return this.dataStream;
    }
    update() {
        this.limitReached = true;
        this.api.getUserGroups(this.size, this.filter, this.skipToken)
            .then((res) => {
                // To patch for current groups
                res.local.userGroups.value.forEach(el => {
                    if (this.currentGroups.includes(el['id']))
                        el['checked'] = true;
                    else
                        el['checked'] = false;
                });
                this.groups = this.groups.concat(res.local.userGroups.value);


                if (res.local.userGroups["@odata.nextLink"]) {
                    this.skipToken = res.local.userGroups["@odata.nextLink"].split('$skiptoken=')[1];
                    this.limitReached = false;
                } else {
                    this.limitReached = true;
                    this.skipToken = null;
                }
                this.dataStream.next(this.groups);
            });
    }
    disconnect(): void {
    }

}

export class Groups {
    displayName: string;
}

export class UserDataSource extends DataSource<Users> {
    private dataStream = new BehaviorSubject<Users[]>([]);
    limitReached = false;
    private skipToken;
    filter;
    private users: Users[];
    private data = new BehaviorSubject<Users[]>([]);
    searchText;
    currentUsers = [];


    constructor(private api: dmsusers, private size: Number) {
        super();
    }

    connect(collectionViewer) {
        this.filter = (collectionViewer && typeof collectionViewer != 'object') ? `startswith( displayname, '${collectionViewer}')` : '';
        this.api.getUser(this.size, this.filter)
            .then((res) => {
                this.users = res.local.users.value;

                // To patch for current users
                this.users = this.users.map(el => {
                    if (el['mail'])
                        if (this.currentUsers.includes(el['mail'].toLowerCase()))
                            el['checked'] = true;
                        else
                            el['checked'] = false;
                    return el;
                });
                if (res.local.users["@odata.nextLink"]) {
                    this.skipToken = res.local.users["@odata.nextLink"].split('$skiptoken=')[1];
                } else {
                    this.limitReached = true;
                }
                this.dataStream.next(this.users);
            });
        return this.dataStream;
    }
    update() {
        this.limitReached = true;
        this.api.getUser(this.size, this.filter, this.skipToken)
            .then((res) => {

                // To patch for current users
                res.local.users.value.forEach(el => {
                    if (el['mail'])
                        if (this.currentUsers.includes(el['mail'].toLowerCase()))
                            el['checked'] = true;
                        else
                            el['checked'] = false;
                });
                this.users = this.users.concat(res.local.users.value);
                if (res.local.users["@odata.nextLink"]) {
                    this.skipToken = res.local.users["@odata.nextLink"].split('$skiptoken=')[1];
                    this.limitReached = false;
                } else {
                    this.limitReached = true;
                    this.skipToken = null;
                }
                this.dataStream.next(this.users);
            });
    }
    disconnect(): void {
    }

}

export class Users {
    displayName: string;
}
