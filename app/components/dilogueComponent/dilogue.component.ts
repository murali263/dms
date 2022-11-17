import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { backendService } from '../../services/backend/backend.service';
import { backend } from '../../sd-services/backend';
import { E } from '@angular/cdk/keycodes';
@Component({
    selector: 'bh-dilogue',
    templateUrl: './dilogue.template.html',
    styleUrls: ['./dilogue.component.scss']
})

export class dilogueComponent implements OnInit {
    title: string;
    isApprove: boolean = false;
    isreject: boolean = false;
    isrejectmsg: boolean = false;
    isApprovemsg: boolean = false;
    rejected_reason = '';
    restore_reason = '';
    Approve_reason = '';
    ispreview: boolean = false;
    mainlink;
    payload;
    currentUserInfo: any; //for storing user info from local storage
    disableTextArea = false;
    rejectedFiles: any;
    approvedfiles: any;
    approvedfiles1: any;
    filename;
    constructor(public dialogRef: MatDialogRef<dilogueComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private backend: backend,
        public backendService: backendService) {
        this.dialogRef.disableClose = true;
        this.isApprove = data['isApprove'];
        this.isApprovemsg = data['isApprovemsg'];
        this.isrejectmsg = data['isrejectmsg'];
        this.isreject = data['isreject'];
        this.rejectedFiles = data['file'];
        this.approvedfiles = data['file'];
        this.approvedfiles1 = data['files'];
        this.ispreview = data['element'];
        this.mainlink = data['link'];
    }


    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        // console.log("userInfo",this.currentUserInfo);
        
        if (this.data.rejected_reason) {
            this.disableTextArea = true;
            this.rejected_reason = this.data.rejected_reason;
        }

        if (this.data.Approve_reason) {
            this.disableTextArea = true;
            this.Approve_reason = this.data.Approve_reason;
        }

        // this.filename= this.ispreview
        // this.mainlink = this.mainlink
        // console.log(this.filename)
        // console.log(this.mainlink)
      
    }

    closeDialog(reason) {

        reason = this.rejected_reason;
        this.dialogRef.close({ status: status });

    }

    closeRestoreDialog(status) {
        this.dialogRef.close({ reason: this.restore_reason, status: status });

    }

    hasWhiteSpace(str) {
        if (!str || !str.trim()) {
            return true;
        } else {
            return false;
        }
    }

    reject() {
        let payload: any = {};
        payload.uuid = [] = this.rejectedFiles
        payload.username = [] = this.currentUserInfo['username'].toLowerCase() || this.currentUserInfo['username'];
        payload.rejectionReason = this.rejected_reason;
        payload['approvalStatus'] = 'rejected';
        //console.log("payload",payload);
        this.backendService.multireject(payload).subscribe(res => {
            if (res['success'] == true) {
                this.closeDialog(true);
                let payload2: any ={};
                payload2.uuid = [] = this.rejectedFiles
                payload2.displayName  =  this.currentUserInfo['displayName'];
                payload2.username = this.currentUserInfo['username'];
                payload2.type = 'rejected';
                this.backendService.mailNotifications(payload2).subscribe(res =>{
                    console.log("resp",res);
                })

            }
        });


    }

    approve() {
        let payload: any = {};
        payload.uuid = [] = this.approvedfiles
        payload.fsuuid = [] = this.approvedfiles1
        payload.username = [] = this.currentUserInfo['username'].toLowerCase() || this.currentUserInfo['username'];
        payload.approvalReason = this.Approve_reason;
        payload['approvalStatus'] = 'approved';
        // console.log("payload",payload);
        this.backendService.multiApprove(payload).subscribe(res => {
            if (res['success'] == true) {                  
                this.closeDialogapprove(true); 
                let payload2: any = {};
                payload2.uuid = [] = this.approvedfiles;
                payload2.displayName =  this.currentUserInfo['displayName'];
                payload2.username  = this.currentUserInfo['username'];
                payload2.type = 'approved';
                console.log("payload2",payload2);
                
                this.backendService.mailNotifications(payload2).subscribe(res =>{
                    console.log("resp",res);
                })
                

            }

        });


    }

    closeDialogapprove(reason) {
        reason = this.Approve_reason;
        this.dialogRef.close({ status: status });

    }
    close() {
        this.dialogRef.close({
            "cancel": true
        });
    }

    cancelDownload(){
        this.dialogRef.close({cancel:true});
    }
}
function reason(reason: any, status: string) {
    throw new Error('Function not implemented.');
}

