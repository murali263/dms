import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { NSnackbarService } from 'neutrinos-seed-services';

import { confirmdlgComponent } from '../confirmdlgComponent/confirmdlg.component';
import { linkdetailsdlgComponent } from '../linkdetailsdlgComponent/linkdetailsdlg.component';
import { backend } from '../../sd-services/backend';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { genericService } from '../../services/generic/generic.service';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { backendService } from '../../services/backend/backend.service';


@Component({
    selector: 'bh-configdetails',
    templateUrl: './configdetails.template.html'
})
export class configdetailsComponent implements OnInit {
    tabGroup: any[] = [
        {
            "index": 0,
            "displayName": "Create Values",
            "key": "createValues",
            "default": true
        }
    ];

    isShownLinkDetails: boolean = false; // hidden by default
    isShown: boolean = false; // hidden by default
    isLinkTabShown: boolean = false; // hidden by default
    isCreatetabShown: boolean = true; // hidden by default
    selectedTabIndex: number;
    selected: string;
    public tablist: any = [{ index: 0, name: 'Create Values' }, { index: 1, name: 'Add links' }, { index: 2, name: 'Link Details' }]
    pageNumber: number = 1;
    pageSize: number = 10;
    totalCount: number; // values total count
    totalCount1: number;
    configId: string;
    config: any = {};
    configValues: any[];
    parentValues: any[];
    parentValueId: string;
    @ViewChild(CdkVirtualScrollViewport, { static: true }) virtualScroll: CdkVirtualScrollViewport;

    /**
     * To show in drop down of add links tab
     */
    configList: any[];

    configLinks: any[];
    linkIndexCtr: number = 0;

    configFrom: FormGroup;


    searchText: string = '';
    linkDetailSource = new MatTableDataSource();
    displayedColumns: string[] = ['value', 'createdBy', 'createdOn', 'updatedOn', 'action'];
    linkDetailList: any[];
    configDetailTotalCount: number;
    configDetailTotalCount1: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private scrollDispatcher: ScrollDispatcher,
        private formBuilder: FormBuilder,
        private snackbar: NSnackbarService,
        private backend: backend,
        private backendService: backendService,
        private dmsConfig: dmsconfiguration,
        public genericService: genericService,
        public dialog: MatDialog
    ) {
        this.configFrom = formBuilder.group({ "values": this.formBuilder.array([]), "links": this.formBuilder.array([]) });
        this.configId = this.route.snapshot.params['configId'];
        this.config = this.route.snapshot.data['configData']['config'];
        if (this.config.visible) {
            this.tabGroup.push({
                "index": 1,
                "displayName": "Add Links",
                "key": "addLinks"
            }, {
                "index": 2,
                "displayName": "Link Details",
                "key": "linkDetails"
            });
        }
        if (this.config.isChildren)
            this.parentValues = this.route.snapshot.data['configData']['parentValues'];
        else {
            this.configValues = this.route.snapshot.data['configData']['values']['data'];
            this.totalCount = this.route.snapshot.data['configData']['values']['totalCount'];
        }
    }

    ngOnInit() {

        if (this.configValues && this.configValues.length > 0)
            this.configValues.map((el: any) => this.addValueFormCtrl(el.value, el.valueId, true, el.visible));
        else if (!this.config.isChildren)
            this.addValueFormCtrl();
        this.selectedTabIndex = 0;

    }



    switchtabs() {
        console.log(this.selectedTabIndex)
        if (this.selectedTabIndex === 0) {
            this.isCreatetabShown = true;
            this.isLinkTabShown = false;
        }
        if (this.selectedTabIndex === 1) {
            this.isLinkTabShown = true;
            this.isCreatetabShown = false;
        }
        if (this.selectedTabIndex === 2) {
            this.isLinkTabShown = false;
            this.isCreatetabShown = false;
        }


    }

    /**
     * Emits event on mat tab changed
     * @param event: holds the data of tab change
     */
    tabChange(event: MatTabChangeEvent) {
        // on tab change
        this.selectedTabIndex = event.index;
        this.pageNumber = 1;
        if (this.selectedTabIndex === 0) { // Create Values tab
            if (this.config.isChildren) {
                this.parentValueId = undefined;
                const controls = <FormArray>this.configFrom.get('values');
                controls.clear();
                this.configFrom.reset();
            }
            else
                this.resetValuesTab();
        } else if (this.selectedTabIndex === 1) { // Add Links tab
            this.configLinks = undefined;
            (<FormArray>this.configFrom.get('links')).clear();
            this.dmsConfig.getConfigLinks(this.config.configId).then((result: any) => {
                if (result && result.local && result.local.res && result.local.res[0]) {
                    this.configLinks = result.local.res[0]['linkProps'];
                    this.configLinks.sort((a: any, b: any) => a.linkIndex - b.linkIndex);
                    this.linkIndexCtr = this.configLinks[this.configLinks.length - 1]['linkIndex'];
                    if (this.configLinks instanceof Array && this.configLinks.length > 0)
                        this.configLinks.map((el: any) => this.addLinkFormCtrl(el.linkTo, true, el.multiSelect));
                    else
                        this.addLinkFormCtrl();
                } else
                    this.addLinkFormCtrl();
                this.getConfigs();
            });
        } else if (this.selectedTabIndex === 2) { // Link Details tab
            this.linkDetailList = undefined;
            this.searchLinkDetails();
        }
    }

    /**
     * Fetchs config values based on the filter, pageNumber and pageSize, and returns promise
     */
    getConfigValues() {
        const filter: any = { 'active': true, 'configId': this.config.configId };
        if (this.config.isChildren)
            filter['parentValueId'] = this.parentValueId;
        return new Promise((resolve, reject) => {
            this.dmsConfig.searchConfigValues(filter, this.pageNumber, this.pageSize).then((result: any) => {
                if (result && result.local) {
                    resolve(result.local.res);
                }
            });
        });
    }


    /**
     * updates Form `configFrom` based on the parameters, adds new form control if no parameter given
     * @param value will be assinged to the new control if provided, empty value if not provided
     * @param valueId will be assinged to the new control if provided, gererates new id if not provided
     * @param readOnly sets the form control disabled if the parameter is true
     * @param visible will be assinged to the new control if provided, `false` if not provided
     */
    addValueFormCtrl(value = '', valueId: string = this.genericService.generateUUID(), readOnly = false, visible = true) {
        const controls = <FormArray>this.configFrom.get('values');
        //console.log(controls.length)
        let newvalue = controls.push(this.formBuilder.group({
            'value': new FormControl({ 'value': value, 'disabled': readOnly }, [Validators.required, Validators.pattern(/^(?!\s*$).*$/)]),
            'valueId': new FormControl(valueId, Validators.required),
            'visible': new FormControl(visible)
        }));


        //console.log(controls)
        //console.log(controls.controls[controls.length-1])
    }

    /**
     * updates Form `configFrom` based on the parameters, adds new form control if no parameter given
     * @param link specifys the link(`configId` of an sub attribute) getting added
     * @param linkId specifys the id of the link added, generates new id if not provided
     * @param readOnly sets the `link` form control disabled if the parameter is true
     * @param multiSelect specifys the link is multi select, if not provided `multiSelect` ctrl will not be created
     */
    addLinkFormCtrl(linkTo = '', readOnly = false, multiSelect?: any) {
        const controls = <FormArray>this.configFrom.get('links');
        const fg = this.formBuilder.group({
            'linkTo': new FormControl({ 'value': linkTo, 'disabled': readOnly }, Validators.required),
            'linkIndex': new FormControl(++this.linkIndexCtr),
        });
        if (multiSelect !== undefined && multiSelect !== null) {
            const ctrl = new FormControl(multiSelect)
            ctrl.disable();
            fg.addControl('multiSelect', ctrl);
        }
        return controls.push(fg);
    }

    /**
     * Resets the config values form data
     */
    resetValuesTab() {
        const controls = <FormArray>this.configFrom.get('values');
        controls.clear();
        this.pageNumber = 1;
        this.getConfigValues().then((result: any) => {
            if (result && result.data) {
                this.configValues = result['data'];
                this.totalCount = result['totalCount'];
                if (this.configValues instanceof Array && this.configValues.length > 0) {
                    this.configValues.map(el => this.addValueFormCtrl(el.value, el.valueId, true, el.visible));
                } else
                    this.addValueFormCtrl();
            }
        });
    }

    /**
     * to change config value visible on doc upload
     * @param inputIndex: index of form array which's value has to be updated
     * @param visible: specifies wheather config value should be visible or not
     */
    toggleConfigValueVisible(inputIndex: number, visible: boolean) {

        const fromGroup: FormGroup = (<FormArray>this.configFrom.get('values')).at(inputIndex) as FormGroup;
        fromGroup.get('visible').setValue(visible);
        fromGroup.get('visible').updateValueAndValidity();
        if (fromGroup.get('value').value) {
            this.updatedVisible(fromGroup.get('valueId').value, visible);

        }
    }

    /**
     * updates config value visible to database by calling an API
     * @param valueId: specifies which config value to update
     * @param vidsible: specifies wheather config value should be visible or not
     */
    updatedVisible(valueId: string, visible: boolean) {
        let payload = { 'valueId': valueId, 'visible': visible }
        this.backendService.updateMetadataConfig(payload).then((result: any) => {
            if (result && result.success === true) {
                this.snackbar.openSnackBar(`Metadata value successfully updated`);
            }
        });
    }

    /**
     * Loads more config values to the form
     */
    loadMore() {
        this.pageNumber++;
        this.getConfigValues().then((result: any) => {
            if (result && result.data && result.data.length > 0) {
                this.totalCount = result['totalCount'] || this.totalCount;
                if (result.data instanceof Array && result.data.length > 0) {
                    this.configValues.push(...result.data);
                    result.data.map(el => this.addValueFormCtrl(el.value, el.valueId, true, el.visible));
                }
            }
        });
    }

    loadPrevious() {
        this.pageNumber--
        this.getConfigValues().then((result: any) => {
            if (result && result.data && result.data.length > 0) {
                this.totalCount1 = result['totalCount1'] || this.totalCount1;

            }
        });
        if (this.pageNumber < 2) {

            this.isShown = false;
        }
    }

    loadNext() {
        this.pageNumber++;
        this.getConfigValues().then((result: any) => {
            if (result && result.data && result.data.length > 0) {
                this.totalCount = result['totalCount'] || this.totalCount;
                if (result.data instanceof Array && result.data.length > 0) {
                    //this.configValues.push(...result.data);
                    result.data.map(el => this.addValueFormCtrl(el.value, el.valueId, true, el.visible));
                }
            }
        });
        this.isShown = true;
    }






    checkIfDuplicateExists(w) {
        return new Set(w).size !== w.length
    }

    /**
     * Creates config values to database by calling an API
     */
    saveValues() {
        if (this.config.isChildren && !this.parentValueId) {
            this.snackbar.openSnackBar(`Please select ${this.config.parentName}`);
            return;
        }
        if (this.configFrom.get('values').valid) {
            let configValues: any[] = this.configFrom.value['values'];
            configValues = configValues.filter((el: any) => el.value);

            configValues.map((el: any) => {
                el['valueId'] = el['valueId'] || this.genericService.generateUUID();
                el['active'] = true;
                el['configId'] = this.config.configId;
                if (this.config.isChildren)
                    el['parentValueId'] = this.parentValueId;
            });
            if (configValues.length > 0) {
                let existingValues = this.configValues.map(e => e.value)
                let newValues = configValues.map(e => e.value)
                let jsonArray = [];
                jsonArray = existingValues.map(i => {
                    return { 'value': i, 'matched': newValues.includes(i) };
                });
                if (jsonArray.filter(e => e.matched == true).length > 0 || this.checkIfDuplicateExists(newValues)) {
                    this.snackbar.openSnackBar("MetaValue with same name already exists")
                }
                else {
                    this.dmsConfig.createConfigValue(configValues).then((result: any) => {
                        if (result && result.local && result.local.res && result.local.res.result) {
                            this.configFrom.disable();
                            this.snackbar.openSnackBar(`${result.local.res.result.inserted || 0} new Metadata value(s) created`);
                        }
                    });
                }
            } else
                this.snackbar.openSnackBar(`Please add new Metadata values to create`);
        } else {
            this.configFrom.markAllAsTouched();
            this.snackbar.openSnackBar(`Please fill all the Metadata values`);
        }
    }



    /**
     * Fetchs configs to show in the drop down to select sub-attribute
     */
    getConfigs() {
        // fetch all configs from db, filter to exclude current config, children config of current config, already selected configs
        if (!this.configList) {
            const filter = {
                'active': true,
                'visible': false,
                'configId': { '$nin': [this.config.configId] },
                'parent': { '$ne': this.config.configId },
                '$or': [{ 'linksAvailable': { '$exists': false } }, { 'linksAvailable': false }]
            };
            if (this.config.isChildren)
                filter['configId']['$nin'].push(this.config.parent);
            this.dmsConfig.getConfigsByFilter(filter).then((result: any) => {
                if (result && result.local && result.local.res) {
                    this.configList = result.local.res
                }
            });
        }
    }

    /**
     * Emits event on Sub-attribute drop down select
     * @param evnt: holds the selected link value
     */
    onLinkSelect(event: any, inputIndex: number) {
        const selectedConfig = this.configList.find((el: any) => el.configId === event.value);
        const fa = <FormArray>this.configFrom.get('links');
        const fg = fa.at(inputIndex) as FormGroup;
        if (selectedConfig.isChildren) {
            const cl: any[] = fa.getRawValue();
            let parent = cl.find((el: any) => el.linkTo == selectedConfig.parent);
            if (!parent) {
                parent = this.configList.find((el: any) => el.configId === selectedConfig.parent);
                fg.get('linkTo').reset();
                if (fg.get('multiSelect'))
                    fg.removeControl('multiSelect');
                this.snackbar.openSnackBar(`Please select parent Metadata '${parent.name}' before selecting child`);
                return;
            }
        }
        if (selectedConfig.fieldType === 'DDL')
            fg.addControl('multiSelect', new FormControl(false));
        else if (fg.get('multiSelect'))
            fg.removeControl('multiSelect');
    }

    /**
     * Saves Links to database from the form group
     */
    saveLinks() {
        const linksFormArry = this.configFrom.get('links');

        if (linksFormArry.valid) {
            let newConfigLinks: any[] = linksFormArry.value;
            newConfigLinks = newConfigLinks.filter((el: any) => el.linkTo);

            // newConfigLinks.map((el: any) => {
            //     el['configId'] = this.config.configId;
            //     el['active'] = true;
            // });
            if (newConfigLinks.length > 0) {
                const data = {
                    'configId': this.config.configId,
                    'linkProps': newConfigLinks
                }
                this.dmsConfig.addConfigLinks(data).then((result: any) => {
                    if (result && result.local && result.local.res)
                        linksFormArry.disable();
                });
            } else
                this.snackbar.openSnackBar(`Please add new Metadata Links to create`);
        } else
            this.snackbar.openSnackBar(`Please select all the Metadata Links`);
    }

    /**
     * Returns true if the config is already selected as link
     * To disable the config name in add links drop down
     * @param configId: config id to check wheather it is already selected or not
     */
    isConfigSelected(configId) {
        const cl: any[] = (<FormArray>this.configFrom.get('links')).getRawValue();
        const config = cl.find((el: any) => el.linkTo === configId);
        return config ? true : false;
    }

    /**
     * Fetchs config link details link by pagination and searchText
     */
    getLinkDetails() {
        return new Promise((resolve, reject) => {
            const filter = {
                'active': { '$ne': false },
                'configId': this.config.configId,
                'searchText': this.searchText
                // "value": { $regex: `.*${this.searchText}.*`, $options: 'i' }
            }
            this.dmsConfig.searchLinkDetails(filter, this.pageNumber, this.pageSize).then(result => {
                if (result && result.local && result.local.res && result.local.res.data) {
                    resolve(result.local.res)
                } else {
                    reject('Error fetching configs');
                }
            });
        });
    }

    /**
     * Method calling to assiagn datasource to table data list
     * @param tableData table data list
     */
    protected _setDataSource(tableData) {
        this.linkDetailSource = new MatTableDataSource(tableData);
    }

    /**
     * Search config's LinkDetails with specified size data length `this.pageSize` to the table
     */
    searchLinkDetails() {
        this.pageNumber = 1;
        this.getLinkDetails().then((result: any) => {
            this.linkDetailList = result.data;
            this._setDataSource(this.linkDetailList);
            this.configDetailTotalCount = result.totalCount;
        });
    }

    /**
     * Loads more config with specified size data length {this.size} to the table
     */
    // loadMoreLinkDetails() {
    //     this.pageNumber++;
    //     this.getLinkDetails().then((result: any) => {
    //         this.linkDetailList.push(...result.data);
    //         this._setDataSource(this.linkDetailList);
    //         this.configDetailTotalCount = result.totalCount;
    //     });
    // }

    loadMoreLinkDetailsPrevious() {
        this.pageNumber--;
        this.getLinkDetails().then((result: any) => {
            this.linkDetailList = result.data;
            this._setDataSource(this.linkDetailList);
            this.configDetailTotalCount1 = result.totalCount;
        });
        if (this.pageNumber < 2) {

            this.isShownLinkDetails = false;
        }

    }

    loadMoreLinkDetailsNext() {
        this.pageNumber++;
        this.getLinkDetails().then((result: any) => {
            this.linkDetailList = result.data;
            this._setDataSource(this.linkDetailList);
            this.configDetailTotalCount = result.totalCount;
        });
        this.isShownLinkDetails = true;
    }

    /**
     * Scrolls the window to Top
     */
    public scrollToTop() {
        window.scroll(0, 0);
    }

    /**
     * Opens Link Details popup for the action specified
     * @param action: action been performed on link `ADD`, `EDIT`, `VIEW`
     * @param element: selected element from table. if action is `EDIT` or `VIEW` element must be provided
     */
    linkDetails(action: string, element?: any) {

        // const dialogRef = this.dialog.open(linkdetailsdlgComponent, {
        //     minWidth: '60%',
        //     panelClass: 'custom-dialog-container',
        //     data: {
        //         'action': action,
        //         'config': this.config,
        //         'linkDetails': element
        //     },
        //     autoFocus: false,
        //     disableClose: true
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     if (result)
        //         this.searchLinkDetails();
        // });
        this.router.navigate(['/home/AddLinkDetails'], { queryParams: { action, linkDetails: JSON.stringify(element), config: JSON.stringify(this.config), configId: this.configId } });


    }

    /**
     * Deletes the config link details of the given element
     * @param element: link detail element to delete
     */
    deleteLinkDetails(element: any) {
        const dialogRef = this.dialog.open(confirmdlgComponent, {
            panelClass: 'custom-dialog-container',
            data: {
                'title': 'Delete Confirmation',
                'messageContent': `Do you want to delete the config link details of <strong>'${element.value}'</strong>?`
            },
            autoFocus: false,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result['confirmed']) {
                const reqObj = { 'configValueId': element['valueId'], 'configId': this.config['configId'], 'active': false };
                this.dmsConfig.editConfigLinkDetails(reqObj).then((result: any) => {
                    this.searchLinkDetails();
                    if (result && result.local && result.local.res) {
                        this.snackbar.openSnackBar(`Link Details successfully deleted`);
                    }
                });
            }
        });
    }

}
