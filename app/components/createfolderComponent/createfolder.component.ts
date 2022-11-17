
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NSnackbarService } from 'neutrinos-seed-services';

@Component({
    selector: 'bh-createfolder',
    templateUrl: './createfolder.template.html',
    styleUrls: ['./createfolder.component.scss']
})

export class createfolderComponent implements OnInit {
    FSname: string;

    constructor(public dialogRef: MatDialogRef<createfolderComponent>, @Inject(MAT_DIALOG_DATA) public data, private snackBar: NSnackbarService, ) {

    }

    ngOnInit() {
        this.FSname = this.data.name;
    }

    closeDialog(status) {
        if (status) {
            if (this.FSname.length == 0 || !this.FSname.match(/^(?!\s*$)[^\\/:*?"<>|#{}%~&'']{1,100}$/)) {
                this.snackBar.openSnackBar('Please enter valid folder name');
            } else if (this.FSname.length > 60) {
                this.snackBar.openSnackBar('Folder name cannot be more than 60 characters');
            } else if (this.FSname.length > 0) {
                let FSobj = { currentFSName: this.FSname, currentFSobj: this.data, status: status }
                this.dialogRef.close(FSobj);
            }
        } else {
            let FSobj = { currentFSName: this.FSname, currentFSobj: this.data, status: status }
            this.dialogRef.close(FSobj);
        }


    }

}
