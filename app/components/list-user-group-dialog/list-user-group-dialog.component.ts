import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-list-user-group-dialog',
  templateUrl: './list-user-group-dialog.component.html',
  styleUrls: ['./list-user-group-dialog.component.scss']
})
export class ListUserGroupDialogComponent implements OnInit {
  listHeader: any = 'Header';
  listArr = [];
  listArr2=[];
  constructor(public dialogRef: MatDialogRef<ListUserGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {  

      this.dialogRef.disableClose = true;
      this.listArr=data.listdata;
     // this.listArr2=data.listArr2;
     
    }

  ngOnInit() {
    
  }

}
