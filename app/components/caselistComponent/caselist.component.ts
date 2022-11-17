/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit } from '@angular/core';
import { emailbot } from 'app/sd-services/emailbot';
import { Router } from '@angular/router';


@Component({
    selector: 'bh-caselist',
    templateUrl: './caselist.template.html',
    styleUrls: ['./caselist.component.scss']
})

export class caselistComponent implements OnInit {
    showloadmore = false;
    caseList = [];
    pageNumber = 1;
    disableLoadmore = true;
    dataFound: boolean = false;

    constructor(private emailbot: emailbot, private router: Router) {

    }

    ngOnInit() {
        this.loadCaseList();
    }

    loadCaseList() {
        let filterObj = {
            "botFSDocs.status": { "$ne": "processing" },
            "requestType": "Standard",
            "status": "triggered"
        };
        this.emailbot.getCaseList(this.pageNumber, filterObj, { timestamp: -1 }).then(res => {
            this.caseList.push.apply(this.caseList, res.local.res);
            if (this.caseList.length > 0)
                this.dataFound = true;
            if (this.caseList.length >= 10) {
                this.showloadmore = true;
                this.pageNumber++;
            }
        });
    }

    redirectToCaseDetails(caseDetails) {
        let id = caseDetails.uuid;
        let encodedFilter = btoa(JSON.stringify(id));
        //this.router.navigate([`home/caseDetails?id=${encodedFilter}`]);
        this.router.navigate([`home/case/caseDetails`], { queryParams: { id: encodedFilter } });
    }

}
