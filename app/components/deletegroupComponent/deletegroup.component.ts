/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'bh-deletegroup',
    templateUrl: './deletegroup.template.html',
    styleUrls: ['./deletegroup.component.scss']
})

export class deletegroupComponent implements OnInit {


    constructor(public dialogRef: MatDialogRef<deletegroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {

    }
      
    closeDialog(status) {
        this.dialogRef.close({status:status});
    }

}
