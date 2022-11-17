import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { NSnackbarService } from 'neutrinos-seed-services';

import { confirmdlgComponent } from '../confirmdlgComponent/confirmdlg.component';
import { configpopupComponent } from '../configpopupComponent/configpopup.component';
import { genericService } from '../../services/generic/generic.service';
import { backendService } from '../../services/backend/backend.service';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { backend } from '../../sd-services/backend';
import { MatOption } from '@angular/material';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';

@Component({
    selector: 'bh-configuration',
    templateUrl: './configuration.template.html',
    styleUrls: ['./configuration.component.scss']
})

export class configurationComponent implements OnInit {
    businessDepartment = []



    documenTTypeDetails: FormGroup;
    businessDivision: FormGroup;
    supplierBrand: FormGroup;
    regions: FormGroup;
    languages: FormGroup;
    isShown: boolean = false ; // hidden by default
    isshownnext:boolean=false;
    disableDocType = [];
    disableBusiness = [];
    disableSupplier = [];
    disableRegion = [];
    disableLanguage = [];
    configId: string;
    collectionName;
    tabIndex = 0;
    fieldName: string;
    fieldTypeName: string;
    docTypeData;
    businessDivisionData;
    SMBData;
    regionData;
    languageData;
    docType;
    data;
    icon = false;

    configData = this.activeRoute.snapshot.data.configData;


    dataSource = new MatTableDataSource();
    displayedColumns: string[] = ['name','businessdepartments','visible', 'mapping', 'createdBy', 'createdOn', 'updatedOn', 'action']
    // 'businessdepartments', 
    configList: any[] = [];
    totalCount: number;
    totalCount1: number;
    searchText: string;
    size: number = 10;
    pageNumber: number = 1;

    constructor(private formBuilder: FormBuilder,
        private snackbar: NSnackbarService,
        public genericService: genericService,
        private backendService: backendService,
        private dmsconfiguration: dmsconfiguration,
        public activeRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {
        // this._buildForm();
        // this.addNewConfig();
    }

    ngOnInit() {
        // this.updateData();
        // this._buildForm();
        // this.getFormArray();
        this.searchConfig();
    }
    

    updateData(data?) {
        if (data != undefined) {
            this.configData[this.tabIndex][this.collectionName] = data;
        }

        if (this.configData.length > 0) {
            this.docTypeData = this.configData[0]['document_type_configuration'];
            this.businessDivisionData = this.configData[1]['business_division_configuration'];
            this.SMBData = this.configData[2]['S_M_B_configuration'];
            this.regionData = this.configData[3]['region_configuration'];
            this.languageData = this.configData[4]['language_configuration'];
        }

        this.disableDocType = this.docTypeData.map(data => data.viewStatus);
        this.disableBusiness = this.businessDivisionData.map(data => data.viewStatus);
        this.disableSupplier = this.SMBData.map(data => data.viewStatus);
        this.disableRegion = this.regionData.map(data => data.viewStatus);
        this.disableLanguage = this.languageData.map(data => data.viewStatus);

        if (data != undefined && data.length <= 0) {
            this.configId = undefined;
            this.getFormArray();
        }

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        this.tabIndex = tabChangeEvent.index;
        this.getFormArray();
    }

    getFormArray() {
        switch (this.tabIndex) {
            case 0: if (this.documenTTypeDetails.value.doc.length < 1) {
                if (this.docTypeData.length > 0) {
                    this.docTypeData.forEach((data, index) => {
                        this.addData(data['displayName'], 'documenTTypeDetails', 'doc', 'documentType');
                    });
                }
                else {
                    this.addData('', 'documenTTypeDetails', 'doc', 'documentType');
                }
            }
                break;
            case 1: if (this.businessDivision.value.business.length < 1) {
                if (this.businessDivisionData.length > 0) {
                    this.businessDivisionData.forEach((data, index) => {
                        this.addData(data['displayName'], 'businessDivision', 'business', 'businessdivision');
                    });
                }
                else {
                    this.addData('', 'businessDivision', 'business', 'businessdivision');
                }

            }
                break;
            case 2: if (this.supplierBrand.value.suppliers.length < 1) {
                if (this.SMBData.length > 0) {
                    this.SMBData.forEach((data, index) => {
                        this.addData(data['displayName'], 'supplierBrand', 'suppliers', 'supplier');
                    });
                }
                else {
                    this.addData('', 'supplierBrand', 'suppliers', 'supplier');
                }
            }
                break;
            case 3: if (this.regions.value.reg.length < 1) {
                if (this.regionData.length > 0) {
                    this.regionData.forEach((data, index) => {
                        this.addData(data['displayName'], 'regions', 'reg', 'region');
                    });
                }
                else {
                    this.addData('', 'regions', 'reg', 'region');
                }
            }
                break;
            case 4: if (this.languages.value.language.length < 1) {
                if (this.languageData.length > 0) {
                    this.languageData.forEach((data, index) => {
                        this.addData(data['displayName'], 'languages', 'language', 'lang');
                    });
                }
                else {
                    this.addData('', 'languages', 'language', 'lang');
                }
            }
                break;
        }



    }


    _buildForm() {
        this.documenTTypeDetails = this.formBuilder.group({
            doc: this.formBuilder.array([])
        });
        this.businessDivision = this.formBuilder.group({
            business: this.formBuilder.array([])
        });
        this.supplierBrand = this.formBuilder.group({
            suppliers: this.formBuilder.array([])
        });
        this.regions = this.formBuilder.group({
            reg: this.formBuilder.array([])
        });
        this.languages = this.formBuilder.group({
            language: this.formBuilder.array([])
        });

    }
    /**
     *  adding configurations to form array
     * @param data
     * @param formIdentifier
     * @param arrayControlName
     * @param controlName
     */
    addData(data, formIdentifier, arrayControlName, controlName) {
        let lang = <FormArray>this[formIdentifier].controls[arrayControlName];
        if (data) {
            lang.push(this.formBuilder.group({
                [controlName]: new FormControl(data),
            }));
        }
        else {
            lang.push(this.formBuilder.group({
                [controlName]: new FormControl('', [Validators.required, Validators.pattern(/^(?!\s*$).*$/)]),
            }));
        }
    }

    /**
     * delete perticular field from form array
     * @param index : index value to delete control
     * @param deleteType : get document type
     * @param control : form array
     */
    deleteFeilds(index, deleteType, control: FormArray, arrayType: Array<boolean>) {
        switch (this.tabIndex) {
            case 0: this.collectionName = "document_type_configuration";
                this.configId = (this.docTypeData.length <= index) ? '' : this.docTypeData[index]['configId'];
                break;
            case 1: this.collectionName = "business_division_configuration";
                this.configId = (this.businessDivisionData.length <= index) ? '' : this.businessDivisionData[index]['configId'];
                break;
            case 2: this.collectionName = "S_M_B_configuration";
                this.configId = (this.SMBData.length <= index) ? '' : this.SMBData[index]['configId'];
                break;
            case 3: this.collectionName = "region_configuration";
                this.configId = (this.regionData.length <= index) ? '' : this.regionData[index]['configId'];
                break;
            case 4: this.collectionName = "language_configuration";
                this.configId = (this.languageData.length <= index) ? '' : this.languageData[index]['configId'];
                break;
        }
        if (deleteType == 'Technical documents') {
            this.snackbar.openSnackBar('Delete operation cannot be performed as the value that you are trying to delete has been assigned for some document');
        } else {
            if (this.configId !== '') {
                let reqObj = [];
                reqObj.push({
                    "configId": this.configId,
                    "activeFlag": false
                })
                this.dmsconfiguration.editConfiguration(reqObj, this.collectionName).then(data => {
                    arrayType[index] = true;
                    control.removeAt(index);
                    this.snackbar.openSnackBar('Deleted successfully');
                    this.dmsconfiguration.getConfigurationData(this.collectionName).then(res => {
                        this.updateData(res.local.res);
                    })
                })
            } else {
                control.removeAt(index);
            }
        }

    }


    /**
     * make visibiltiy disbale and enabled
     * @param i: index of perticular feild.
     * @param arrayType : perticular disable tab array
     */
    disableFeild(index, status) {
        switch (this.tabIndex) {
            case 0: this.collectionName = "document_type_configuration";
                this.configId = (this.docTypeData.length <= index) ? '' : this.docTypeData[index]['configId'];
                break;
            case 1: this.collectionName = "business_division_configuration";
                this.configId = (this.businessDivisionData.length <= index) ? '' : this.businessDivisionData[index]['configId'];
                break;
            case 2: this.collectionName = "S_M_B_configuration";
                this.configId = (this.SMBData.length <= index) ? '' : this.SMBData[index]['configId'];
                break;
            case 3: this.collectionName = "region_configuration";
                this.configId = (this.regionData.length <= index) ? '' : this.regionData[index]['configId'];
                break;
            case 4: this.collectionName = "language_configuration";
                this.configId = (this.languageData.length <= index) ? '' : this.languageData[index]['configId'];
                break;
        }

        let reqObj = [];
        reqObj.push({
            "configId": this.configId,
            "viewStatus": !status[index]
        })
        if (this.configId) {
            this.dmsconfiguration.editConfiguration(reqObj, this.collectionName).then(data => {
                this.dmsconfiguration.getConfigurationData(this.collectionName).then(res => {
                    this.updateData(res.local.res);
                })
            })
        }
        else {
            let items = status;
            if (items[index] == undefined) {
                items[index] = true;
                items[index] = !items[index];
            } else {
                items[index] = !items[index];
            }
        }
    }



    /**
     * get the submited data
     * @param val :get submited data.
     * @param arrayType: disabled array of perticular tab
     */

    submit(val, arrayType: Array<boolean>) {
        switch (this.tabIndex) {

            case 0: if (this.documenTTypeDetails.invalid) {
                this.snackbar.openSnackBar('Please enter valid name');
                return false;
            }
                this.collectionName = "document_type_configuration";
                this.fieldName = "documentType";
                break;

            case 1: if (this.businessDivision.invalid) {
                this.snackbar.openSnackBar('Please enter valid name');
                return false;
            }
                this.collectionName = "business_division_configuration";
                this.fieldName = "businessdivision"
                break;
            case 2: if (this.supplierBrand.invalid) {
                this.snackbar.openSnackBar('Please enter valid name');
                return false;
            }
                this.collectionName = "S_M_B_configuration";
                this.fieldName = "supplier"
                break;
            case 3: if (this.regions.invalid) {
                this.snackbar.openSnackBar('Please enter valid name');
                return false;
            }
                this.collectionName = "region_configuration";
                this.fieldName = "region"
                break;
            case 4:
                if (this.languages.invalid) {
                    this.snackbar.openSnackBar('Please enter valid name');
                    return false;
                }
                this.collectionName = "language_configuration"
                this.fieldName = "lang"
                break;
        }

        let temp = arrayType;
        let reqObj = [];

        val.forEach((el, index) => {
            let configId = this.configId || this.genericService.generateUUID();
            if (temp[index] == undefined) {
                temp[index] = true;
            }

            for (var fieldName in el) {
                var existingName = this.configData[this.tabIndex][this.collectionName].map(x => x.displayName).includes(el[fieldName])
                // if (el.hasOwnProperty(fieldName)) {`
                if (Object.keys(el).includes(fieldName)) {
                    if (!existingName) {
                        reqObj.push({
                            "displayName": el[fieldName],
                            "configId": configId,
                            "viewStatus": temp[index],
                            "activeFlag": true
                        })
                    }
                }
            }
        })

        this.dmsconfiguration.createDocTypeConfig(this.collectionName, reqObj).then(res => {
            this.dmsconfiguration.getConfigurationData(this.collectionName).then(res => {
                this.updateData(res.local.res);
            })
            this.snackbar.openSnackBar('Saved successfully');
        });
    }

    /**
     * Search config with specified size data length {this.size} to the table
     */
    searchConfig() {
        this.pageNumber = 1;
        this.getConfigs().then((result: any) => {
           // console.log(result)
            this.configList = result.data;
            this._setDataSource(this.configList);
            this.totalCount = result.totalCount;
            if(this.totalCount > result.data.length){
                this.isshownnext=true;
           }
        });
        
        this.isShown = false;

    }

    /**
     * Method calling to assiagn datasource to table data list
     * @param tableData table data list
     */
    protected _setDataSource(tableData) {
        this.dataSource = new MatTableDataSource(tableData);
    }

    /**
     * Fetchs config from backed service passing searchText, start and size as parameters
     */
    getConfigs() {
        // fetch configs
        return new Promise((resolve, reject) => {
            this.dmsconfiguration.searchConfigs(this.searchText, this.pageNumber, this.size,this.businessDepartment).then(result => {
                if (result && result.local && result.local.res && result.local.res.data) {
                    resolve(result.local.res)
                } else {
                    reject('Error fetching configs');
                }
            });
        });
    }

    /**
     * Loads more config with specified size data length {this.size} to the table
     */
    // loadMore() {
    //     this.pageNumber++;
    //     this.getConfigs().then((result: any) => {
    //         this.configList.push(...result.data);
    //         this._setDataSource(this.configList);
    //         this.totalCount = result.totalCount;
    //     });
    // }

    loadPrevious() {
      this.pageNumber--;
      this.getConfigs().then((result: any) => {
        this.configList = result.data;
          this._setDataSource(this.configList);
          this.totalCount1 = result.totalCount1;
          if(result.data.length=this.size){
            this.isshownnext=true
        }
      });
      if(this.pageNumber<2){
      
      this.isShown=false;
      }
    }

    loadNext() {
      this.pageNumber++;
      this.getConfigs().then((result: any) => {
        this.configList = result.data;
          this._setDataSource(this.configList);
          this.totalCount = result.totalCount;
          //console.log(this.totalCount,result.data.length)
          if(result.data.length<this.size){
              this.isshownnext=false
          }
      });
      this.isShown=true;
    }

    /**
     * Scrolls the window to Top
     */
    public scrollToTop() {
        const element = document.querySelector('#scrollId');
        element.scrollIntoView();
        //window.scrollTo(0, 0);
    }

    addNewConfig() {
        const dialogRef = this.dialog.open(configpopupComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: { 'action': 'ADD' },
            autoFocus: false,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.searchConfig();
        });
    }

    viewConfig(config) {
        this.dialog.open(configpopupComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                'action': 'VIEW',
                'config': config
            },
            autoFocus: false,
            disableClose: true
        });
    }

    editConfig(config) {
        const dialogRef = this.dialog.open(configpopupComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                'action': 'EDIT',
                'config': config
            },
            autoFocus: false,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.searchConfig();
        });
    }

    deleteConfig(config) {
        this.dmsconfiguration.configUsedCount(config['configId']).then((result: any) => {
            if (result.local.res.count > 0) {
                this.snackbar.openSnackBar(`Metadata is already associated with document, Cannot perform delete operation.`);
            }
            else {
                this.dmsconfiguration.getChildrenConfigCount(config['configId']).then((result: any) => {
                    if (result && result.local && result.local.res) {
                        if (result.local.res.count && result.local.res.count > 0) {
                            this.snackbar.openSnackBar(`Kindly delete the child metadata before deleting the parent metadata.`);
                        } else 
                        {
                            const dialogRef = this.dialog.open(confirmdlgComponent, {
                                width: '600px',
                                panelClass: 'custom-dialog-container',
                                data: {
                                    'title': 'Delete Confirmation',
                                    'messageContent': `Do you want to delete the metadata <strong>'${config.name}'</strong>?`
                                },
                                autoFocus: false,
                                disableClose: true
                            });
                            

                            dialogRef.afterClosed().subscribe(result => {
                                if (result && result['confirmed']) {
                                    const reqObj = { configId: config['configId'], active: false };
                                    this.dmsconfiguration.editConfigData(reqObj).then((result: any) => {
                                        this.searchConfig();
                                        if (result && result.local && result.local.res) {
                                            this.snackbar.openSnackBar(`Metadata successfully deleted`);
                                        }
                                    });
                                }
                            });

                            
                            // const dialogRef = this.dialog.open(deletegroupComponent, {
                            //     width: '30%',
                            //     panelClass: 'custom-dialog-container',
                            //     data: {
                            //         msg: `Do you want to delete the metadata '${config.name}'?`,
                            //         positiveButton: 'Yes',
                            //         negativebuuton: 'No'
                            //     },
                            //     autoFocus: false,
                            //     restoreFocus: false,
                            //     disableClose: true
                            // });
                            // dialogRef.afterClosed().subscribe(result => {
                            //     if (result && result['status']) {
                            //         const reqObj = { configId: config['configId'], active: false };
                            //         this.dmsconfiguration.editConfigData(reqObj).then((result: any) => {
                            //             this.searchConfig();
                            //             if (result && result.local && result.local.res) {
                            //                 this.snackbar.openSnackBar(`Metadata successfully deleted`);
                            //             }
                            //         });
                            //     }
                            // });
                        }
                    }
                });
            }
        });


    }

    importConfigs() { }

    exportConfigs() { }

    applyclick(data){
        this.isshownnext=false;
        //console.log("apply clicked",data)
        this.businessDepartment = data
        if(data){
            this.getConfigs().then((result: any) => {
                //console.log(result)
                this.configList = result.data;
                this._setDataSource(this.configList);
                this.totalCount = result.totalCount;
                if(this.totalCount > result.data.length){
                    this.isshownnext=true;
               }
            });
        }
    }
    resetclick(){
        this.isshownnext=false;
        //console.log("reset clicked")
        this.businessDepartment = []
        this.getConfigs().then((result: any) => {
           // console.log(result)
            this.configList = result.data;
            this._setDataSource(this.configList);
            this.totalCount = result.totalCount;
            if(this.totalCount > result.data.length){
                this.isshownnext=true;
           }
        });
    }

    

}
