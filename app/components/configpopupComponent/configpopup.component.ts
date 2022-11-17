import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatRadioChange } from "@angular/material";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import {
  NSnackbarService,
  NLocalStorageService,
} from "neutrinos-seed-services";

import { backendService } from "../../services/backend/backend.service";
import { genericService } from "../../services/generic/generic.service";
import { dmsconfiguration } from "app/sd-services/dmsconfiguration";

@Component({
  selector: "bh-configpopup",
  templateUrl: "./configpopup.template.html",
})
export class configpopupComponent implements OnInit {
  @ViewChild("select", { static: true }) select: MatSelect;

  title: string;
  action: string;

  submitAction: string;
  closeAction: string;

  configForm: FormGroup;

  parentList: any[];

  config: any;

  configUsed: boolean = false;

  businessDepartments: any[];
  selected: any[];
  allSelected: boolean = false;

  formValidationMessages = {
    name: {
      disp: "Metadata Name",
      required: "Configuration Name is required",
    },
    fieldType: {
      disp: "Metadata Field Type",
      required: "Configuration Field Type is required",
    },
    businessDepartment: {
      disp: "Business Department",
      required: "Business department name is required",
    },
    visible: {
      disp: "Visible",
      required: "Please select show in document upload or not",
    },
    isChildren: {
      disp: "Mapping",
      required: "Please select mapping required or not",
    },
    parent: {
      disp: "Parent Metadata",
      required: "Please select parent metadata if mapping required",
    },
  };

  constructor(
    private snackbar: NSnackbarService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<configpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public backendService: backendService,
    private dmsconfiguration: dmsconfiguration,
    public genericService: genericService
  ) {
    this.action = data["action"];
    this.config = data["config"] || {};
    this.prepare();
  }

  ngOnInit() {
    this.getbddata();
  }

  close() {
    this.dialogRef.close();
  }

  getbddata() {
    this.backendService.businessDepartments().subscribe((res) => {
      this.businessDepartments = res.data;
    });
  }

  prepare() {
    this.buildForm(this.data.config || {});
    switch (this.action) {
      case "ADD":
        this.title = "Add New Metadata";
        this.submitAction = "Add";
        this.closeAction = "Cancel";
        break;
      case "EDIT":
        this.title = "Edit Metadata";
        this.submitAction = "Save";
        this.closeAction = "Cancel";
        if (this.data.config.businessDepartment) {
          this.selected = this.data.config.businessDepartment.map(function (
            obj
          ) {
            return obj.businessid;
          });
        }
        this.dmsconfiguration
          .configUsedCount(this.config["configId"])
          .then((result: any) => {
            if (result && result.local && result.local.res) {
              if (result.local.res.count > 0) {
                this.configUsed = true;
                this.configForm.get("fieldType").disable();
                this.configForm.get("isChildren").disable();
                if (this.configForm.get("parent"))
                  this.configForm.get("parent").disable();
              }
            }
          });
        break;
      case "VIEW":
        this.title = "Metadata";
        this.closeAction = "close";
        this.configForm.disable();
        break;
      default:
        console.warn("Invalid config action");
        break;
    }
  }

  buildForm(config: any) {
    this.configForm = this.formBuilder.group({
      name: new FormControl(config["name"], [
        Validators.required,
        Validators.maxLength(260),
        Validators.pattern(/^(?!\s*$).*$/),
      ]),
      fieldType: new FormControl(
        config["fieldType"] || "DDL",
        Validators.required
      ),
      visible: new FormControl(config["visible"] || false, Validators.required),
      isChildren: new FormControl(
        config["isChildren"] || false,
        Validators.required
      ),
      businessDepartment: new FormControl(
        config["businessDepartment"],
        Validators.required
      ),
    });
    if (this.configForm.get("isChildren").value) {
      this.configForm.addControl(
        "parent",
        new FormControl(this.config["parent"], Validators.required)
      );
      this.getParents();
    }

    this.configForm.get("isChildren").valueChanges.subscribe((isChildren) => {
      this.configForm.get("visible").enable();
      if (isChildren) {
        this.configForm.addControl(
          "parent",
          new FormControl(this.config["parent"], Validators.required)
        );
        this.getParents();
      } else {
        this.configForm.removeControl("parent");
      }
    });
  }

  submit() {
    if (this.configForm.valid) {
      const config = this.configForm.getRawValue();
      

      // config.businessDepartment.forEach(element => {
      //     const i = this.businessDepartments.findIndex(el => el.businessid === element)
      //     if(i>=0){
      //       tempArray.push(this.businessDepartments[i])
      //     }
      // });

      this.selected.forEach((ele) => {  delete ele["_id"];    delete ele["lastModified"]; });
      config.businessDepartment = this.selected;
      console.log("config",config);
      

      let filterObj = { active: true };
      this.dmsconfiguration.getConfigsByFilter(filterObj).then((res) => {
        // let existingNames = res.local.res;
        let exist;
        // console.log("filter", existingNames);

        exist = res.local.res.filter((el) => {return el.name == config.name;});
        console.log("filter123", exist);
        
  
        // debugger;

        if (this.action == 'ADD') {
          config['configId'] = this.genericService.generateUUID();
          config['active'] = true;
          if (exist.length > 0) {
            console.log("if .....................",exist.length);
            exist.forEach(element => {
              for (let i = 0; i < config.businessDepartment.length; i++) {
                element.businessDepartment.forEach(dept => {
                  console.log("ele", dept)
                  if (dept.businessid == config.businessDepartment[i].businessid) {
                    return this.snackbar.openSnackBar("Metadata with same name already exists");                    
                  } else {
                    console.log("else .....................");
                    this.dmsconfiguration.createNewConfig(config).then((result: any) => {
                      if (result && result.local && result.local.res && result.local.res.result) {
                        this.snackbar.openSnackBar(`Metadata successfully added`);
                        this.dialogRef.close(true);
                      }
                    });
                  }
                });

              }

            });
          }else {
            console.log("else .....................");
            this.dmsconfiguration.createNewConfig(config).then((result: any) => {
              if (result && result.local && result.local.res && result.local.res.result) {
                this.snackbar.openSnackBar(`Metadata successfully added`);
                this.dialogRef.close(true);
              }
            });
          }

        }
        else if (this.action == 'EDIT') {
          config['configId'] = this.config['configId'];
          if (exist .length > 0) {
            exist.forEach(element => {
              for (let i = 0; i < config.businessDepartment.length; i++) {
                element.businessDepartment.forEach(dept => {
                  console.log("ele", dept)
                  if (dept.businessid == config.businessDepartment[i].businessid && this.data.config.name != this.configForm.get('name').value) {
                    this.snackbar.openSnackBar("Metadata with same name already exists");
                  } else {
                    console.log("else .....................");
                    this.dmsconfiguration.editConfigData(config).then((result: any) => {
                      if (result && result.local && result.local.res) {
                        this.snackbar.openSnackBar(`Metadata successfully updated`);
                        this.dialogRef.close(true);
                      }
                    });
                  }
                });

              }

            });
          }else {
            console.log("else .....................");
            this.dmsconfiguration.editConfigData(config).then((result: any) => {
              if (result && result.local && result.local.res) {
                this.snackbar.openSnackBar(`Metadata successfully updated`);
                this.dialogRef.close(true);
              }
            });
          }
        }
      });
    } else {
      let error_msg = this.genericService.formValidationMessages(
        this.configForm.controls,
        this.formValidationMessages
      );
      this.snackbar.openSnackBar(error_msg);
    }
  }

  getParents() {
    if (!this.parentList) {
      const filter = {
        active: true,
        fieldType: "DDL",
        // 'visible': true
      };
      if (this.action == "EDIT")
        filter["configId"] = { $ne: this.config["configId"] };
      this.dmsconfiguration.getConfigsByFilter(filter).then((result: any) => {
        this.parentList = result.local.res;
      });
    }
  }

  onRadioChange(event: MatRadioChange, field: string) {
    const val = event.value;
    let errMsg: string;
    let revert: boolean = false;
    if (this.config[field] !== val) {
      if (field === "visible") {
        if (val === true && this.config.addedAsLink === true) {
          errMsg = `Metadata has been already linked with another metadata, Kindly delete and reconfigure.`;
          revert = true;
        } else if (val === false && this.config.linksAvailable === true) {
          errMsg = `Metadata associated with the link, Kindly delete and reconfigure.`;
          revert = true;
        }
      } else if (field === "isChildren" && this.config.valuesAvailable) {
        if (val === true)
          errMsg = `Values are already associated with parent metadata, Kindly delete and reconfigure metadata.`;
        else
          errMsg = `Values are associated without parent metadata, Kindly delete and reconfigure metadata.`;
        revert = true;
      }
    }

    if (revert) {
      this.configForm.get(field).setValue(!val);
      this.configForm.get(field).updateValueAndValidity();
      this.snackbar.openSnackBar(errMsg);
    }
  }

  checkParent(event: any, i: number) {
    const parent = this.parentList.find((el) => el.configId === event.value);
    this.configForm.patchValue({ visible: parent.visible });
    this.configForm.get("visible").disable();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  singleSelection() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
}
