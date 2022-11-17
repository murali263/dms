
import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
import { resolverService } from '../../services/resolver/resolver.service';
import { approvalsection } from '../../sd-services/approvalsection';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { backendService } from '../../services/backend/backend.service';
import { MatChipInputEvent} from '@angular/material';
import { ENTER } from '@angular/cdk/keycodes';



@Component({
    selector: 'bh-search',
    templateUrl: './search.template.html',
    styleUrls: ['./search.component.scss']
})

export class searchComponent implements OnInit {
    @Output() searchEvent = new EventEmitter<any>();
    @Output() searchCloseEvent = new EventEmitter<any>();

    search = {
        fromDate: '',
        toDate: '',
        submittedBy: '',
        meta: {},
        adlinkdata: {},
    };

    searchForm: FormGroup;
    metadataSearch: FormArray;
    ADValue: FormArray;
    searchConfig = {}
    docTypeData;
    businessDivisionData;
    SMBData;
    regionData;
    languageData;
    docUploaders = [];
    isInAwaitingSection: boolean = false;
    metadata;
    metadataSelected: any = [];
    valuesMapFiltered: any = [];
    showinput = [];

    // filteredValue: Array<any> = [];
    selectedValue:Array<any> = [];
    searchValues: Array<any> = [];
    inputvalue: string;
    separatorKeysCodes: number[] = [ENTER];
    addOnBlur = true;
    removable = true;
    showremove = false;

    constructor(private backendservice: backendService,
        public activeRoute: ActivatedRoute,
        private ResolverService: resolverService,
        private approvalService: approvalsection,
        private dmsconfiguration: dmsconfiguration,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,) {
        this._buildForm();
    }

    ngOnInit() {
        this.inputvalue = "";
        this.ResolverService.getConfig().then(configData => {

            if (configData.length > 0) {
                this.docTypeData = configData[0]['document_type_configuration'];
                this.businessDivisionData = configData[1]['business_division_configuration'];
                this.SMBData = configData[2]['S_M_B_configuration'];
                this.regionData = configData[3]['region_configuration'];
                this.languageData = configData[4]['language_configuration'];
            }
        });

        if (window.location.hash.indexOf('/home/status/approval') >= 0) {
            this.isInAwaitingSection = true;
            this.approvalService.getDocUploaders().then(res => {
                this.docUploaders = res.local.res[0]['users'];
            });
        } else
            this.isInAwaitingSection = false;

        this.getConfigData();
    }


    _buildForm() {
        this.searchForm = this.formBuilder.group({
            metadataSearch: this.formBuilder.array([this.createItem()])
        })
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            metaData: [''],
            metaValue: [''],          
        });
    }

    addValueFormCtrl(): void {
        this.showremove = true;
        this.metadataSearch = this.searchForm.get('metadataSearch') as FormArray;
        this.metadataSearch.push(this.createItem());
        console.log(this.metadataSearch)
    }
    // removeValueFormCtrl(i): void {
    //         this.metadataSearch.removeAt(i);
    //         this.showinput.splice(i,1);
    //     if(this.metadataSearch.length==1)
    //     {
    //         this.showremove = false;
    //     }
    // }

    removeValueFormCtrl(i): void {
        this.metadataSearch.removeAt(i);
        this.showinput.splice(i,1);
        this.valuesMapFiltered.splice(i,1);
    if(this.metadataSearch.length==1)
    {
        this.showremove = false;
    }
}

    getConfigData() {
        let filterObj = {
            'active': true,
            'visible':true
        }
        this.dmsconfiguration.getConfigsByFilter(filterObj).then(res => {
            if (res && res.local) {
                this.metadata = res.local.res;
                console.log(this.metadata)
            }
        })
    }

    resetValuesTab(event, i) {
        let selectedMetadata = this.metadata.find(element => element.configId === event.value);
        if(selectedMetadata.fieldType === "AD"){
            // this.filteredValue = [];
            this.selectedValue = [];
            this.searchValues = [];
            this.inputvalue = "";
            this.showinput.push(true);        
        }
        else{
            this.showinput.push(false);
            let filterObj = {
                'active': true,
                'configId': event.value
            }
            this.dmsconfiguration.getConfigValues(filterObj).then((res: any) => {
                if (res && res.local) {
                    this.valuesMapFiltered[i] = res.local.configValues;
                }
            })
        }
    }

    

    // <-------------------------AD value start ------------------------->
    valuechange(newValue) {
        this.inputvalue = newValue;
        this._filter(this.inputvalue);

      }
      _filter(value): string[] {
        if (value.length >= 3) {
            this.backendservice.searchUser(value)
                .then((res) => {
                    this.searchValues = (res);
                    if (this.searchValues.length > 1) {

                            this.searchValues = this.searchValues.map(el => {
    
                                for (let i = 0; i < this.selectedValue.length; i++) {
                                    if (this.selectedValue[i].mail == el['mail']) {
    
                                        el['selected'] = true;
                                        return el;
                                    }
                                    else
                                        el['selected'] = false;
    
                                }
                                return el;
                            });
                    }
                    return this.searchValues;
                });

        }
        return this.searchValues;
    }
    optionClicked(event: Event, value: any) {
        event.stopPropagation();
        this.toggleSelection(value);
    }

    toggleSelection(value: any) {
        value.selected = !value.selected;
        if (value.selected) {
            this.selectedValue.push(value);
        }
        else {
            const i = this.selectedValue.findIndex(values => values.mail === value.mail);
            this.selectedValue.splice(i, 1);
        }
    }
    remove(value) {
        value.selected = !value.selected;
        const i = this.selectedValue.findIndex(values => values.mail === value.mail);
        this.selectedValue.splice(i, 1);
    }
    add(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;
        if (input) {
            input.value = "";
        }
    }
    // <-------------------------AD value end ------------------------->

    /**
     * Returns true if the config is already selected as link
     * To disable the config name in add links drop down
     * @param configId: config id to check wheather it is already selected or not
     */
    isConfigSelected(configId) {
        const cl: any[] = (<FormArray>this.searchForm.get('metadataSearch')).value;
        const config = cl.find((el: any) => el.metaData === configId);
        return config ? true : false;
    }

    getConfigName(i: number) {
        if (this.metadata != undefined && this.metadataSelected != undefined) {
            let configId = this.searchForm.get(`metadataSearch.${i}.metaData`).value
            let configName = this.metadata.filter(e => e.configId == configId)
            if (configName != '') {
                this.metadataSelected = configName[0].name;
                return this.metadataSelected;
            }
        }
    }

    triggerSearch() {
        let metaArr: any[] = this.searchForm.value.metadataSearch;
        //delete metaArr[0].ADValue
        this.search.meta = {};
        metaArr.forEach(el => {
            let selectedMetadata = this.metadata.find(element => element.configId === el.metaData);
            if(selectedMetadata.fieldType === "AD"){
                if(this.selectedValue.length > 0)
                {
                    let array = [];
                    this.selectedValue.map(item =>{
                        array.push(item.mail)
                    });
                    el.metaValue = array;
                    if (el.metaValue && el.metaValue.length > 0)
                    this.search.adlinkdata[el.metaData] = el.metaValue;
                }   
            }
            else{
                if (el.metaValue && el.metaValue.length > 0)
                this.search.meta[el.metaData] = el.metaValue;
            }               
        })
        console.log(this.search)
        this.searchEvent.emit({ searchObj: this.search });
    }
}
