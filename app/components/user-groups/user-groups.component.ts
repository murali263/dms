import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { backendService } from 'app/services/backend/backend.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {

  stepperIndex = 0;
  groupName: string;
  category;
  searchUserVal: string;
  selectedUserVal: string;
  userData = [];
  selectedUserData = [];
  tempSelectedUserData = [];
  categories = [];
  isValid: boolean = false;
  isExist: boolean = false;
  groupId;
  isEdit : boolean = false;
  tempGroupName: string = '';

  constructor(
    private backendService: backendService,
    private route: Router,
    private activatedRout: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getCategories();
    this.activatedRout.queryParams.subscribe((params: any) => {
      if (params["groupId"]) {
        this.groupId = parseInt(params["groupId"]);
        this.isEdit = true;
        this.onEdit();
      }
    })
  }

  getCategories() {
    this.backendService.getCategoryList().subscribe(res => {
      this.categories = res.data
    })
  }

  
  onEdit(){
    this.backendService.checkDuplicateUserGroup({groupId: this.groupId}).subscribe( res => {
      
      let groupData = res.data[0];
      this.category = groupData.categoryId;
      this.groupName = groupData.groupName;
      this.tempGroupName = this.groupName;
      this.selectedUserData = groupData.users;
      this.tempSelectedUserData = groupData.users;
    })
  }

  nextStep(step) {
    this.isValid = false;
    this.isExist = false;
    let pattern = /^[a-zA-Z0-9-][a-zA-Z0-9- ]*$/
    if (step == 0) {
      if (this.groupName.match(/^\s*$/)) {
        this.isValid = true;
        return true
      } else if (this.groupName.match(pattern)) {
        this.backendService.checkDuplicateUserGroup({ groupName: this.groupName }).subscribe(res => {
          
          if(res.data.length == 0){
            this.stepperIndex = 1;
            return true;
          }else if(this.isEdit && this.tempGroupName == this.groupName){
            this.stepperIndex = 1;
            return true;
          }else{
            this.isExist = true;
            return true;
          }
        })
      }else{
        this.isValid = true;
        return true;
      }
    } else {
      this.stepperIndex = 0;
      return true;
    }

  }

  userChecked(e, user) {
    this.userData.forEach(el => {
      if (el.mail === user.mail) {
        el.isActive = e.checked;
      }
    });
  }

  onAdd() {
    let temp = [];
    this.userData.forEach(el => {
      if (el.isActive == true) {
        this.selectedUserData.push(el);
      } else {
        temp.push(el)
      }
    })
    this.userData = temp;
    this.reduce();
  }

  onSingleAdd(index) {
    this.userData[index].isActive = true;
    this.selectedUserData.push(this.userData[index]);
    this.userData.splice(index, 1);
    this.reduce();
  }

  reduce() {
    let res = [];
    this.selectedUserData.map((item) => {
      var existItem = res.find(x => x.mail == item.mail);
      if (existItem)
        console.log("item already exist");
      else
        res.push(item);
    });
    this.selectedUserData = res;
    this.tempSelectedUserData = res;
  }

  selectedUserChecked(e, user) {
    this.selectedUserData.forEach(el => {
      if (el.mail === user.mail) {
        el.isActive = !e.checked;
      }
    });
  }
  onRemove() {
    let temp = [];
    let temp1 = [];
    this.selectedUserData.forEach(el => {
      if (el.isActive == true) {
        temp.push(el)
      } else {
        temp1.push(el);
        this.userData.push(el);
      }
    })
    this.selectedUserData = temp;
    let temp2 = []
    this.tempSelectedUserData.forEach( (item) => {
      var eItem = temp1.find( x => x.userPrincipalName == item.userPrincipalName);
      if(eItem){
      }else{
        temp2.push(item)
      }
    })
    this.tempSelectedUserData = temp2;
    this._searchUser();
  }

  onSingleRemove(index) {    
    this.selectedUserData[index].isActive = false;
    this.onRemove();
    // this.userData.push(this.selectedUserData[index]);
    // this.selectedUserData.splice(index, 1);
    // this.tempSelectedUserData.splice(index, 1);
  }

  _searchSelectedUser(){
    let temp = [];
      if(this.selectedUserVal.match(/^\s*$/)){
        this.selectedUserData = this.tempSelectedUserData;
        return true;
      } else {
        this.selectedUserData.forEach( el => {
          let tempDispName = el.displayName.toUpperCase();
          let tempSearch = this.selectedUserVal.toUpperCase()
          if(tempDispName.includes(tempSearch)){
            temp.push(el);
          }
        });
        this.selectedUserData = temp;
      }
    
  }

  _searchUser() {
    this.userData = [];
    this.backendService.searchUser(this.searchUserVal).then(res => {
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
            tempObj['AlreadyAdded'] = this.checkifAdded(el);
            this.userData.push(tempObj);
          }
        });
      }
    })
  }
  checkifAdded(searchedData){
    let counter = 0;
    this.selectedUserData.forEach(element => {
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

  onCreate() {
    let tempObj = {}
    tempObj['groupName'] = this.groupName;
    tempObj['categoryId'] = this.category;
    tempObj['users'] = this.selectedUserData;
    this.categories.forEach(el => {
      if (el.categoryId == this.category) {
        tempObj['categoryName'] = el.categoryName;
      }
    });
    if(this.isEdit){
      tempObj['groupId'] = this.groupId;
      tempObj['updatedByName'] = localStorage.getItem('email')
      tempObj['updatedByEmail'] = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
      tempObj['action'] = "update"
    }else{
      tempObj['createdByName'] = localStorage.getItem('email')
      tempObj['createdByEmail'] = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
      tempObj['action'] = "create"
    }
    this.backendService.saveUserGroup(tempObj).subscribe(res => {
      if(res.success){
        this.userData = [];
        this.selectedUserData = [];
        this.tempSelectedUserData = [];
        this.groupName = '';
        this.category = '';
        //list page
        this.route.navigate(['home/user-groups']);
      }
    })
  }

  onCancel(){
    // list page
    this.route.navigate(['home/user-groups']);
  }

}
