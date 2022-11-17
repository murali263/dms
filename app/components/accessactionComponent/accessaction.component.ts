import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms';
import { NSnackbarService } from 'neutrinos-seed-services';
import { genericService } from '../../services/generic/generic.service';
import { MatStepper } from '@angular/material';
import { backendService } from '../../services/backend/backend.service';
import { backend } from '../../sd-services/backend';
import { Router, ActivatedRoute } from '@angular/router';
import { accessfeatureComponent } from "../accessfeatureComponent/accessfeature.component";
import { accessgroupsComponent } from "../accessgroupsComponent/accessgroups.component";
import { accessprivilegeComponent } from "../accessprivilegeComponent/accessprivilege.component";
import sidenavConfig from '../../../assets/DMS-config/sidenav.json';

@Component({
    selector: 'bh-accessaction',
    templateUrl: './accessaction.template.html',
    styleUrls: ['./accessaction.component.scss']
})

export class accessactionComponent implements OnInit {

    @ViewChild('accessFolder', { static: true }) accessFolder: accessprivilegeComponent;
    @ViewChild('accessGroups', { static: true }) accessGroups: accessgroupsComponent;
    @ViewChild('accessFeature', { static: true }) accessFeature: accessfeatureComponent;
    @ViewChild('stepper', { static: false }) stepper: MatStepper;
    currentGroup
    stepperIndex = 0;
    groupName;

    userGroupResult = [];
    userResult = [];

    editFSArray = [];
    editResourceObj;
    currentUUid;

    currentGrpId;

    // Current Action values ['create' , 'edit']
    currentAction = 'create'
    formValidationMessages = {
        name: {
            disp: 'Name',
            required: 'name is required'
        },
        accessPrivilege: {
            disp: 'AccessPrivilege',
            required: 'name is required'
        },
        accessGroups: {
            disp: 'AccessGroups',
            required: 'name is required'
        }
    }
    constructor(private fb: FormBuilder,
        private snackbar: NSnackbarService,
        private genericService: genericService,
        private backendService: backendService,
        private backend: backend,
        private router: Router,
        private route: ActivatedRoute) {




    }

    ngOnInit() {
        this.accessFeature.features.forEach(el => {
            if (el.key != 'documents_view')
                el.checked = false;
        });

        let grpObj = this.route.snapshot.queryParamMap.get('groupObj');
        if (grpObj)
            this.handleUpdateEvents(JSON.parse(atob(grpObj)));
    }

    storeData() {
        this.currentUUid = this.currentUUid || this.genericService.generateUUID();

        // Action to be performed on privilege creation
        if (this.currentAction == 'create'){
            this._updateFolderAccess(this.currentUUid).then(res => {
                this.snackbar.openSnackBar('Created resource group');
                this.resetSteps();
                this.router.navigate(['/home/accessAction/groups']);
            });
        // Action to be performed on privilege update
         } else
            this._updateFolderAccess(this.currentGrpId).then(res => {
                this.snackbar.openSnackBar('Updated resource');
                this.resetSteps();
                this.router.navigate(['/home/accessAction/groups']);
            });

    }

    //Step actions on stepper next button click
    nextStep(step) {
        let pattern = /^[a-zA-Z0-9-][a-zA-Z0-9- ]*$/
        switch (step) {
            case 0: if (this.groupName.match(pattern)) {
                if (this.currentAction == 'create' && this.groupName == 'DMS Super User Group') {
                    this.snackbar.openSnackBar('Group name cannot be ' + this.groupName);
                    return false;
                }
                // Check  whether the duplicate group name exists
                this.backend.getResourceData({ name: this.groupName }, { name: 1 }).then(res => {
                    if (res.local.res.length > 0 && this.currentAction == 'create') {
                        this.snackbar.openSnackBar('Group Name already exist');
                        return false;
                    } else {
                        if (this.currentAction == 'create') {
                            // this.resetSteps();
                        }
                        this.stepperIndex = 1;
                        return true;
                    }
                });
                return false;
            } else {
                this.snackbar.openSnackBar('Please enter the  valid group name');
                return false;
            }

            case 1: this.stepperIndex = 2; return true;
            case 2: let hasAccess = this.accessFolder['fsTree'].fsArr.find(x => x['checkedR'] || x['checkedRW']);
                if (hasAccess) {
                    this.stepperIndex = 3;
                    return true;
                } else {
                    this.snackbar.openSnackBar('Please assign permission to atleast one folder');
                    return false;
                }
            case 3: this.storeData();
        }
    }


    /**
     * To assign Folder Access
     * @param uuid - Current UUID
     * @param grpName  - Current Group name
     */
    _assignFolderAccess(uuid, grpName) {

        let readAccessArr = this.accessFolder.readAccessT.filter(val => !this.accessFolder.writeAccessT.includes(val));

        // Read Access Object
        let reqRBody = {
            privilegegroup: readAccessArr,
            grpAccess: {
                "name": grpName,
                "groupId": uuid,
                "read": true,
                "write": false
            }
        }

        // Read-Write Access Object
        let reqRWBody = {
            privilegegroup: this.accessFolder.writeAccessT,
            grpAccess: {
                "name": grpName,
                "groupId": uuid,
                "read": true,
                "write": true
            }
        }

        let arr = [];

        arr.push(new Promise((resolve, reject) => {
            return this.backend.updateFolderFS(reqRBody).then((res) => {
                return resolve(res);
            });
        }));

        arr.push(new Promise((resolve, reject) => {
            return this.backend.updateFolderFS(reqRWBody).then((res) => {
                return resolve(res);
            });
        }));

        arr.push(this._assignUserGroups(uuid, grpName));
        return Promise.all(arr);
    }

    /**
     * To Assign User groups
     * @param uuid - Current UUID
     * @param grpName - Current Group name
     */
    _assignUserGroups(uuid, grpName) {
        let featureArr = this.accessFeature.features.filter(el => el.checked == true);
        let userDetailsArr=[];

        let userGroupDetailsArr=[];        
        this.accessGroups.tempSelectedUserGroup.forEach(userGroup=>[
          userGroupDetailsArr.push(userGroup.groupId)
        ])
        let reqObj = {
            "action": (this.currentAction=="create"? "create":"update"),
            "name": grpName,
            "groupId": (this.currentAction == 'create' ? uuid : this.currentGrpId),
            "feature": featureArr,
            "members": {
                // "users": this.accessGroups.userArr,
                // "user_groups": this.accessGroups.userGroupArr,
                "users": this.accessGroups.tempSelectedUserData,
                "user_groups": userGroupDetailsArr
            },
            "userEmail":localStorage.getItem('email'),
            "userName":localStorage.getItem('displayName')
        }
        return new Promise((resolve, reject) => {
            return this.backendService.createUpdatePrivilegeGroup(reqObj).then((res)=>{
              return resolve(res)
            })
            // if (this.currentAction == 'create')
            //     return this.backend.createResourceGroup(reqObj).then((res) => {
            //         return resolve(res);
            //     });
            // else
            //     return this.backend.updateResourceFS(reqObj).then((res) => {
            //         return resolve(res);
            //     });
        });

    }

    previousStep(){
      this.stepperIndex--;
      if(this.stepperIndex<0){
        this.stepperIndex=0;
      }
    }

    /**
     * Creates access update objects for folders an resource groups
     */
    _updateFolderAccess(groupId) {
        let arr = [];
        // Read Access True Object
        let rtObj = {
            accessArr: this.accessFolder.readAccessT,
            key: 'read',
            value: true,
            groupId: groupId
        }
        if (this.accessFolder.readAccessT.length > 0)
            arr.push(this._updateAccessFS(rtObj));

        // Read Access False Object
        let rfObj = {
            accessArr: this.accessFolder.readAccessF,
            key: 'read',
            value: false,
            groupId: groupId

        }
        if (this.accessFolder.readAccessF.length > 0)
            arr.push(this._updateAccessFS(rfObj));

        // Write Access True Object
        let wtObj = {
            accessArr: this.accessFolder.writeAccessT,
            key: 'write',
            value: true,
            groupId: groupId

        }
        if (this.accessFolder.writeAccessT.length > 0)
            arr.push(this._updateAccessFS(wtObj));

        // Write Access False Object
        let wfObj = {
            accessArr: this.accessFolder.writeAccessF,
            key: 'write',
            value: false,
            groupId: groupId

        }
        if (this.accessFolder.writeAccessF.length > 0)
            arr.push(this._updateAccessFS(wfObj));

        arr.push(this._assignUserGroups(this.currentUUid, this.groupName));
        return Promise.all(arr);

    }


    _updateAccessFS(updateFSObj) {
        let reqObj = {
            groupId: this.currentGrpId,
            name: this.groupName,
            ...updateFSObj
        }
        return new Promise((resolve, reject) => {
            return this.backend.updateFolderFS(reqObj).then(res => {
                return resolve(res);
            });
        });
    }

    /**
     *
     * @param groupId : Privilege groupId
     */
    handleUpdateEvents(groupObj) {
        this.currentAction = 'edit';
        this.currentGrpId = groupObj['groupId'];
        if (this.currentAction == 'edit' && this.currentGrpId && this.currentGrpId == 'super_user')
            this.stepperIndex = 3;
        let params={groupId: groupObj['groupId']};
        this.backendService.getResourceGroupMod(params).then(res=>{
          this._initiateResourceUpdateSteps(res['data'][0]);
        })
        // this.backend.getResourceGroups(1, 10, {}, { groupId: groupObj['groupId'] }).then(res => {
        //   console.log("here",res)
        //     this._initiateResourceUpdateSteps(res.local.res['data'][0]);
        // });
    }

    /**
     *
     * @param editResourceObj : Resource Object
     */
    _initiateResourceUpdateSteps(editResourceObj) {
        this.groupName = editResourceObj['name'] || '';
        this.accessFeature.features = this.accessFeature.features || sidenavConfig.sidenav;
        let featureArr = editResourceObj['feature'].map(el => { return el['key'] });
        this.accessFeature.features.forEach((el, ind) => {
            if (featureArr.includes(el.key))
                el.checked = true;
        })

        this.accessGroups.userGroupArr = editResourceObj.userGroups.map(el => { return el.displayName });

        this.accessGroups.userGroupData['groups'] && this.accessGroups.userGroupData['groups'].filter(el => {
            if (this.accessGroups.userGroupArr.includes(el.displayName))
                el['checked'] = true;
        });

        this.accessGroups.userArr = this.accessGroups.userData.currentUsers = editResourceObj.users.map(el => { return el.mail.toLowerCase() });
        this.accessGroups.userGroupArr = this.accessGroups.userGroupData.currentGroups = editResourceObj.userGroups.map(el => { return el['id'] });
        this.accessGroups.userDetailsArr = editResourceObj.users.map(el=>{el['checked']=true;return el;});
        this.accessGroups.usergroupDetailsArr = editResourceObj.userGroups.map(el=>{el['checked']=true;return el;});
        this.accessGroups.selectedSearchedUser= editResourceObj.users.map(el=>{el['checked']=true;el["isActive"]=true; return el;});
        this.accessGroups.tempSelectedUserData=editResourceObj.users.map(el=>{el['checked']=true;el["isActive"]=true; return el;});
        this.accessGroups.selectedUserGroup= editResourceObj.userGroups.map(el=>{el['checked']=true;
                                                                                 el["groupName"]=el["displayName"];
                                                                                 el["groupId"]=el["id"];el["isActive"]=true; return el;});

        this.accessGroups.selectedUserGroup.forEach(((userGroup,i)=>{
          let index=this.accessGroups.searchUserGroups.findIndex(grp=>grp["groupId"]==userGroup["groupId"])
          if(index>-1){
            this.accessGroups.searchUserGroups.splice(index,1)
          }
        }))

    }

    //Resets steps assigned data
    resetSteps() {
        this.stepper.reset();
        this.stepperIndex = 0;
        this.accessFeature.features.forEach(el => {
            if (el.key != 'documents_view')
                el.checked = false;
        });
        this.router.navigate([`home/accessAction/groups`]);
    }
}
