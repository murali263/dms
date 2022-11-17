import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'bh-viewnotes',
    templateUrl: './viewnotes.template.html',
    styleUrls: ['./viewnotes.component.scss']
})

export class viewnotesComponent implements OnInit {
    notes;

    constructor(public dialogRef: MatDialogRef<viewnotesComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        this.notes = this.data.notes;
    }

}
