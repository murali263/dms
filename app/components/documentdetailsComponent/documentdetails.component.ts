import { Component, OnInit } from '@angular/core'
import { backend } from 'app/sd-services/backend';
import { dmsusers } from 'app/sd-services/dmsusers';
import { audit } from 'rxjs/operators';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration';

@Component({
    selector: 'bh-documentdetails',
    templateUrl: './documentdetails.template.html',
    styleUrls: ['./documentdetails.component.scss']
})

export class documentdetailsComponent implements OnInit {

    folderdetails;
    filedetails;
    auditList = [];
    currentTab = 0;
    pageNumber = 1;
    showloadmore = false;
    metadata;
    

    constructor(
        private backend: backend, private dmsconfiguration: dmsconfiguration
    ) { }

    ngOnInit() {
    }
    /**
     * display details of folders and files. 
     */

    switchTab(activeTab = 0) {
        //resating data on tab change
        this.currentTab = activeTab;
        this.auditList = [];
        this.pageNumber = 1;
        this.showloadmore = false;
        this.loadAudit()
    }
    _getFSObject(FSobj) {

        if (FSobj && !FSobj.uuid) {
            this.folderdetails, this.filedetails = null;
        } else
            if (FSobj == null || FSobj.type == 'Folder') {
                this.folderdetails = FSobj;
                this.filedetails = null;
            } else {
                this.filedetails = FSobj;
                //console.log(this.filedetails)
                let fsuuid = FSobj.fsuuid
                
                let addata = {};
                this.dmsconfiguration.getConfigdataByUuid(fsuuid).then(res => {
                    this.metadata = res.local.res.filter(e => e.value != "");
                    

                    addata["adfield"] = Object.keys(FSobj.adlinkeddata)
                    console.log(FSobj.adlinkeddata)
                })
                this.folderdetails = null;
            }
        // this.loadAudit();
    }

    rowdata(rowdata) {
        console.log("2")
        console.log(rowdata)
       if(rowdata == null){
        this.filedetails = null;
       }
       else{
        this.filedetails = rowdata.data;
        //console.log(this.filedetails)
        let fsuuid = this.filedetails.fsuuid
        console.log(fsuuid)
        this.dmsconfiguration.getConfigdataByUuid(fsuuid).then(res => {
            console.log(res)
            this.metadata = res.local.res.filter(e=>e.value != "");
        });
        this.loadAudit()
       }
    }

    rowdataothers(rowdata) {
        console.log("3")
        if(rowdata == null){
         this.filedetails = null;
        }
        else{
            this.filedetails = rowdata;
            //console.log(this.filedetails)
            let fsuuid = this.filedetails.fsuuid
         this.dmsconfiguration.getConfigdataByUuid(fsuuid).then(res => {
             //console.log(res)
             this.metadata = res.local.res.filter(e=>e.value != "");
         });
         this.loadAudit()
        }
     }

    loadAudit() {
       // console.log(this.metadata)
        if(!this.showloadmore) this.auditList = []; 
        if (this.filedetails != null)
            this.backend.auditLog(this.filedetails.fsuuid, this.pageNumber).then(res => {
                //console.log(res)
                this.auditList.push.apply(this.auditList, res.local.res.audit);
                if (res.local.res.audit.length >= 10) {
                    this.showloadmore = true;
                    this.pageNumber++;
                } else {
                    this.showloadmore = false;
                }
            });
    }

}