import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/** confirmdlgComponent takes four data and Returns action result in `response['confirmed']`, 
 * 1. 'title' default to 'Confirm'.
 * 2. `confirmActLabel` default to 'Yes'.
 * 3. `cancelActLabel` default to 'No'.
 * 4. `messageContent` default to 'Do you want to perform the action'. 
 */
@Component({
    selector: 'bh-confirmdlg',
    templateUrl: './confirmdlg.template.html'
})
export class confirmdlgComponent implements OnInit {

    title: string;
    messageContent: string;
    confirmActLabel: string;
    cancelActLabel: string;
    response: any = {};

    constructor(public dialogRef: MatDialogRef<confirmdlgComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        this.title = data['title'] || 'Confirm';
        this.confirmActLabel = data['confirmActLabel'] || 'Yes';
        this.cancelActLabel = data['cancelActLabel'] || 'No';
        this.messageContent = data['messageContent'] || `Do you want to perform the action?`;
    }

    ngOnInit() {

    }

    close() {
        this.response['confirmed'] = false;
        this.dialogRef.close(this.response);
    }

    confirmDelete() {
        this.response['confirmed'] = true;
        this.dialogRef.close(this.response);
    }

}
