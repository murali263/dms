import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { backendService } from 'app/services/backend/backend.service';

@Component({
  selector: 'app-show-user-list-dialog',
  templateUrl: './show-user-list-dialog.component.html',
  styleUrls: ['./show-user-list-dialog.component.scss']
})
export class ShowUserListDialogComponent implements OnInit {

  constructor(private backendService:backendService,
    public dialogRef: MatDialogRef<ShowUserListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }
  dataSource = new MatTableDataSource();
  userList=[]
  displayedColumns = ['user','privilegegroup', 'access'];
  public searchText:string;

  ngOnInit() {
    console.log(this.data)
    this.getFSUserListData(this.data.item)
  }

  getFSUserListData(item){
    let params = {uuid:item.uuid}
    this.backendService.getFSUserList(params).subscribe(res=>{
      if(res.success==true){
        this.userList=res.data;
        this.dataSource = new MatTableDataSource(this.userList);
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          return data.user.displayName.toLowerCase().includes(filter.toLowerCase());
         };
      }
      console.log(this.dataSource)
    })
  }

  toClose(): void {
    this.dialogRef.close();
  }

  searchFilter(){
    this.dataSource.filter=this.searchText;
  }
}
