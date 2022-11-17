/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';

@Injectable()
export class genericService {

    private formErrorTypes = ['required', 'email', 'pattern'];

    /**
     * Generic Form Validation Messages using snackbar
     * @param formControls          - For FormControls
     * @param validationMessages    - For Validation Messages 
     */
    formValidationMessages(formControls: any, validationMessages: any): string {
        let controls = Object.keys(formControls);
        let error_message = '';
        for (let i = 0; i < controls.length; ++i) {
            let control = formControls[controls[i]];
            if (control.invalid) {
                let error_status = false;
                for (let j = 0; j < this.formErrorTypes.length; ++j) {
                    if (control.hasError(this.formErrorTypes[j])) {
                        if (validationMessages[controls[i]] && validationMessages[controls[i]][this.formErrorTypes[j]]) {
                            error_message = validationMessages[controls[i]][this.formErrorTypes[j]];
                            error_status = true;
                        }
                        break;
                    }
                }
                if (!error_status) {
                    error_message = ((validationMessages[controls[i]] && validationMessages[controls[i]]['disp']) || controls[i]) + " is invalid";
                }
                break;
            }
        }
        return error_message;
    }

    /**
     * Method To Disable Form based on role.
     * @param formGroup To get Formgroup to disable Form.
     */
    disableForm(formGroup: FormGroup) {
        for (let key in formGroup['value'])
            formGroup.controls[key].disable();
    }

    /**
     * Method To enable Form based on role.
     * @param formGroup To get Formgroup to enable Form.
     */
    enableForm(formGroup: FormGroup) {
        for (let key in formGroup['value'])
            formGroup.controls[key].enable();
    }

    /**
     * This method is using for input validations
     * @param event         - key event
     * @param inputType     - type of input
     * @param allowSpace    - To allow Space 
     * @param maxLength     - Input max-length
     * @param value         - Input formControlName Value
     */
    inputEntryCheck(event: any, inputType: string, allowSpace = false, maxLength?, value?) {
        let pattern = null;
        let inputChar = String.fromCharCode(event.charCode);
        switch (inputType) {
            case 'string': {
                pattern = allowSpace ? /[a-zA-Z ]/ : /[a-zA-Z]/; break;
            }
            case 'number': {
                pattern = /[0-9]/;
                break;
            }
        }
        if (pattern && !pattern.test(inputChar))
            event.preventDefault();

        if (maxLength && value && value.length === maxLength)
            event.preventDefault();
    }

    /**
     * Method For Alpha Numeric Validation ,
     * Resticted First Space,
     * Resticted special charector,
     * @param event         - key Event
     * @param maxLength     - input Max-length
     * @param value         - Input formControlName Value
     */
    allowAlphaNumeric(event: any, maxLength?, value?) {
        if (value != undefined && value.length == 0 && event.charCode === 32) {
            event.preventDefault();
        }
        let pattern = /[A-Za-z0-9 ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (pattern && !pattern.test(inputChar)) {
            event.preventDefault();
        }
        if (value != undefined && value.length === maxLength) {
            event.preventDefault();
        }
    }

    /**
     * Method which accepts all special charectors, string except first space.
     * @param event         - key event
     * @param maxLength     - max-length
     * @param value         - Input formControlName Value
     */
    restrictFirstSpace(event, maxLength?, value?) {
        if (value != undefined && value.length == 0 && event.charCode === 32) {
            event.preventDefault();
        }
        if (value != undefined && value.length === maxLength) {
            event.preventDefault();
        }
    }

    /**
     * 
     * @param validation = Type of validation to be applied ['required' , null]
     * @param controls  = Array of controls
     * @param formGroup = FormGroup
     */
    updateValidity(validation, controls, formGroup) {
        if (validation == null) {
            controls.forEach(element => {
                formGroup.get(element).setValidators(null);
                formGroup.get(element).updateValueAndValidity({ onlySelf: false, emitEvent: false });
            });
        }
        else if (validation == 'required') {
            controls.forEach(element => {
                formGroup.get(element).setValidators([Validators.required]);
                formGroup.get(element).updateValueAndValidity({ onlySelf: false, emitEvent: false });
            });
        }
    }

    /**
     *  Function to generate unique UUID
     */
    generateUUID() {
        return this.__s4() + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + this.__s4() + this.__s4();
    }
    __s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
    }



    /**
     * Calculate Obj
     * @param obj : FS Object
     */
    versionCalculate(obj) {
        if (obj.version) {
            let time = new Date().getTime().toString();
            time = time.substr(1, 3) + time.substr(9, 13);
            return Number(`${obj.version.toString().split('.')[0]}.${time}`);
        } else {
            return 1.0;
        }
    }

    /**
     * Returns cpunts of file and folder children
     * @param contentArr : FS Content Array
     */
    getFolderChildrenCount(contentArr) {
        //Files Arr
        let FL_Arr = [];
        // Folder Arr
        let DR_Arr = [];
        //Others
        let OT_Arr = [];
        contentArr.forEach((el, i) => {
            if (el.slice(0, 2) == 'FL')
                FL_Arr.push(el);
            else if (el.slice(0, 2) == 'DR')
                DR_Arr.push(el);
            else
                OT_Arr.push(el);

        });

        let uniqueValue = (value, index, self) => self.indexOf(value) === index;
        FL_Arr = FL_Arr.filter(uniqueValue);

        return { FL_Arr: FL_Arr, DR_Arr: DR_Arr, OT_Arr: OT_Arr };
    }



    //Pagination : Start
    /**
     * Method which returns page and total no of pages
     * @param index - current page number
     * @param totalCount -total rows in table
     * @param pageSize - Total Page size
     */
    pagination(index, totalCount, pageSize) {
        let pager = [];
        let totalPages = Math.ceil(totalCount / pageSize);
        let i = 0;
        let finalSize = 0;

        if (index * 10 < totalPages) {
            finalSize = index * 10;
        } else {
            finalSize = totalPages;
        }
        i = (index - 1) * 10;
        while (i < finalSize) {
            pager.push(i + 1);
            i = i + 1;
        }
        return { pager: pager, page_Index: totalPages };
    }


    /**
     * Return unique array of objects , removes duplicates based on key
     * @param array : Array to be returned
     * @param uniqueKey : Dulpicate key identifier
     */
    getUniqueArray(array, uniqueKey) {
        let result = [];
        let map = new Map();
        for (let item of array) {
            if (!map.has(item[uniqueKey])) {
                map.set(item[uniqueKey], true);    // set any value to Map
                result.push(item);
            }
        }
        return result;
    }

    getUniqueArrayWithLatestFiles(array){
        let result = [];
        array.forEach(element => {
            if(element.latest){
                result.push(element);
            }
        });
        return result;
    }


    /**
     * Returns the privilege permissions of the folder.
     * @param {Boolean} rootFlag : Flag whether to consider root access 
     * @param {Array} folerPRGroups : Current Folder privilege group array
     */
    getFolderPermissions(rootFlag = false, folerPRGroups) {
        if (rootFlag)
            folerPRGroups = folerPRGroups.filter(el => el.groupId != 'super-user');
        if (folerPRGroups && folerPRGroups.length > 0)
            if (folerPRGroups.find(x => x.write == true))
                return 'RW';
            else if (folerPRGroups.find(x => x.read == true))
                return 'R';
            else
                return 'N';
        else
            return 'N';
    }

    /**
    * method returns from date with time as 00:00:00
    */
    setFromDate(fromdate?) {

        let date = fromdate;
        if (date && date.getTime()) {
            let fromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            return fromDate;
        }
    }
    /**
    * method returns To date with time as 23:59:00
    */
    setToDate(todate?) {
        let date = todate;
        if (date && date.getTime()) {
            let toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 0);
            return toDate;
        }
    }

    public filteredUsers:any=[]


    getusersData(data){
      this.filteredUsers=data;
    }
}


