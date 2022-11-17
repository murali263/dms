import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { backendService } from '../../services/backend/backend.service';


@Component({
    selector: 'bh-versionhistory',
    templateUrl: './versionhistory.template.html',
    styleUrls: ['./versionhistory.component.scss']
})

export class versionhistoryComponent implements OnInit {

    versionData;

    constructor(private backendService: backendService,
        public dialogRef: MatDialogRef<versionhistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.versionData = this.data['versionData'];
    }

    /**
  * Creates an downloadable link of the file.
  * @param filePath :FileName or FilePath url
  */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        this.backendService.downloadFile(filePath, fileName, this.data.fsuuid,  clientContainerName);
    }

}

