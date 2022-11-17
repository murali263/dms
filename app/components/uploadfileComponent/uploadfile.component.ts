
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { backend } from '../../sd-services/backend';
import { backendService } from '../../services/backend/backend.service';
import { NSnackbarService, NLocalStorageService } from 'neutrinos-seed-services';
import { genericService } from '../../services/generic/generic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { approvalsection } from '../../sd-services/approvalsection';
import { MatAutocompleteTrigger, MatDialog, MatChipInputEvent, MatSelect } from '@angular/material';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'bh-uploadfile',
    templateUrl: './uploadfile.template.html',
    styleUrls: ['./uploadfile.component.scss']
})

export class uploadfileComponent implements OnInit, OnDestroy {
    @ViewChild('autoTriggerLvl1', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl1: MatAutocompleteTrigger;

    @ViewChild('autoTriggerLvl2', { read: MatAutocompleteTrigger, static: true }) autoTriggerLvl2: MatAutocompleteTrigger;
    
    @ViewChild('autoTriggerDocOwner', { read: MatAutocompleteTrigger, static: true }) autoTriggerDocOwner: MatAutocompleteTrigger;
    
    @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

    protected _onDestroy = new Subject<void>();

    uploaddetails: FormGroup = this.formdetail.group({});
    fileObj;
    docSubmitted: boolean = false;
    docTypeData;
    businessDivisionData;
    SMBData;
    regionData;
    languageData;
    docType;
    // collectionName;
    userList1 = [];
    userList2 = [];
    fsuuid = "";
    hasNonApprovalAccess;
    approval1Selected: boolean = false;
    approval2Selected: boolean = false;
    minDate = new Date();
    caldate = new Date();
    // privilegegroupArr = [{
    //     name: "Root",
    //     groupId: "groupId",
    //     read: true,
    //     write: true
    // }]
    currentVersion;
    currentAction;
    currentUUID;
    currentUser: String;
    notespattern = /^[a-zA-Z0-9#&%!.@()^_+-\s\*\$\?\,\:\'\;\=\|<\>\[\]\"\{}\~\`\/]*$/;
    filenamepattern = /^[^\/:*?"<>|#{}%~&']+$/
    fsData;

    retainBack: boolean = false;

    folderList = [];
    selectedFolderList = [];
    selectedFolders: any = [];
    searchFolderValue;
    // pageSize = 5;
    // pageNumber = 1;
    // enableLoadMore: boolean = true;
    metadata;
    metadataValues;
    valuesMap: any = {};
    FTvalueId;
    valuesMapFiltered: any = {};
    editFileData;
    public filteredList: any = [];
    month: any;
    date: any;
    public newFolderList: any = [];

    // filteredOwners: Observable<string[]>;
    searchOwners: Array<any> = [];

    visible = true;
    // selectable = false;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [];
    selectedOwners: any = [];
    selected: boolean = false;
    public currentUserInfo: String;
    dropDownctrl = new FormControl('');
    selectedconfigids: any = [];
    selectedadOwners: any = {};

    searchadOwners: Array<any> = [];
    public subject = new Subject<boolean>()
    selectaduser = [];
    filteredadOwners = [];
    selectedMultipleFolders:any;

    //metaconfigbusiness
    businessDepartments:any[];
    metaBussId = [];
    selectedBD:number = null;
    businessDepartment:any;


    constructor(private formdetail: FormBuilder,
        private snackbar: NSnackbarService,
        private backendservice: backendService,
        private backend: backend,
        public genericService: genericService,
        private router: Router,
        private dmsconfiguration: dmsconfiguration,
        public activeRoute: ActivatedRoute,
        private approvalService: approvalsection,
        public dialog: MatDialog,
        private nLocalStorage: NLocalStorageService) {
              
             //metaconfigbusiness
              if (this.activeRoute.snapshot.url[1].path === 'editfile') {
                let businessDeptId = this.activeRoute.snapshot.queryParamMap.get('businessDept')
                this.selectedBD = Number(businessDeptId);
            }
            
            this._buildForm(this.selectedBD);
            
            // this._buildForm(this.selectedBD )
        let filter = this.nLocalStorage.getValue('filter');

        if (filter) {
            this.backendservice.currentFolder = JSON.parse(decodeURIComponent(atob(filter)))
            let currenFolders: any = {};
            currenFolders.uuid = this.backendservice.currentFolder.uuid,
                currenFolders.fsuuid = this.backendservice.currentFolder.fsuuid,
                currenFolders.name = this.backendservice.currentFolder.name,
                currenFolders.path = this.backendservice.currentFolder.path,
                currenFolders.logicalPath = this.backendservice.currentFolder.logicalPath,
                currenFolders.checked = this.backendservice.currentFolder.checked,
                currenFolders.objectPath = this.backendservice.currentFolder.objectPath,
                this.selectedFolderList.push(currenFolders);
        }


    }


    formValidationMessages = {
        documentName: {
            disp: 'Document Name',
            required: 'Document Name is required'
        },
        // documentType: {
        //     disp: 'Document Type',
        // },
        // businessDivision: {
        //     disp: 'Business Division',
        // },
        // supplier: {
        //     disp: 'Supplier',
        // },
        // region: {
        //     disp: 'Product',
        // },
        // language: {
        //     disp: 'Language',
        // },
        expiryDate: {
            disp: 'Expiration Date',
        },
    }

    ngOnInit() {
        this.month = this.caldate.toString().split(' ')[1];
        this.date = this.caldate.getDate();
        this.getbddata();
        this.minDate.setDate(new Date().getDate() + 1);
        let configData = this.activeRoute.snapshot.data.configData;
        // console.log("test",configData);
        if (configData.length > 0) {
            this.docTypeData = configData[0]['document_type_configuration'];
            this.businessDivisionData = configData[1]['business_division_configuration'];
            this.SMBData = configData[2]['S_M_B_configuration'];
            this.regionData = configData[3]['region_configuration'];
            this.languageData = configData[4]['language_configuration'];
        }

        let featureAccess = this.activeRoute.snapshot.data.featureAccess['local']['res'];
        this.hasNonApprovalAccess = featureAccess.find(x => x.key == 'non_approval_upload');
        if (this.hasNonApprovalAccess) {
            this.uploaddetails.patchValue({ approvalLvl1Check: false });
            this.genericService.updateValidity(null, ['approvalLvl1Check', 'approverLvl1Control', 'approvalLvl2Check', 'approverLvl2Control'], this.uploaddetails)
        }
        if (this.activeRoute.snapshot.url[1].path === 'editfile')
            this.updateUploadFile();
        this.getCurrentUser();

        this.currentAction = this.activeRoute.snapshot.queryParamMap.get('action');

        this.backend.getUserFolders({ type: 'Folder', fsuuid: { "$ne": this.backendservice.currentFolder.fsuuid } }, { name: 1 }).then(res => {
            this.newFolderList = this.folderList = res.local.res;
            // if(this.selectedMultipleFolders){
            //     let foldersList = this.selectedMultipleFolders

            //     this.newFolderList.forEach(el => {
            //         let checkedStatus = foldersList.find(x => x.uuid == el.uuid);
            //         if (checkedStatus && checkedStatus['checked']) {
            //             el['checked'] = true;
            //         }
            //     });

            // }
          
        });
        // this.autoCompleteOwners();
    }

    getConfigData(id:any) {
        let filterObj = {
            'active': true,
            'visible': true,
            'businessDepartment' : { $elemMatch : {"businessid":id} }
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
            'visible': true,
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

    getCurrentUser() {
        this.currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        // this.backend.curentSession().then((res) => {
        this.currentUser = this.currentUserInfo['username'].toLowerCase() || this.currentUserInfo['username'];

    }
    onUnselectApproval() {
        this.uploaddetails.patchValue({
            approverLvl2Control: ''
        })
    }


    _buildForm(id?:any) {
        this.uploaddetails = this.formdetail.group({
            businessDepartment: new FormControl(this.selectedBD),
            documentName: new FormControl('', [Validators.required, Validators.maxLength(260)]),
            documentOwner: new FormControl([]),
            approvalLvl1Check: new FormControl(true),
            approvalLvl2Check: new FormControl(false),
            expiryDate: new FormControl('', Validators.required),
            approverLvl1Control: new FormControl(''),
            approverLvl2Control: new FormControl(''),
            notes: new FormControl('', [Validators.maxLength(800), Validators.pattern(this.notespattern)]),
            configData: new FormGroup({})
        })


        if (this.activeRoute.snapshot.url[1].path === 'editfile') {
        this.getConfigValues().then((values: any[]) => {
            values.map((el: any) => {
                this.valuesMap[el['_id']] = el['values']
                this.valuesMapFiltered[el['_id']] = el['values']
            })
            this.getConfigData(id).then((metadata: any[]) => {
                this.metadata = metadata;
                const configData = (<FormGroup>this.uploaddetails.get('configData'))
                this.metadata.forEach((control, index) => {
                    const ctrl = new FormControl('')
                    let parent = this.metadata.filter(e => e.parent == control.configId).forEach(el => {
                        ctrl.valueChanges.subscribe((valueId: string) => {
                            const values: any[] = ctrl.value;

                            configData.get(el.configId).reset();
                            this.valuesMapFiltered[el.configId] = this.valuesMap[el.configId].filter(e => values.indexOf(e.parentValueId) != -1);
                        })
                    });
                    if (control.isChildren) {
                        this.valuesMapFiltered[control.configId] = [];
                    }
                    configData.addControl(control.configId, ctrl)
                    // for dropdown filter
                    let dropDownctrl = new FormControl('');
                    configData.addControl(control.name, dropDownctrl)
                    let list = this.valuesMapFiltered[control.configId] || [];

                    this.filteredList[control.configId] = new ReplaySubject<[]>(1);
                    this.filteredList[control.configId].next(list.slice());

                    let subscription = configData.get(control.name).valueChanges
                        .pipe(takeUntil(this._onDestroy))
                        .subscribe(() => {

                            this.Searchfilter(list, control.name, control.configId);
                        });
                    //dropdown filter completed
                    // AD linked dropdowns
                    //console.log(control)
                    if (control.configId) {
                        this.filteredadOwners[control.configId] = new ReplaySubject<[]>(1);
                        this.filteredadOwners[control.configId].next(list.slice());
                        let dropdownsubscription = configData.get(control.configId).valueChanges
                            .pipe(takeUntil(this._onDestroy))
                            .subscribe(() => {
                                if(control.fieldType=='AD'){
                                    this.linkedsearchFilter(list, control.configId, control.configId);
                                }
                                else{
                                    return;
                                }
                                
                            });
                    }
                })
                this.subject.next(true)
                if (this.activeRoute.snapshot.url[1].path === 'editfile') {
                    this.uploaddetails.get('configData').patchValue(this.fsData.configData)
                    let values: any = '';
                    for (let data of this.metadata) {
                        if (data.fieldType == 'FT') {
                            data.value = this.uploaddetails.value.configData[data.configId]
                            values = data.value
                            this.dmsconfiguration.getConfigValues({ 'valueId': values }).then((result: any) => {
                                const configValues = result && result.local && result.local.configValues;
                                if (Array.isArray(configValues) && configValues.length > 0) {
                                    (<FormGroup>this.uploaddetails.get('configData')).get(data.configId).setValue(result.local.configValues[0]['value']);
                                    (<FormGroup>this.uploaddetails.get('configData')).get(data.configId).updateValueAndValidity();
                                }
                            });
                        }
                    }
                }
            })



        });
    }
        this.uploaddetails.controls.documentName.disable();

    }

    updateUploadFile() {
        let fsObject;
        let currentID = this.activeRoute.snapshot.queryParamMap.get('currentID')
        let decodedFilter = JSON.parse(decodeURIComponent(atob(this.nLocalStorage.getValue('id'))));

        if (currentID == 'uuid')
            fsObject = { 'uuid': decodedFilter }
        else
            fsObject = { 'fsuuid': decodedFilter, approvalStatus: 'approved', "hidden": { "$exists": false } }

        this.backend.getResourceFS(fsObject, { timestamp: -1 }).then(res => {
            this.fsData = this.editFileData = res.local.res[0];
            this.selectedMultipleFolders = this.fsData.selectedMultipleFolders;

            //for patching selected FolderList
            let currentFolderIndex = this.fsData.selectedMultipleFolders.findIndex(x => x.fsuuid == this.backendservice.currentFolder.fsuuid);


            if (currentFolderIndex != -1)
                this.fsData.selectedMultipleFolders.splice(currentFolderIndex, 1);
            for (let i = 0; i < this.fsData.selectedMultipleFolders.length; i++) {
                this.selectedFolderList.push(this.fsData.selectedMultipleFolders[i]);

            }

            //for patching Document Owners
            for (let j = 0; j < this.fsData.documentOwner.length; j++) {
                this.selectedOwners.push(this.fsData.documentOwner[j]);
            }

            //ADlined dropdowns patch
            this.subject.subscribe(res => {
                //console.log("second", this.filteredadOwners)
                if (this.fsData.adlinkeddata == undefined) {
                    return
                }
                else {
                    Object.keys(this.fsData.adlinkeddata).forEach(key => {
                        this.fsData.adlinkeddata[key].forEach(async (element) => {
                            element.selected = false;
                            await this.toggleSelectionad(element, key)

                        });
                    })
                }

                Object.keys(this.filteredadOwners).forEach(ele => {
                    this.filteredadOwners[ele].next([])
                })
            })

            //patch the file in edit mode
            let uploadedfile: any = {};
            uploadedfile['fileName'] = this.fsData.fileName;
            uploadedfile['clientContainerName'] = this.fsData.clientContainerName;
            uploadedfile['name'] = this.fsData.name;
            uploadedfile['extension'] = this.fsData.extension;
            this.fileObj = uploadedfile;
            // endof patch the file in edit mode

            this.fsuuid = this.fsData.fsuuid;
            this.currentVersion = this.fsData['version'];
            if (this.fsData.uploadedBy.displayName == "Auto Generated") {
                this.genericService.updateValidity('required', ['businessDivision', 'supplier', 'region', 'language'], this.uploaddetails)
            }
            else {
                this.currentUUID = this.fsData.uuid || null;
                var expDate = new Date(this.fsData.expiryDate);

                if (this.fsData['approvalLevels'][0])
                    this.fsData['approvalLevels'][0].mail = this.fsData['approvalLevels'][0].username;
                if (this.fsData['approvalLevels'][1])
                    this.fsData['approvalLevels'][1].mail = this.fsData['approvalLevels'][1].username;
                this.uploaddetails.patchValue({
                    documentName: this.fsData.name,
                    approvalLvl1Check: this.fsData.approvalLvl1Check,
                    approvalLvl2Check: this.fsData.approvalLvl2Check,
                    expiryDate: expDate,
                    approverLvl1Control: this.fsData['approvalLevels'][0] ? this.fsData['approvalLevels'][0] : '',
                    approverLvl2Control: this.fsData['approvalLevels'][1] ? this.fsData['approvalLevels'][1] : '',
                    notes: this.fsData['notes'],
                    configData: this.fsData.configData
                });

                if (this.hasNonApprovalAccess) {

                    this.uploaddetails.patchValue({
                        // approvalLvl1Check: false,
                        // approvalLvl2Check: true,
                        // approverLvl1Control: '',
                        // approverLvl2Control: ''
                    });
                    this.genericService.updateValidity(null, ['approvalLvl1Check', 'approverLvl1Control', 'approvalLvl2Check', 'approverLvl2Control'], this.uploaddetails)
                } else {
                    this.uploaddetails.patchValue({ approvalLvl1Check: true });
                    this.genericService.updateValidity('required', ['approvalLvl1Check', 'approverLvl1Control'], this.uploaddetails)
                }
            }
        });

    }

    //Function to upload selected file to the server.
    handleFileInput(event) {
        let files = event['target']['files'];
        if (files[0]) {
            let fileName = files[0].name;
            let fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onloadend = (x) => {
                if (files[0].size > 26214400) {
                    this.snackbar.openSnackBar('Document size exceeds the maximum limit of 25mb. Please try again with document less in size')
                } else if (fileName.match(this.filenamepattern) && /(\.png|\.doc|\.jpg|\.jpeg|\.docx|\.html|\.htm|\.odt|\.pdf|\.xls|\.xlsx|\.csv|\.ods|\.ppt|\.pptx|\.txt)$/i.test(files[0].name.substring(files[0].name.lastIndexOf('.')))) {
                    this.uploadFile(files[0], fileName, files[0].name.substring(files[0].name.lastIndexOf('.') + 1), this.backendservice.currentFolder && this.backendservice.currentFolder.path);
                    this.uploaddetails.patchValue({ documentName: fileName });
                } else {
                    this.snackbar.openSnackBar('Upload valid file ')
                }
            }
        }
    }


    /**
     * upload file
     * @param content :content of file
     * @param fileName :name of the file uploaded
     * @param fileextension :file extension
     */
    uploadFile(content, fileName, fileextension, path?, fsuuid?) {

        let filterObj = { type: 'File', trash: false, name: fileName, logicalPath: path, "hidden": { "$exists": false }, "$or": [{ latest: true }, { approvalStatus: "awaiting" }] };

        if (this.activeRoute.snapshot.url[1].path === 'editfile') {
            this.backend.getResourceFS(filterObj).then(res => {
                if ((res.local.res && res.local.res.length > 0 && this.fsData.name != fileName))
                    if (res.local.res.find(el => el['approvalStatus'] == 'awaiting'))
                        this.snackbar.openSnackBar('File with same name is awaiting approval in this folder.');
                    else
                        this.snackbar.openSnackBar('File with same name already exists in this folder.');
                else
                    this.backendservice.uploadfile(content, fileName, fileextension).subscribe(res => {
                        this.fileObj = res as any;
                        this.fileObj['extension'] = fileextension;
                        this.fileObj['name'] = fileName;
                    });

            });
        }
        else {
            this.backend.getResourceFS(filterObj).then(res => {
                if ((res.local.res && res.local.res.length > 0))
                    if (res.local.res.find(el => el['approvalStatus'] == 'awaiting'))
                        this.snackbar.openSnackBar('File with same name is awaiting approval in this folder.');
                    else
                        this.snackbar.openSnackBar('File with same name already exists in this folder.');
                else
                    this.backendservice.uploadfile(content, fileName, fileextension).subscribe(res => {
                        this.fileObj = res as any;
                        this.fileObj['extension'] = fileextension;
                        this.fileObj['name'] = fileName;

                    });

            });
        }

    }

    /**
     * Folder Select Event
     * @param checkStatus
     * @param folderObj
     */
    folderSelection(checkStatus, folderObj) {

        if (checkStatus) {
            let objFolder: any = {}

            objFolder.uuid = folderObj.uuid,
                objFolder.fsuuid = folderObj.fsuuid,
                objFolder.name = folderObj.name,
                objFolder.path = folderObj.path,
                objFolder.logicalPath = folderObj.logicalPath,
                objFolder.checked = folderObj.checked,
                objFolder.objectPath = folderObj.objectPath,
                // objFolder._id = folderObj._id,

                this.selectedFolderList.push(objFolder);


        }

        else {
            let popIndex = this.selectedFolderList.findIndex(x => x.uuid == folderObj['uuid'])
            this.selectedFolderList.splice(popIndex, 1)
        }
    }

    /**
     * Pop action on Folder
     * @param fsItem : Folder Item
     */
    removeFolder(fsItem) {
        let popIndex = this.selectedFolderList.findIndex(x => x.uuid == fsItem.uuid);
        let unCheckedIndex = this.folderList.findIndex(x => x['uuid'] == fsItem.uuid);
        this.selectedFolderList.splice(popIndex, 1);
        if (unCheckedIndex != -1)
            this.folderList[unCheckedIndex]['checked'] = false;
    }

    /**
     * Search Folder event
     */
    searchFolder(searchFolderValue) {
        let val = searchFolderValue;
        let arr1 = [];
        this.folderList.filter(item => {
            if (item['name'].toLowerCase().includes(val)) {
                arr1.push(item)
            }
        })

        this.newFolderList = arr1;


        if (!searchFolderValue) {
            this.newFolderList = this.folderList;
        }

        let oldFolderList = this.folderList;

        this.newFolderList.forEach(el => {
            let checkedStatus = this.folderList.find(x => x.uuid == el.uuid);
            if (checkedStatus && checkedStatus['checked']) {
                el['checked'] = true;
            }
        });

    }




    Searchfilter(filteredlistArr, SearchcontrolName, configId) {
        let configDropdownCtrl = <FormGroup>this.uploaddetails.get('configData');
        // get the search keyword
        let search = configDropdownCtrl.get(SearchcontrolName).value;
        if (!search) {
            this.filteredList[configId].next(filteredlistArr.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        //   filter the Dropdown values
        this.filteredList[configId].next(
            filteredlistArr.filter(c => c.value.toLowerCase().indexOf(search) > -1)

        );
    }


    // <-------------------------ad owner ------------------------->



    //search user filter
    async linkedsearchFilter(filteredlistArr, SearchcontrolName, configId) {

        let configDropdownCtrl = <FormGroup>this.uploaddetails.get('configData');
        // get the search keyword
        let search = configDropdownCtrl.get(SearchcontrolName).value;
        if (!search) {
            this.filteredadOwners[configId].next([]);
            return;
        } else {
            search = search.toString().toLowerCase();
        }

        if (search.length >= 3) {
            this.backendservice.searchUser(search)
                .then((res) => {
                    this.filteredadOwners[configId].next(res)
                })
        }
        else {
            return
        }
    }

    // autoCompleteadOwners(id, searchValue) {
    //     let adOwner = (<FormGroup>this.uploaddetails.get('configData'))
    //     // let subscription = adOwner.get(id).valueChanges
    //     //     .pipe(takeUntil(this._onDestroy))
    //     //     .subscribe(() => {

    //     //         this._filterad(id, searchValue);
    //     //     });

    // }
    
    
    // _filterad(id, searchValue): string[] {
    //     let userdetail = [];

    //     if (id) {
    //         this.backendservice.searchUser(searchValue).then((res) => {
    //             this.searchadOwners = res;
    //             if (this.selectedadOwners.length > 1) {
    //                 this.searchadOwners = this.searchadOwners.map(el => {

    //                     for (let i = 0; i < this.selectedadOwners.length; i++) {
    //                         if (this.selectedadOwners[i].mail == el['mail']) {

    //                             el['selected'] = true;
    //                             return el;
    //                         }
    //                         else
    //                             el['selected'] = false;

    //                     }
    //                     return el;


    //                 });
    //             }
    //             this.filteredadOwners[id].next(res.slice());
    //             userdetail = res;

    //         });

    //     }
    //     return userdetail;

    // }

    optionClickedad(event: Event, adowner: any) {
        event.stopPropagation();
        this.toggleSelection(adowner);
    }

    toggleSelectionad(adowner: any, configuserid) {
        adowner.selected = !adowner.selected;
        let userlist = this.filteredadOwners[configuserid]._events[0].map(el => {
            if (el.id == adowner.id) {
                el['selected'] = adowner.selected;
            }
            return el;
        });
        this.filteredadOwners[configuserid].next(userlist)
        this.selectaduser[configuserid] = configuserid;
        if (adowner.selected) {
            if (!this.selectedadOwners[configuserid]) {
                this.selectedadOwners[configuserid] = []
            }
            this.selectedadOwners[configuserid].push(adowner);
        }
        else {
            const i = this.selectedadOwners[configuserid].findIndex(value => value.mail === adowner.mail);
            this.selectedadOwners[configuserid].splice(i, 1);
        }

    }

    removead(adowner, configuserid) {
        adowner.selected = !adowner.selected;
        const i = this.selectedadOwners[configuserid].findIndex(value => value.mail === adowner.mail);
        this.selectedadOwners[configuserid].splice(i, 1);
    }

    addad(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;


        // Reset the input value
        if (input) {
            input.value = "";
        }

    }







    // <-------------------------Document owner ------------------------->

    // autoCompleteOwners() {
    //     let docOwner = (<FormGroup>this.uploaddetails.get('documentOwner'))
    //     this.filteredOwners = docOwner.valueChanges.pipe(
    //         startWith(''),
    //         map(value => this._filter(value))
    //     );
    // }
    
    
    autoCompleteOwners(formValue, event) {
        if (event && formValue.length >= 3)
            this.filterSearch(formValue);
    }

    filterSearch(value) {

        // let filter = `startswith( displayname, '${value}')`;
        if (value.length >= 3) {
            this.backendservice.searchUser(value)
                .then((res) => {
                    this.searchOwners = (res);
                    // To patch
                    if (this.selectedOwners.length > 1) {

                        this.searchOwners = this.searchOwners.map(el => {

                            for (let i = 0; i < this.selectedOwners.length; i++) {
                                if (this.selectedOwners[i].mail == el['mail']) {

                                    el['selected'] = true;
                                    return el;
                                }
                                else
                                    el['selected'] = false;

                            }
                            return el;
                        });


                    }
                    this.autoTriggerDocOwner.openPanel();
                });

        }
    }

    optionClicked(event: Event, owner: any) {
        event.stopPropagation();
        this.toggleSelection(owner);
    }

    toggleSelection(owner: any) {
        // let docOwners = (<FormGroup>this.uploaddetails.get('documentOwner'))
        owner.selected = !owner.selected;
        if (owner.selected) {
            this.selectedOwners.push(owner);
        }
        else {
            const i = this.selectedOwners.findIndex(value => value.mail === owner.mail);
            this.selectedOwners.splice(i, 1);
        }

    }

    remove(owner) {
        owner.selected = !owner.selected;
        const i = this.selectedOwners.findIndex(value => value.mail === owner.mail);
        this.selectedOwners.splice(i, 1);
    }
    add(event: MatChipInputEvent) {
        const input = event.input;
        // const value = event.value;
        // console.log(event);
        // Add
        // if ((value || "").trim()) {
        //   this.selectedOwners.push(this.uploaddetails.controls.documentOwner(value));
        // }

        // Reset the input value
        if (input) {
            input.value = "";
        }
    }


    // <-------------------------Document owner end ------------------------->

    /**
    * On approval search keypress
    */
    onApproverSearch(formValue, level, event) {
        // console.log(formValue)
        if (event && formValue.length >= 3)
            this.searchUsers(formValue, level);
    }

    searchUsers(searchValue, level) {
        this.backendservice.searchUser(searchValue).then(res => {
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
                }
            }
        });

    }

    levelOptionSelected(level) {
        if (level == 1) {
            this.approval1Selected = true;
            this.userList1 = [];
        }
        else {
            this.approval2Selected = true;
            this.userList2 = []
        }
    }

    displayFnUserList(userObj: any): any | undefined {
        return userObj && userObj['displayName'] || '';
    }



    submit(detail) {

        if (!this.fileObj) {
            this.snackbar.openSnackBar("Please upload a file");
            return false;
        }
        else if (this.selectedOwners.length < 1) {
            this.snackbar.openSnackBar("Please Select Document Owner");
            return false;
        }
        else if (detail.approvalLvl1Check && !detail.approverLvl1Control.username) {
            this.snackbar.openSnackBar("Select valid Approver 1");
            return false;
        }
        else if (detail.approvalLvl2Check && !detail.approverLvl2Control.username) {
            this.snackbar.openSnackBar("Select valid Approver 2");
            return false;
        }

        else if (detail.approverLvl1Control.mail == detail.approverLvl2Control.mail && (detail.approverLvl1Control.mail && detail.approverLvl2Control.mail) !== undefined) {
            this.snackbar.openSnackBar("Approvers cannot be the same");
            return false;
        }

        else if (detail.approverLvl1Control.username == this.currentUser || detail.approverLvl2Control.username == this.currentUser) {
            this.snackbar.openSnackBar("Logged In user cannot assign himself as approver");
            return false;
        }

        else if (this._validateForm()) {
            let approvalStatus: any;
            if (this.hasNonApprovalAccess) {
                if (detail.approvalLvl1Check || detail.approvalLvl2Check)
                    approvalStatus = 'awaiting';
                else
                    approvalStatus = 'approved';

            } else {
                approvalStatus = 'awaiting';
            }

            detail.expiryDate = Date.UTC(detail.expiryDate.getFullYear(), detail.expiryDate.getMonth(), detail.expiryDate.getDate());
            let approverObj = [];
            if (detail.approvalLvl1Check) {
                let userId = detail.approverLvl1Control.displayName;
                if (userId.indexOf('#EXT#'))
                    userId = userId.split('#EXT#')[0];
                approverObj.push({
                    displayName: detail.approverLvl1Control.displayName,
                    username: detail.approverLvl1Control.mail.toLowerCase(),
                    id: userId,
                    level: 1,
                    // approvalStatus: this.hasNonApprovalAccess ? 'approved' : 'awaiting',
                    approvalStatus: approvalStatus,
                    rejectOption: false,
                    rejectionReason: '',
                    timestamp: new Date().getTime()
                })
                delete detail['approverLvl1Control'];
            }
            if (detail.approvalLvl2Check) {
                let userId = detail.approverLvl2Control.displayName;
                if (userId.indexOf('#EXT#'))
                    userId = userId.split('#EXT#')[0];
                approverObj.push({
                    displayName: detail.approverLvl2Control.displayName,
                    username: detail.approverLvl2Control.mail.toLowerCase(),
                    id: userId,
                    level: 2,
                    // approvalStatus: this.hasNonApprovalAccess ? 'approved' : 'awaiting',
                    approvalStatus: approvalStatus,
                    rejectOption: false,
                    rejectionReason: '',
                    timestamp: new Date().getTime()
                })
                delete detail['approverLvl2Control'];
            }

            let reqObj = [];
            for (let data of this.metadata) {
                let FTvalueId = this.genericService.generateUUID()
                if (data.fieldType == 'FT') {
                    let mdata = data
                    //mdata.valueId = FTvalueId;
                    mdata.value = this.uploaddetails.value.configData[mdata.configId]
                    reqObj.push({
                        "configId": mdata.configId,
                        "valueId": mdata.value != '' ? FTvalueId : '',
                        "value": mdata.value,
                        "visible": true,
                        "active": true
                    });
                    if (mdata.value != '') {
                        this.dmsconfiguration.createConfigValue(reqObj).then((result: any) => {
                            //console.log("FT added to config_values")
                        });
                    }
                }
            }


            let newFileObj = {
                fsuuid: this.fsuuid,
                type: 'File',
                path: (this.editFileData && `${this.editFileData.logicalPath}/${this.fileObj['name']}`) || `${this.backendservice.currentFolder['path']}/${this.fileObj['name']}`,
                logicalPath: (this.editFileData && `${this.editFileData.logicalPath}`) || this.backendservice.currentFolder.path,
                approvalLevels: approverObj,
                objectPath: (this.editFileData && this.editFileData.objectPath) || ([...this.backendservice.currentFolder.objectPath, ...this.backendservice.currentFolder.fsuuid]),
                ...this.fileObj,
                ...detail,
                trash: false,
                // approvalStatus: this.hasNonApprovalAccess ? 'approved' : 'awaiting',
                approvalStatus: approvalStatus,
                version: this.currentVersion || null,
                privilegegroup: this.backendservice.currentFolder ? this.backendservice.currentFolder['privilegegroup'] : [],
                timestamp: new Date().getTime(),
                selectedMultipleFolders: ([...this.selectedFolders, ...this.selectedFolderList])
            }
            this.docSubmitted = true;
            let selectedOwnersList = []
            this.selectedOwners.forEach(owner => {
                selectedOwnersList.push({ displayName: owner.displayName, mail: owner.mail, userPrincipalName: owner.userPrincipalName })
            })
            newFileObj.documentOwner = selectedOwnersList;

            let selectedadOwnersList = {}
            Object.keys(this.selectedadOwners).forEach(adowner => {
                let temparr = []
                this.selectedadOwners[adowner].forEach(element => {
                    temparr.push({ displayName: element.displayName, mail: element.mail, userPrincipalName: element.userPrincipalName })
                });
                selectedadOwnersList[`${adowner}`] = temparr
            })

            newFileObj['adlinkeddata'] = selectedadOwnersList

            for (let data in newFileObj.configData) {
                let previousValue = newFileObj.configData[data]
                let currentValue = reqObj.filter(e => e.configId == data)
                newFileObj.configData[data] = currentValue.length > 0 ? currentValue[0].valueId : previousValue;
            }

            // console.log(newFileObj.configData)

            this.metadata.forEach(ele => {
                delete newFileObj.configData[ele.name];
            })

            // let currentFolderIndex = this.selectedFolderList.findIndex(x => x.fsuuid == this.backendservice.currentFolder.fsuuid);

            // if (currentFolderIndex != -1)
            //     this.selectedFolderList.splice(currentFolderIndex, 1);

            if (
              this.currentAction &&
              this.currentAction == "reset" &&
              this.currentUUID
            ) {
              let stateTab =
                this.activeRoute.snapshot.queryParamMap.get("currentTab");
              let updateObj = {
                uuid: this.currentUUID,
                action: stateTab,
                ...newFileObj,
              };
              if (stateTab == "awaiting")
                this.approvalService.resetApproval(updateObj).then((res) => {
                  this.navigateback(stateTab);
                });
              else {
                updateObj["version"] = null;
                delete updateObj["uuid"];
                delete updateObj["fsuuid"];
                delete updateObj["action"];

                this.backend.createFolder(updateObj).then((res) => {
                //   console.log("response", res);
                  if (res != undefined || null) {
                    // let uuids = ([] = res.uuid);
                    let payload1: any = {};
                    payload1.uuid = []; 
                    payload1.uuid.push(res.uuid);
                    payload1.displayName = this.currentUserInfo["displayName"];
                    payload1.username = this.currentUserInfo["username"];
                    payload1.type = "awaitingApproval";
                    // console.log("payload2", payload1);

                      this.backendservice.mailNotifications(payload1).subscribe((res) => {
                        //   console.log("resp", res);
                      });
                  }
                  if (this.selectedFolderList.length > 1) {
                    this._copyFiles(updateObj).then((res) => {
                      this.navigateback(stateTab);
                    });
                  } else this.navigateback(stateTab);
                });
              }
            } else {
                // newFileObj.selectedMultipleFolders = this.selectedFolderList;

                this.backend.createFolder(newFileObj).then((res) => {
                    // console.log("response1", res);

                    if (res != undefined || null) {
                        // let uuids = [] =   res.uuid;

                        let payload2: any = {};
                        payload2.uuid = []; 
                        payload2.uuid.push(res.uuid);
                        payload2.displayName = this.currentUserInfo["displayName"];
                        payload2.username = this.currentUserInfo["username"];
                        payload2.type = "awaitingApproval";
                        // console.log("payload2", payload2);

                        this.backendservice.mailNotifications(payload2).subscribe((res) => {
                            // console.log("resp", res);
                        });
                    }

                    if (this.selectedFolderList.length > 1) {
                        this._copyFiles(newFileObj).then((res) => {
                            this.navigateback("docs");
                        });
                    } else this.navigateback("docs");
                });
            }
            // console.log("complete obj", newFileObj);
        }

    }

    /**
     * Upload files to multiple folders.
     * @param filesObj : File Object
     */
    _copyFiles(filesObj) {

        let folders = this.selectedFolderList;
        let currentFolderIndex = folders.findIndex(x => x.fsuuid == this.backendservice.currentFolder.fsuuid);
        if (currentFolderIndex != -1)
            folders.splice(currentFolderIndex, 1);

        let reqObj = {
            filesArr: [filesObj],
            folderList: folders
        }
        return new Promise((resolve, reject) => {
            return this.backend.multipleLocUpload(reqObj).then(res => {
                return resolve(res);
            });
        });
    }

    _validateForm(): boolean {
        if (this.uploaddetails.invalid) {
            let error_msg = this.genericService.formValidationMessages(this.uploaddetails.controls, this.formValidationMessages);
            this.snackbar.openSnackBar(error_msg);
            return false;
        }
        return true;
    }


    cancelUploadFile() {
        this.dialog.open(deletegroupComponent, {
            width: '32%',
            data: {
                msg: 'Are you sure you want to cancel the changes made?',
                positiveButton: 'Yes',
                negativebuuton: 'No'
            },
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res['status']) {
                let stateTab = this.activeRoute.snapshot.queryParamMap.get('currentTab') || 'docs';
                
                if (this.activeRoute.snapshot.url[1].path === 'editfile'){
                    if (this.fileObj && this.fileObj['fileName'] != this.editFileData.fileName )
                    this.deleteFile(this.fileObj['fileName'], this.fileObj['clientContainerName']);
                }else{
                    if (this.fileObj && this.fileObj['fileName'])
                    this.deleteFile(this.fileObj['fileName'], this.fileObj['clientContainerName']);
                }
               
            
                this.navigateback(stateTab);
            }
        })
    }

    deleteFile(fileName, clientContainerName) {
        let reqObj = {
            fileName: fileName,
            container: clientContainerName
        }
        this.backend.deleteFileStorage(reqObj).then(res => {
            
        });

    }



    /**
     * Navigates back to current folder .
     */
    navigateback(routeBack) {
        if (routeBack == 'docs') {
            this.retainBack = true;
            let encodedFilter = btoa(encodeURIComponent(JSON.stringify(this.backendservice.currentFolder['path'])));
            let encodedCurrentFolder = btoa(encodeURIComponent(JSON.stringify(this.backendservice.currentFolder)));
            this.nLocalStorage.setValue('folderFilter', encodedFilter);
            this.nLocalStorage.setValue('currentFolder', encodedCurrentFolder);
            this.router.navigate(['/home/documents']);
        } else {
            this.router.navigate([`/home/status/${routeBack}`]);
        }

    }


    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander(event) {
        if (!this.docSubmitted && this.fileObj && this.fileObj['fileName'])
            this.deleteFile(this.fileObj['fileName'], this.fileObj['clientContainerName']);
    }


    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();

        if (!this.retainBack)
            this.nLocalStorage.setValue('currentFolder', null);
    }


    /**
     * Load more action
     */
    // loadMore() {
    //     this.pageNumber = this.pageNumber + 1;
    //     this.backend.getUserFolders(this.pageNumber, 10, { type: 'Folder', fsuuid: { "$ne": this.backendservice.currentFolder.fsuuid }, name: { "$regex": this.searchFolderValue || '', $options: 'ig' } }, { name: 1 }).then(res => {
    //         if (res.local.res.length < this.pageSize)
    //             this.enableLoadMore = false;
    //         this.folderList = [...this.folderList, ...res.local.res];
    //     });
    // }

     //metaDatabuss departmenet
     getbddata(){
        this.backendservice.businessDepartments().subscribe(res => {
            this.businessDepartments = res.data;
            // console.log(this.businessDepartments)
        });
    }
    
    metaBDId(){
        // this.metaBussId = [];
        // this.selectedBD.forEach(element => {
        //         this.metaBussId.push({businessid:element})
        // });
        // this.getConfigData(this.metaBussId)
        // this._buildForm(this.selectedBD)
        // console.log(this.metaBussId)
        this.getMeta(this.selectedBD);
    }

    //metaconfigbusiness
    getMeta(id:any){
        this.getConfigValues().then((values: any[]) => {
            values.map((el: any) => {
                this.valuesMap[el['_id']] = el['values']
                this.valuesMapFiltered[el['_id']] = el['values']
            })
            this.getConfigData(id).then((metadata: any[]) => {
                this.metadata = metadata;
                this.selectedadOwners = [];
                // this.uploaddetails.get('configData').reset();
                const configData = (<FormGroup>this.uploaddetails.get('configData'))
                // configData.reset();
                this.metadata.forEach((control, index) => {
                    const ctrl = new FormControl('')
                    let parent = this.metadata.filter(e => e.parent == control.configId).forEach(el => {
                        ctrl.valueChanges.subscribe((valueId: string) => {
                            const values: any[] = ctrl.value;

                            configData.get(el.configId).reset();
                            this.valuesMapFiltered[el.configId] = this.valuesMap[el.configId].filter(e => values.indexOf(e.parentValueId) != -1);
                        })
                    });
                    if (control.isChildren) {
                        this.valuesMapFiltered[control.configId] = [];
                    }
                    configData.addControl(control.configId, ctrl)
                    // for dropdown filter
                    let dropDownctrl = new FormControl('');
                    configData.addControl(control.name, dropDownctrl)
                    let list = this.valuesMapFiltered[control.configId] || [];

                    this.filteredList[control.configId] = new ReplaySubject<[]>(1);
                    this.filteredList[control.configId].next(list.slice());

                    let subscription = configData.get(control.name).valueChanges
                        .pipe(takeUntil(this._onDestroy))
                        .subscribe(() => {

                            this.Searchfilter(list, control.name, control.configId);
                        });
                    //dropdown filter completed
                    // AD linked dropdowns
                    //console.log(control)
                    if (control.configId) {
                        this.filteredadOwners[control.configId] = new ReplaySubject<[]>(1);
                        this.filteredadOwners[control.configId].next(list.slice());
                        let dropdownsubscription = configData.get(control.configId).valueChanges
                            .pipe(takeUntil(this._onDestroy))
                            .subscribe(() => {
                                if(control.fieldType=='AD'){
                                    this.linkedsearchFilter(list, control.configId, control.configId);
                                }
                                else{
                                    return;
                                }
                                
                            });
                    }
                })
                this.subject.next(true)
                // if (this.activeRoute.snapshot.url[1].path === 'editfile') {
                //     this.uploaddetails.get('configData').patchValue(this.fsData.configData)
                //     let values: any = '';
                //     for (let data of this.metadata) {
                //         if (data.fieldType == 'FT') {
                //             data.value = this.uploaddetails.value.configData[data.configId]
                //             values = data.value
                //             this.dmsconfiguration.getConfigValues({ 'valueId': values }).then((result: any) => {
                //                 const configValues = result && result.local && result.local.configValues;
                //                 if (Array.isArray(configValues) && configValues.length > 0) {
                //                     (<FormGroup>this.uploaddetails.get('configData')).get(data.configId).setValue(result.local.configValues[0]['value']);
                //                     (<FormGroup>this.uploaddetails.get('configData')).get(data.configId).updateValueAndValidity();
                //                 }
                //             });
                //         }
                //     }
                // }
            })



        });
        this.uploaddetails.controls.documentName.disable();
    }
    
    
}
