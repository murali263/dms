import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { emailbot } from 'app/sd-services/emailbot';
import { backendService } from '../../services/backend/backend.service';
import { NSnackbarService } from 'neutrinos-seed-services';
import { genericService } from '../../services/generic/generic.service';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { MatDialog } from '@angular/material';
import { dilogueComponent } from '../dilogueComponent/dilogue.component';

@Component({
    selector: 'bh-casedetails',
    templateUrl: './casedetails.template.html',
    styleUrls: ['./casedetails.component.scss']

})

export class casedetailsComponent implements OnInit {
    caseData = [];
    fileObj;
    documentData = [];
    docNotFoundCount;
    dataFound: boolean = false;

    constructor(public activeRoute: ActivatedRoute,
        private emailbot: emailbot,
        private backendservice: backendService,
        private snackbar: NSnackbarService,
        public genericService: genericService,
        private router: Router,
        public dialog: MatDialog,
    ) {


    }

    ngOnInit() {
        this.getCaseDetails();
    }

    /**
     * Get current csae details
     */
    getCaseDetails() {
        let filterObj;
        let decodedFilter = JSON.parse(atob(this.activeRoute.snapshot.queryParamMap.get('id')));
        filterObj = { 'uuid': decodedFilter };
        this.emailbot.getCaseList(1, filterObj).then(res => {
            this.caseData = res.local.res[0];
            this.documentData = this.caseData['botFSDocs'];
            if (this.documentData.length > 0)
                this.dataFound = true;
            this.docNotFoundCount = this.documentData.filter(x => x.notFound == true).length;
        });
    }

    //Function to upload selected file to the server.
    handleFileInput(event, caseData?) {
        let files = event['target']['files'];
        let fileName = files[0].name;
        if (files[0]) {
            let fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onloadend = (x) => {
                if (files[0].size > 26214400) {
                    this.snackbar.openSnackBar('Document size exceeds the maximum limit of 25mb. Please try again with document less in size')
                } else if (/(\.png|\.doc|\.jpg|\.jpeg|\.docx|\.html|\.htm|\.odt|\.pdf|\.xls|\.xlsx|\.csv|\.ods|\.ppt|\.pptx|\.txt)$/i.test(files[0].name.substring(files[0].name.lastIndexOf('.')))) {
                    this.uploadFile(files[0], fileName, files[0].name.substring(files[0].name.lastIndexOf('.') + 1), caseData);
                } else {
                    this.snackbar.openSnackBar('Upload valid file ')
                }
            }
        }
    }


    /**
     * upload file
     * @param content :content of file
     * @param fileName :name of the file uploaded
     * @param fileextension :file extension
     */

    uploadFile(content, fileName, fileextension, fileData) {
        let botFSDocs = fileData.botFSDocs.filter(value => value.name == fileName)
        if (botFSDocs.length > 0) {
            this.snackbar.openSnackBar('File with same name already exists.');
            return false;
        }
        else
            this.backendservice.uploadfile(content, fileName, fileextension).subscribe(res => {
                this.fileObj = res as any;
                this.fileObj['extension'] = fileextension;
                this.fileObj['name'] = fileName;

                let fsuuid = "FL_" + this.genericService.generateUUID();
                this.fileObj['fsuuid'] = fsuuid;

                let filterObj = {
                    'uuid': this.caseData['uuid']
                }

                let updateObj = {
                    "$push": {
                        "botFSDocs": {
                            "name": fileName,
                            "fsuuid": fsuuid,
                            "fileName": this.fileObj.fileName,
                            "generated": false,
                            "status": "completed",
                            "notFound": false,
                            "index": this.documentData.length,
                            "clientContainerName": this.fileObj.clientContainerName
                        }

                    }
                }

                let reqBody = {
                    filter: filterObj,
                    updateObj: updateObj,
                    action: 'push',
                    parentId: `DR_${this.caseData['uuid']}`,
                    productCode: this.caseData['productCode'],
                    caseId: this.caseData['caseId'],
                    logicalPath: `/Cases/${this.caseData['caseId']}`,
                    fileDetails: this.fileObj,
                    fsuuid: fsuuid,
                    "generated": false,
                }

                this.emailbot.updateCaseDetails(reqBody).then(data => {
                    this.getCaseDetails();
                })
            });



    }

    /**
    * Creates an downloadable link of the file.
    * @param filePath :FileName or FilePath url
    */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        this.backendservice.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    /**
     * Removes an docs from botFs Docs
     * @param fileObj : FileObject of the bot generated docs
     */
    removeFile(fileObj, fileData) {
        let filterObj = {
            'uuid': `${this.caseData['uuid']}`
        }

        let updateObj = {
            "$pull": {
                "botFSDocs": { fsuuid: fileObj.fsuuid },
            }
        }
        let reqBody = {
            filter: filterObj,
            updateObj: updateObj,
            action: 'pop',
            parentId: `DR_${this.caseData['uuid']}`,
            fsuuid: fileObj.fsuuid
        }

        this.emailbot.updateCaseDetails(reqBody).then(data => {
            this.getCaseDetails();
        })
    }

    /**
     * Send Requested docs back
     */
    sendToRequester(fileData) {
        let statusCompleted;
        let filterObj;
        filterObj = {
            'uuid': `${this.caseData['uuid']}`,
            "status": "completed"
        };
        this.emailbot.getCaseList(1, filterObj).then(res => {
            statusCompleted = res.local.res;
            if (statusCompleted.length > 0) {
                this.errorMessagePopup(fileData);
            }
            else {
                let reqBody = {
                    'uuid': `${this.caseData['uuid']}`
                }
                this.emailbot.caseStatus(reqBody).then(data => {
                    this.router.navigate([`home/case`]);
                })
            }
        });
    }

    errorMessagePopup(item) {
        this.dialog.open(deletegroupComponent, {
            width: '30%',
            data: {
                msg: 'Document already shared with the requester by another reviewer. Please choose some other new request from the list',
                positiveButton: 'Ok'
            },
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res['status']) {
                this.router.navigate([`home/case`]);
            }
        })
    }



}
