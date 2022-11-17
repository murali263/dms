import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'bh-listdialog',
    templateUrl: './listdialog.template.html'
})

export class listdialogComponent implements OnInit {


    listHeader: any = 'Header';
    listArr = [];


    constructor(public dialogRef: MatDialogRef<listdialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.dialogRef.disableClose = true;

    }

    ngOnInit() {
        
        
    }

}
