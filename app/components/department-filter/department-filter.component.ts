import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Output, EventEmitter  } from '@angular/core';
import { backendService } from '../../services/backend/backend.service';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-department-filter',
  templateUrl: './department-filter.component.html',
  styleUrls: ['./department-filter.component.scss']
})
export class DepartmentFilterComponent implements OnInit {
  
  filterDeptForm: FormGroup;
  businessDepartments = [];
  businessDepartment = []

  @ViewChild('allSelected',{static: true}) private allSelected: MatOption;
  @Output() applyclick: EventEmitter<any> = new EventEmitter();
  @Output() resetclick: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    private backendService: backendService,) { }

  ngOnInit() {
    this.configfilter();
  }
  configfilter(){
    this.filterDeptForm = this.formBuilder.group({
        filter: new FormControl('')
      });
      this.backendService.businessDepartments().subscribe(res => {
        this.businessDepartments = res.data;
        //console.log(this.businessDepartments);
    });

}
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.filterDeptForm.controls.filter
        .patchValue([...this.businessDepartments.map(item => item.businessid),0]);
    } else {
      this.filterDeptForm.controls.filter.patchValue([]);
    }
  }

  toggleSelectionOne(all) {
    if(this.allSelected.selected){
      this.allSelected.deselect();
      return false;
    }
    if(this.filterDeptForm.controls.filter.value.length == this.businessDepartments.length)
    this.allSelected.select();
    
  }

  applyFilter(){
    this.businessDepartment = this.filterDeptForm.value.filter
    //console.log(this.businessDepartment)
    this.applyclick.emit(this.businessDepartment);
  }
  reset(){
    this.filterDeptForm.reset();
    this.resetclick.emit();
  }

}
