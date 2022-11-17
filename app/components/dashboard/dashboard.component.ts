import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { backendService } from 'app/services/backend/backend.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  subject:string;
  status;
  pageNo=1;
  admin:boolean=false;
  currentUserInfo: any;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['title', 'ownerofawaitapproval','ownerofapproval','ownerofrejected','ownerofall', 'app1ofawaitapproval','app1ofapproval','app1ofall','app2ofawaitapproval','app2ofapproval','app2ofall', 'rjct','dateofawaitapproval','dateofapproval', 'dateofrejected'];
  rejected:boolean=false;
  dateofawaitapproval:boolean=false;
  dateofapproval:boolean=false;
  dateofrejected:boolean=false;
  dateofall:boolean=false;

  constructor(private _backend: backendService ,  private router: Router) { }

  ngOnInit() {
    this.currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));   
    if(this.currentUserInfo.su == true){
      this.admin=true;
  } else{
    this.admin=false;
  } 
    this.awtApprvl();
  }
  awtApprvl(){
    this.rejected=false;
    this.dateofawaitapproval=true;
    this.dateofapproval=false;
    this.dateofrejected=false;
    this.dateofall=false;
    this.status="awaiting";
    document.getElementById("table2").style.border= "4px solid #FF8C00";
    document.getElementById("AP").style.backgroundColor= "#FF8C00";
    document.getElementById("AP").style.color= "#ffff";
    document.getElementById("APPR").style.backgroundColor= "#e0e0e0";
    document.getElementById("APPR").style.color= "#000";
    document.getElementById("docs")? document.getElementById("docs").style.backgroundColor= "#e0e0e0" : '';
    document.getElementById("docs")? document.getElementById("docs").style.color= "#000" : '';
    document.getElementById("Reject").style.backgroundColor= "#e0e0e0";
    document.getElementById("Reject").style.color= "#000";
    this.subject="AWAITING APPROVAL";
    this.awtApprvlData();
    
  }
  awtApprvlData() {
    let params;
    // if (this.admin==true){
    //   params= {
    //     status: "awaiting",
    //     type:"File",
    //     page: 1
    // }
    // }else{
      params = {
        status: "awaiting",
        page: 1,        
        username:this.currentUserInfo.username    
    }
    // }
    
    this._backend.getFileList(params).subscribe( res => {
      let result = res.data;
      this._setDataSource(result);
   })
  }
  _setDataSource(tableData) {

      this.dataSource = new MatTableDataSource(tableData);
  }
  Apprvd(){
    this.rejected=false;
    this.dateofawaitapproval=false;
    this.dateofapproval=true;
    this.dateofrejected=false;
    this.dateofall=false;
    this.status="approved";
    document.getElementById("table2").style.border= "4px solid #008000";
    document.getElementById("APPR").style.backgroundColor= "#008000";
    document.getElementById("APPR").style.color= "#ffff";
    document.getElementById("docs")? document.getElementById("docs").style.backgroundColor= "#e0e0e0" : '';
    document.getElementById("docs")? document.getElementById("docs").style.color= "#000" : '';
    document.getElementById("Reject").style.backgroundColor= "#e0e0e0";
    document.getElementById("Reject").style.color= "#000";
    document.getElementById("AP").style.backgroundColor= "#e0e0e0";
    document.getElementById("AP").style.color= "#000";
    this.subject="APPROVED";
    this.ApprvlData();
  }
  ApprvlData() {
    let params;
    // if (this.admin==true){
    //   params= {
    //     status: "approved",
    //     type:"File",
    //     page: 1
    // }
    // }else{
      params = {
        status: "approved",       
        page: 1,
        username:this.currentUserInfo.username    
    }
    // }
    this._backend.getFileList(params).subscribe( res => {  
      let result = res.data;
      this._setDataSource(result);
   })
  }
  Reject(){
    this.rejected=true;
    this.dateofawaitapproval=false;
    this.dateofapproval=false;
    this.dateofrejected=true;
    this.dateofall=false;
    this.status="rejected";
    document.getElementById("table2").style.border= "4px solid #FF5353";
    document.getElementById("AP").style.backgroundColor= "#e0e0e0";
    document.getElementById("AP").style.color= "#000";
    document.getElementById("Reject").style.backgroundColor= "#FF5353";
    document.getElementById("Reject").style.color= "#ffff";
    document.getElementById("docs")? document.getElementById("docs").style.backgroundColor= "#e0e0e0" : '';
    document.getElementById("docs")? document.getElementById("docs").style.color= "#000" : '';
    document.getElementById("APPR").style.backgroundColor= "#e0e0e0";
    document.getElementById("APPR").style.color= "#000";
    this.subject="REJECTED";
    this.rjctData();
  }
  rjctData() {
    let params;
    // if (this.admin==true){
    //   params= {
    //     status: "rejected",
    //     type:"File",
    //     page: 1
    // }
    // }else{
      params = {
        status: "rejected",        
        page: 1,
        username:this.currentUserInfo.username    
    }
    // }
    this._backend.getFileList(params).subscribe( res => {
      let result = res.data;
      this._setDataSource(result);
   })
  }
  Docs(){
    this.rejected=false;
    this.dateofawaitapproval=false;
    this.dateofapproval=false;
    this.dateofrejected=false;
    this.dateofall=true;
    this.status="all";
    document.getElementById("table2").style.border= "4px solid #00345B";
    document.getElementById("AP").style.backgroundColor= "#e0e0e0";
    document.getElementById("AP").style.color= "#000";
    document.getElementById("docs")? document.getElementById("docs").style.backgroundColor= "#00345B" : '';
    document.getElementById("docs")? document.getElementById("docs").style.color= "#ffff" : '';
    document.getElementById("Reject").style.backgroundColor= "#e0e0e0";
    document.getElementById("Reject").style.color= "#000";
    document.getElementById("APPR").style.backgroundColor= "#e0e0e0";
    document.getElementById("APPR").style.color= "#000";
    this.subject="ALL DOCUMENT STATUS";
    this.allData();
  }
  allData() {
    let params;
    if (this.admin==true){
      params= {
        status: "all",
        page: 1,
        
    }
    }else{
      params = {
        status: "all",
        page: 1,
        
        username:this.currentUserInfo.username    
    }
    }
    this._backend.getFileList(params).subscribe( res => {
      let result = res.data;
      this._setDataSource(result);
   })
  }
  more(){
    
    if(this.status == 'awaiting'){
      this.router.navigate(['/home/status/approval']);
    }else if(this.status == 'rejected'){
      this.router.navigate(['/home/status/rejected']);
    }else if(this.status == 'approved'){
      this.router.navigate(['/home/status/approved']);
    }else if(this.status == 'all'){
      this.router.navigate(['/home/documentad']);
    }
    
    // this.pageNo=this.pageNo+1;
    // let params;
    // if (this.admin==true){
    //   params= {
    //     status: this.status,
    //   page: this.pageNo
    // }
    // }else{
    //   params = {
    //     status: this.status,
    //   page: this.pageNo,
    //   username:this.currentUserInfo.username    
    // }
    // }
    
    //  this._backend.getFileList(params).subscribe( res => {
    // let result = res.data;
    //   this.dataSource=result;
    // })
  }

}
