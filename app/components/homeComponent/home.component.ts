import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core'
import { NPubSubService, NLocalStorageService } from 'neutrinos-seed-services';
import data from '../../../../package.json';
import { Router, ActivatedRoute } from '@angular/router';
import sidenavConfig from '../../../assets/DMS-config/sidenav.json';
import { backendService } from '../../services/backend/backend.service';
import { backend } from '../../sd-services/backend';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { searchComponent } from '../searchComponent/search.component';
import { genericService } from '../../services/generic/generic.service';
import { AuthService } from 'app/services/authService/auth.service';

@Component({
    selector: 'bh-home',
    templateUrl: './home.template.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        // the fade-in/fade-out animation.
        trigger('simpleFadeAnimation', [

            // the "in" style determines the "resting" state of the element when it is visible.
            state('in', style({ opacity: 1 })),

            // fade in when created. this could also be written as transition('void => *')
            transition(':enter', [
                style({ opacity: 0 }),
                animate(1000)
            ]),

            // fade out when destroyed. this could also be written as transition('void => *')
            transition(':leave',
                animate(0, style({ opacity: 0 })))
        ])]

})

export class homeComponent implements OnInit, OnDestroy {


    @ViewChild('searchComp', { static: true }) searchComp: searchComponent;
    searchVal;
    version;
    expandNav: boolean = false;
    spinner: boolean = false;
    pubSub: any;
    isdropdown = false;
    issearch = false;
    currentUser: String;
    userChars;
    sidenavList = [];
    activeChildRoute;
    searchPubSub;
    searchFilter;
    //expandStatus = false;
    sideMenuIndex = -1;

    constructor(public pubSubService: NPubSubService, private activatedRoute: ActivatedRoute, private router: Router,
        public localStorage: NLocalStorageService,
        private backendService: backendService,
        private backend: backend, public activeRoute: ActivatedRoute,
        public genericService: genericService,
        private _auth:AuthService,
        private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.searchVal = '';

        if (localStorage.getItem('searchKey')) {
            this.searchVal = localStorage.getItem('searchKey');
            localStorage.removeItem('searchKey');
        }

        this.version = data.version;


        this.pubSub = this.pubSubService.$sub('loader').subscribe(res => {
            this.spinner = res;
            // this.changeDetector.detectChanges();
        });

        this.searchPubSub = this.pubSubService.$sub('clearsearach').subscribe(res => {
            this.searchVal = res;
        })
        let params= {displayName:localStorage.getItem('displayName'),mail:localStorage.getItem("email")}
        if(!this.backendService.currentUserObj){
            this.backendService.currentUserObj = JSON.parse(localStorage.getItem("userInfo"));
        }
        this.currentUser =this.backendService.currentUserObj["displayName"]
        if (this.currentUser && this.currentUser.split(" ").length > 1)
            this.userChars = (this.currentUser.split(" ")[0].charAt(0) + '' + this.currentUser.split(" ")[1].charAt(0)).toUpperCase();
        else if (this.currentUser && this.currentUser.split(" ").length === 1)
            this.userChars = (this.currentUser.split(" ")[0].charAt(0) + '' + this.currentUser.split(" ")[0].charAt(1)).toUpperCase();

        this.sidenavList = this.backendService.featureSet.sort(this.sortSidenavByIndex);
        this.configExpand();

        // if(localStorage.getItem('index'))
        // {
        //     let status = false;
        //     this.sidenavList[localStorage.getItem('index')].children.map(el =>{
        //         if(this.router.url.match( el.link))
        //         {
        //             status = true;
        //         }
        //     });
        //     this.sidenavList[localStorage.getItem('index')].expandStatus = status; 
        //     if(status == false)
        //     {
        //         localStorage.removeItem("index");
        //     }            
        // }              
        //this.sidenavList.map( el => el['expandStatus'] = false);

        this.activeChildRoute = window.location.hash.split('?')[0];
        this.router.events.subscribe(res => {
            this.isdropdown = false;
            this.issearch = false;
            this.activeChildRoute = window.location.hash.split('?')[0];
        });


        this.backendService.changeEmitted.subscribe(res => {
            this.isdropdown = false;
            this.issearch = false;
        });

    }

    sortSidenavByIndex(a: any, b: any) {
        return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0);
    }

    clearSearch() {
        this.searchVal = null;
        this.searchFilter = null;
    }

    ngOnDestroy() {
        this.pubSub.unsubscribe();
    }

    loginUser() {

        this.localStorage.setValue("routeBack", window.location.hash);
        let baseUrl = this.backendService.modelerUrl;
        window.location.href = `${baseUrl}auth/login?redirectUrl=${window.location.href}`;
    }

    logoutUser() {
      this._auth.logout();
        //let baseUrl = this.backendService.modelerUrl;
        //this.localStorage.setValue('currentFolder', null);
        //window.location.href = `${baseUrl}auth/logout?redirectUrl=${window.location.href}`;
    }


    searchFiles(event?) {
        console.log('-----------------')
        localStorage.setItem('searchKey', this.searchVal);

        if (event) {
            this.searchFilter = event['searchObj'];

            let fromDate = this.genericService.setFromDate(this.searchFilter['fromDate'])
            let toDate = this.genericService.setToDate(this.searchFilter['toDate']);

            if ((fromDate && fromDate.getTime()) || (toDate && toDate.getTime())) {
                this.searchFilter['$and'] = [];
                if (fromDate && fromDate.getTime()) {

                    if (this.activeChildRoute == "#/home/status/approval")
                        this.searchFilter['$and'].push({ "data.expiryDate": { "$gte": fromDate.getTime() } })
                    else
                        this.searchFilter['$and'].push({ expiryDate: { "$gte": fromDate.getTime() } })
                }


                if (toDate && toDate.getTime()) {
                    if (this.activeChildRoute == "#/home/status/approval")
                        this.searchFilter['$and'].push({ "data.expiryDate": { $lte: toDate && toDate.getTime() || undefined } });
                    else
                        this.searchFilter['$and'].push({ expiryDate: { $lte: toDate && toDate.getTime() || undefined } });

                }

            }

            delete this.searchFilter['fromDate'];
            delete this.searchFilter['toDate'];

        }

        let regex = /\\|\||\+|\~|`|\*|\(|\)|\?|\[|\.|\%|\$|\^|\@|\!|\&|\{|\}|\[|\]|\;|\<|\=|\>|>/ig;

        let searchObj = this.searchFilter;
        if (this.searchVal)
            this.searchVal = this.searchVal.trim();
        if (this.searchVal) {
            let searchval = this.searchVal.replace(regex, (e) => { return '\\' + e; });
            searchObj = { searchObj, ...{ name: { $regex: searchval || '', $options: 'i' } } }
        }else{
            // console.log('++++++++++++++++')
            this.pubSubService.$pub('clearall', {})
        }
        if (!searchObj)
            return;

        this.pubSubService.$pub('searchFile', searchObj)
        this.searchFilter = null;

    }



    /**
     * close search dropdown
     */
    closeSearchDropdown(event) {
        this.isdropdown = event;
    }

    onExpand(i){
        localStorage.setItem('index', i);
        this.sidenavList.forEach( el => el.expandStatus = false)
        if(this.sideMenuIndex != i){
            this.sidenavList[i].expandStatus = true;
            this.sideMenuIndex = i;
        }else{
            this.sidenavList[i].expandStatus = false;
            this.sideMenuIndex = -1;
        }
    }
    configExpand(){
        //console.log(localStorage.getItem('index'))
        if(localStorage.getItem('index'))
        {
            let status = false;
            this.sidenavList[localStorage.getItem('index')].children.map(el =>{
                if(this.router.url.match( el.link))
                {
                    status = true;
                }
            });
            this.sidenavList[localStorage.getItem('index')].expandStatus = status; 
            //console.log(this.sidenavList[localStorage.getItem('index')].expandStatus)
            if(status == false)
            {
                localStorage.removeItem("index");
            }            
        }
    }
    expandSideNav(){
        this.configExpand();
        //console.log(this.expandNav)
        this.expandNav = !this.expandNav
        if(this.expandNav=== true){
            this.sidenavList.forEach( el => el.expandStatus = false)
        }
    }

}
