import { configdetailsComponent } from './../configdetailsComponent/configdetails.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute,Router } from "@angular/router";
import { NSnackbarService, NLocalStorageService } from 'neutrinos-seed-services';

import { backendService } from '../../services/backend/backend.service';
import { genericService } from '../../services/generic/generic.service';
import { dmsconfiguration } from 'app/sd-services/dmsconfiguration';

@Component({
    selector: 'bh-linkdetailsdlg',
    templateUrl: './linkdetailsdlg.template.html'
})
export class linkdetailsdlgComponent implements OnInit {
    title: string;
    action: string;

    submitAction: string;
    closeAction: string;

    linkDetailsForm: FormGroup;

    parentList: any[];

    config: any ={};
    configId: any;
    reslt:any ={};
    configLink: any;
    linkProps: any[];
    linkDetails: any;
    valuesMap: any = {};
    valuesMapFiltered: any = {};
    multiSelectMap: any = {};
    enableMultiSelect: boolean = false;

    // Maintaince state of link details changes
    dataUpdated: boolean = false;

    constructor(
        private snackbar: NSnackbarService,
        private formBuilder: FormBuilder,
        //public dialogRef: MatDialogRef<linkdetailsdlgComponent>,
        //@Inject(MAT_DIALOG_DATA) public data,
        public backendService: backendService,
        private dmsconfiguration: dmsconfiguration,
        public genericService: genericService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.action = this.route.snapshot.queryParams['action'];;
        //console.log(this.action)
        this.configId = this.route.snapshot.queryParams['configId'];
        this.config = JSON.parse(this.route.snapshot.queryParams['config']);
        //console.log(this.config);
        //console.log(this.configId)
        let reslt = this.route.snapshot.queryParams['linkDetails']
        //console.log(JSON.parse(reslt))
        if(reslt==undefined){
          this.linkDetails =   { "configId": this.configId };
        }else{
          this.linkDetails =   JSON.parse(reslt) || { "configId": this.configId };
        }

        //console.log(this.linkDetails)
        this.linkDetailsForm = formBuilder.group({
            "configValueId": new FormControl(this.linkDetails['valueId'], Validators.required),
            "mapping": this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.prepare();
    }

    close() {
        //this.dialogRef.close();
        this.router.navigate(['/home/configuration/configDetails'], { queryParams: { configId:this.configId } });
    }

    prepare() {
        if (this.action === 'ADD')
            this.getConfigValues(this.config.configId).then((result: any) => this.valuesMap[this.config.configId] = result);
        else
            this.valuesMap[this.config.configId] = [{ value: this.linkDetails['value'], valueId: this.linkDetails['valueId'], linkDetailsAdded: true }];
        this.dmsconfiguration.getConfigLinkProps(this.config.configId).then((result: any) => {
            if (result && result.local && result.local.res && result.local.res[0]) {
                this.linkProps = result.local.res;
                this.loadValues().then(() => {
                    this.buildForm();
                    if (this.action !== 'ADD')
                        this.patchForm();
                });
            }
        });
        switch (this.action) {
            case 'ADD':
                this.title = 'Add Link Details';
                this.submitAction = 'Add';
                this.closeAction = 'Cancel';
                this.enableMultiSelect = false;
                break;
            case 'EDIT':
                this.title = 'Edit Link Details';
                this.submitAction = 'Save';
                this.closeAction = 'Cancel';
                this.linkDetailsForm.get('configValueId').disable();
                this.enableMultiSelect = true;
                break;
            case 'VIEW':
                this.title = 'Link Details';
                this.closeAction = 'close';
                this.linkDetailsForm.disable();
                this.enableMultiSelect = false;
                break;
            default:
                console.warn('Invalid config action');
                break;
        }
    }

    buildForm() {
        const formArray = <FormArray>this.linkDetailsForm.get('mapping');
        this.linkProps.forEach((el: any) => {
            const valuesControl = new FormControl({ 'value': '', disabled: true });
            formArray.push(this.formBuilder.group({
                "fieldName": new FormControl(el['linkName']),
                "fieldType": new FormControl(el['fieldType']),
                "linkTo": new FormControl(el['linkTo']),
                'values': valuesControl,
                'multiSelect': new FormControl(el['multiSelect'])
            }));

            this.linkProps.forEach((e: any, index: number) => {
                if (e['fieldType'] === 'DDL' && e['parentLink'] === el['linkTo']) {
                    valuesControl.valueChanges.subscribe((valueId: string) => {
                        let values = valueId;
                        (<FormGroup>formArray.at(index)).get('values').reset();
                        this.valuesMapFiltered[e['linkTo']] = [];
                        if (el['multiSelect'])
                            values = valuesControl.value;
                        if (values) {
                            const vals: any[] = this.valuesMap[e['linkTo']] || [];
                            let filteredValues = vals.filter(it => {
                                if (Array.isArray(values))
                                    return values.includes(it.parentValueId);
                                else
                                    return values === it.parentValueId;
                            });

                            if (e['multiSelect']) {
                                this.multiSelectMap[e['linkTo']] = undefined;
                                filteredValues.map(v => v['selected'] = false);
                            }

                            this.valuesMapFiltered[e['linkTo']] = filteredValues;
                        }
                    });
                }
            });
        });

        this.linkDetailsForm.get('configValueId').valueChanges.subscribe((configValueId: string) => {
            if (configValueId) {
                formArray.enable();
                this.enableMultiSelect = true;
            }
            formArray.controls.forEach((el: FormGroup) => el.get('values').reset());
        });
    }

    patchForm() {
        const ftVals: any = {};
        const formArray = <FormArray>this.linkDetailsForm.get('mapping');
        formArray.controls.forEach((formGroup: FormGroup, i: number) => {
            const linkTo = formGroup.get('linkTo').value;
            const linkProp = this.linkProps.find((el: any) => el['linkTo'] === linkTo);
            let values: any = '';
            if (this.linkDetails.mapping && this.linkDetails.mapping.length > 0) {
                const linkMap = this.linkDetails.mapping.find(map => map['linkTo'] === linkTo);
                if (linkMap)
                    values = linkMap['values'];
            }
            if (formGroup.get('fieldType').value === 'FT') {
                ftVals[values] = i;
            } else {
                formGroup.get('values').setValue(values);
                formGroup.get('values').updateValueAndValidity();
            }
            if (this.action === 'EDIT')
                formGroup.get('values').enable();
            if (values && formGroup.get('multiSelect').value === true) {
                const selected = [];
                this.valuesMap[linkTo] && this.valuesMap[linkTo].forEach((el: any) => {
                    if (values.includes(el.valueId))
                        selected.push({ ...el });
                });
                this.multiSelectMap[linkTo] = selected;
                this.valuesMapFiltered[linkTo] = this.valuesMapFiltered[linkTo].filter(el => !values.includes(el.valueId));
            }
        });

        // to watch is there any update made on link details
        if (this.action == 'EDIT')
            this.linkDetailsForm.valueChanges.subscribe((val: any) => this.dataUpdated = true);

        const ftValIds = Object.keys(ftVals).filter((id: string) => id.length > 0);
        if (!ftValIds || ftValIds.length < 1)
            return
        this.dmsconfiguration.getConfigValues({ 'valueId': { '$in': ftValIds } }).then((result: any) => {
            const ftValues = result && result.local && result.local.configValues || [];
            for (const val of ftValues) {
                const path = `${ftVals[val['valueId']]}.values`;
                const ctrl = formArray.get(path);
                ctrl.setValue(val['value']);
                ctrl.updateValueAndValidity();
            }
            this.dataUpdated = false; // Resetting after loading free text data
        });
    }

    async loadValues() {
        const configIds = [];
        for (const el of this.linkProps) {
            if (el['fieldType'] === 'DDL')
                configIds.push(el['linkTo']);
        }
        const result = await this.getConfigValues(configIds);
        for (const val of result) {
            if (!this.valuesMap[val['configId']]) {
                this.valuesMap[val['configId']] = [];
                this.valuesMapFiltered[val['configId']] = [];
            }
            this.valuesMap[val['configId']].push(val);
            if (!val['parentValueId']) {
                this.valuesMapFiltered[val['configId']].push(val);
            }
        }
    }

    async getConfigValues(configId: string | string[], parentValueId?: string | string[]): Promise<any[]> {
        const filter: any = {
            'active': true,
            'visible': true,
            'configId': configId,
            // 'linkDetailsAdded': { '$ne': true }
        };
        if (Array.isArray(configId))
            filter['configId'] = { '$in': configId };
        if (parentValueId)
            filter['parentValueId'] = { '$in': Array.isArray(parentValueId) ? parentValueId : [parentValueId] };
        const result = await this.dmsconfiguration.getConfigValues(filter);
        if (result && result.local)
            return result.local.configValues;
        return null;
    }

    submit() {
        if (this.linkDetailsForm.valid) {
            const details = this.linkDetailsForm.getRawValue();
            details['configId'] = this.config.configId;
            details.mapping = details.mapping.map((el: any) => {
                const values = el['values'];
                if (el['fieldType'] === 'FT' && typeof values === 'string' && values.length > 0) {
                    const configValue = {
                        "configId": el['linkTo'],
                        "valueId": this.genericService.generateUUID(),
                        "value": values,
                        "visible": true,
                        "active": true,
                        // "parentValueId": "9fa6ee0f-83a4-4cfa-8607-e5143baed059"
                    };
                    this.dmsconfiguration.createConfigValue([configValue]).then((result: any) => {
                        if (result && result.local && result.local.res && result.local.res.result)
                            console.log(`New Metadata value created`);
                    });
                    return { 'linkTo': el['linkTo'], 'values': configValue.valueId };
                } else
                    return { 'linkTo': el['linkTo'], 'values': values };
            });
            if (this.action == 'ADD') {
                details['active'] = true;
                this.dmsconfiguration.createConfigLinkDetails(details).then((result: any) => {
                    if (result && result.local && result.local.res && result.local.res.result) {
                        this.snackbar.openSnackBar(`Link Details successfully added`);
                       // this.dialogRef.close(true);
                    }
                });
            } else if (this.action == 'EDIT') {
                if (!this.dataUpdated) {
                    this.snackbar.openSnackBar(`No changes were made.`);
                    return;
                }
                details['updatedOn'] = Date.now();
                details['updatedBy'] = this.backendService.currentUserObj && this.backendService.currentUserObj['displayName'];
                this.dmsconfiguration.editConfigLinkDetails(details).then((result: any) => {
                    if (result && result.local && result.local.res && result.local.res) {
                        this.snackbar.openSnackBar(`Link Details successfully edited`);
                       // this.dialogRef.close(true);
                    }
                });
            }
        } else {
            // let error_msg = this.genericService.formValidationMessages(this.linkDetailsForm.controls, this.formValidationMessages);
            this.snackbar.openSnackBar('Please fill all the fields');
        }
    }

    /**
     * From Multiselect, Adds selected option to form control and map
     * @param inputIndex: index of form group form form array
     * @param linkTo: Link config id of selected options
     */
    add(inputIndex: number, linkTo: string) {
        const selected: any[] = [];
        this.valuesMapFiltered[linkTo] && this.valuesMapFiltered[linkTo].forEach((el: any) => {
            if (el.selected) {
                const obj = {
                    ...el,
                    selected: false
                };
                selected.push(obj);
            }
        });
        if (selected.length < 1) {
            this.snackbar.openSnackBar(`Please select items to add.`);
            return;
        }
        this.valuesMapFiltered[linkTo] = this.valuesMapFiltered[linkTo].filter(el => !el.selected);
        if (!this.multiSelectMap[linkTo])
            this.multiSelectMap[linkTo] = [];
        this.multiSelectMap[linkTo].push(...selected);
        const formGroup = (<FormArray>this.linkDetailsForm.get('mapping')).at(inputIndex) as FormGroup;
        const values = this.multiSelectMap[linkTo].map((el: any) => el.valueId);
        formGroup.get('values').setValue(values);
        formGroup.get('values').updateValueAndValidity();
    }

    /**
     * From Multiselect, Removes selected option to form control and map
     * @param inputIndex: index of form group form form array
     * @param linkTo: Link config id of selected options
     */
    remove(inputIndex: number, linkTo: string) {
        const selected: any[] = [];
        this.multiSelectMap[linkTo].filter((el: any) => el.selected).forEach((el: any) => {
            const obj = {
                ...el,
                selected: false
            };
            selected.push(obj);
        });
        if (selected.length < 1) {
            this.snackbar.openSnackBar(`Please select items to remove.`);
            return;
        }
        this.valuesMapFiltered[linkTo].push(...selected);
        this.multiSelectMap[linkTo] = this.multiSelectMap[linkTo].filter(el => !el.selected);
        const formGroup = (<FormArray>this.linkDetailsForm.get('mapping')).at(inputIndex) as FormGroup;
        const values = this.multiSelectMap[linkTo].map((el: any) => el.valueId);
        formGroup.get('values').setValue(values);
        formGroup.get('values').updateValueAndValidity();
    }
}
