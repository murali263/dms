import { Component, OnInit, ViewChild, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { backend } from '../../sd-services/backend';
import { documentschildComponent } from '../../components/documentschildComponent/documentschild.component'
import { backendService } from '../../services/backend/backend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { documentdetailsComponent } from '../documentdetailsComponent/documentdetails.component';
import { genericService } from '../../services/generic/generic.service';


@Component({
    selector: 'bh-documentsparent',
    templateUrl: './documentsparent.template.html',
    styleUrls: ['./documentsparent.component.scss']
})

export class documentsparentComponent implements OnInit, OnDestroy {

    @ViewChild('docsChild', { static: false }) docsChild: documentschildComponent;

    @ViewChild('docsChildDetails', { static: true }) docsChildDetails: documentdetailsComponent;

    @ViewChild('navPanel', { static: false }) public navPanel: ElementRef<any>;
    showDocument = false;
    currentLinkPath = "Master";
    privilegegroupArr = [{
        name: 'DMS Super User Group',
        groupId: 'super_user',
        read: true,
        write: true
    }]
    currentLinkArr = [];
    currentFolder;

    currentFolderIndex;

    currentFsDataObj = {
        folderArr: [],
        fileArr: []
    };
    isSearch = false;
    encodedFilterObj: any;

    pubSub: any;

    searchPubSub;

    domChange = new EventEmitter();
    changes: MutationObserver;
    hasScroll: boolean = false;

    retainBack: boolean = false;

    currentDocView;
    currentDoc;

    pageNumber: number = 1;
    pageSize: number = 100;
    showLoadMore: boolean = true;

    constructor(
        private backend: backend,
        public backendService: backendService,
        private router: Router,
        private route: ActivatedRoute,
        public pubSubService: NPubSubService,
        public genericService: genericService,
        private snackBar: NSnackbarService,
        private nLocalStorage: NLocalStorageService) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
        // To get current folder instance
        let currentFolder = this.nLocalStorage.getValue('currentFolder');

        if (currentFolder)
            this.currentFolder = JSON.parse(decodeURIComponent(atob(currentFolder)));
        let filter = this.route.snapshot.queryParamMap.get('filter');
        if (filter) {
            this.encodedFilterObj = JSON.parse(decodeURIComponent(atob(filter)));
            this.triggerSearch(this.encodedFilterObj);
        }
        else if (this.currentFolder && this.currentFolder.type == 'File')
            this.__setDocViewer(this.currentFolder);
        else if (this.currentFolder && this.currentFolder.path)
            this._getFSData(btoa(encodeURIComponent(JSON.stringify(this.currentFolder.path))));
        else
            this._getFSData(btoa(encodeURIComponent(JSON.stringify('/'))));
    }

    ngOnInit() {
        this.pubSub = this.pubSubService.$sub('operation').subscribe(res => {
            this.pageNumber = 1;
            this._getFSData(res['logicalPath']);
        });

        this.searchPubSub = this.pubSubService.$sub('searchFile').subscribe(res => {
            this.encodedFilterObj = btoa(encodeURIComponent(JSON.stringify(res)));
            this.searchFiles(this.encodedFilterObj);
        });

    }
    viewerError(event) {
        this.showDocument = false;
        this.snackBar.openSnackBar(event);
        // let encodedFilter = btoa(JSON.stringify(this.currentFolder.logicalPath));
        // this._getFSData(encodedFilter);
    }

    ngAfterViewInit() {
        // Scroll Detection Logic start
        let element = this.navPanel.nativeElement;
        this.changes = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => {
                this.hasScroll = mutation.target['scrollWidth'] > mutation.target['clientWidth'];
                this.domChange.emit(mutation);
            });
        });

        this.changes.observe(element, {
            attributes: false,
            childList: true,
            characterData: false
        });
        // Scroll Detection Logic End
    }

    /**
     * To get the FS Data
     */
    _getFSData(lPath) {
        this.showDocument = false;
        delete this.currentDoc;
        this.currentDocView = "";
        let logicalPath = JSON.parse(decodeURIComponent(atob(lPath)));
        let filter = {};
        if (this.currentFolder && this.currentFolder['fsuuid'] && logicalPath != '/')
            filter = { objectPath: { "$in": [this.currentFolder['fsuuid']] }, "hidden": { "$exists": false } }

        if (logicalPath == '/') {
            this.nLocalStorage.setValue('currentFolder', null);
            this.currentFolder = null;
        }

        this.backend.getCurrentFS(logicalPath, filter, { timestamp: -1 }, this.pageNumber, this.pageSize).then((res) => {
            this.docsChildDetails._getFSObject(null);
            const result = res['local']['res'] as any[];
            if (result && result.length === this.pageSize)
                this.showLoadMore = true;
            else
                this.showLoadMore = false;
            this.currentLinkArr = [];
            if (this.pageNumber > 1) {
                this.currentFsDataObj.fileArr = this.currentFsDataObj.fileArr || [];
                this.currentFsDataObj.folderArr = this.currentFsDataObj.folderArr || [];
                let fileArr = result.filter(el => el.type == 'File');
                fileArr = this.genericService.getUniqueArrayWithLatestFiles(fileArr)
                this.currentFsDataObj.fileArr.push(...fileArr);
                this.currentFsDataObj.folderArr.push(...result.filter(el => el.type == 'Folder'));
            } else {
                this.currentFsDataObj.fileArr = result.filter(el => el.type == 'File');
                this.currentFsDataObj.fileArr = this.genericService.getUniqueArrayWithLatestFiles(this.currentFsDataObj.fileArr);
                this.currentFsDataObj.folderArr = result.filter(el => el.type == 'Folder');
                this.currentFsDataObj.folderArr = this.genericService.getUniqueArray(this.currentFsDataObj.folderArr, 'fsuuid');
            }
            this.currentLinkArr = logicalPath.split('/');
            this.isSearch = false;
            this.docsChild._updateFs(this.currentFsDataObj, true);
        });
    }

    /**
     * Event trigger from child on single click
     * @param : Child event element
    */
    childSingleclickFSDetail(event) {
        this.docsChildDetails._getFSObject(event);
    }
    childSingleclickFSDetailPosition(eventPos) {
        this.docsChildDetails.switchTab(eventPos);
    }

    /**
     * Event triggered from child when folder is triggered.
     * @param event :Child event element
     */
    childFSAction(event) {
        this.pageNumber = 1;
        let encodedFilter = this.__navChangeActions(event);
        if (event.type == 'File') {

            this.__setDocViewer(event);
        } else {
            // Change Parent Folder
            this.currentFolder = event;
            this._getFSData(encodedFilter);

        }
    }

    __setDocViewer(event) {
        this.showDocument = true;
        this.currentDocView = `${this.backendService.modelerUrl}modelr/api/getFile?fileName=${event.fileName}&clientContainerName=${event.clientContainerName}&view=true`;
        this.currentDoc = event;       
    }

    __navChangeActions(event) {

        this.currentLinkPath = 'Master';
        let currentPath = (event['logicalPath'] == '/' ? `${event['logicalPath']}${event['name']}` : `${event['logicalPath']}/${event['name']}`)
        let encodedFilter = btoa(encodeURIComponent(JSON.stringify(currentPath)));
        let encodedCurrentFolder = btoa(encodeURIComponent(JSON.stringify(this.currentFolder)));
        this.nLocalStorage.setValue('currentFolder', encodedCurrentFolder);
        this.getNavLinks(event);
        this.router.navigate(['/home/documents']);
        return encodedFilter;
    }
    /**
     * Recreates a  parent FS obj on nav link click
     * @param index : currentLinkArr Index
     * @param uuid : uuid of currentLinkArr array
     */
    linkChange(index) {
        if (index == 0)
            return false;
        this.pageNumber = 1;
        this.docsChildDetails._getFSObject(null);
        this.docsChild.isFocusedFolder = this.docsChild.isFocusedFile = false;
        this.currentLinkArr.length = index + 1;
        let currentLogicalPath = this.currentLinkArr.join('/');
        this.currentFolderIndex = index;
        if (currentLogicalPath && index > 0) {
            let currentFolderID = this.currentFolder && this.currentFolder.objectPath[index];
            if (index > 0 && currentLogicalPath != '/' && this.currentFolder) {
                this.backend.getFolderFS({ fsuuid: currentFolderID || this.currentFolder.fsuuid }).then(data => {
                    this.currentFolder = data.local.res[0];
                    let encodedCurrentFolder = btoa(encodeURIComponent(JSON.stringify(this.currentFolder)));
                    this.nLocalStorage.setValue('currentFolder', encodedCurrentFolder);
                    this._getFSData(btoa(encodeURIComponent(JSON.stringify(currentLogicalPath))));
                });
            } else {
                this.nLocalStorage.setValue('currentFolder', null);
                this.currentFolder = undefined;
                this._getFSData(btoa(encodeURIComponent(JSON.stringify(currentLogicalPath))));
            }
        }


    }

    openRootFS() {
        this.pageNumber = 1;
        this._getFSData(btoa(encodeURIComponent(JSON.stringify('/'))));
        this.docsChildDetails._getFSObject(null);
        this.docsChild.isFocusedFolder = this.docsChild.isFocusedFile = false;
        this.pubSubService.$pub('clearsearach', '')
    }

    openRootFSback() {
        this.pageNumber = 1;
        this._getFSData(btoa(encodeURIComponent(JSON.stringify('/'))));
        this.docsChildDetails._getFSObject(null);
        this.docsChild.isFocusedFolder = this.docsChild.isFocusedFile = false;
    }

    /**
     * Returns fs object based on UUID
     * @param uuid : UUID of FS
     */
    getfolderObj(uuid) {
        return this.currentFsDataObj.folderArr.find(x => x.uuid == uuid);
    }

    /**
     * Creates an currentLinkArr of links
     * @param currentFolder : Current folder Object
     */
    getNavLinks(currentFolder) {
        this.currentLinkArr = currentFolder.logicalPath.split('/');
    }


    /**
     * Creates a new folder
     */
    createFolder() {
        if (this.currentLinkArr.length > 20) {
            this.snackBar.openSnackBar('subfolders can be created upto 20 only');
            return false;
        }
        let newFolderObj = {
            name: '',
            objectPath: this.currentFolder ? [...this.currentFolder.objectPath, ...(this.currentFolder.fsuuid ? this.currentFolder.fsuuid : '')] : [null],
            logicalPath: this.currentFolder ? (this.currentFolder.logicalPath == '/' ? `/${this.currentFolder['name']}` : `${this.currentFolder['logicalPath']}/${this.currentFolder['name']}`) : '/',
            action: 'create',
            trash: false,
            privilegegroup: this.currentFolder ? this.currentFolder['privilegegroup'] : this.privilegegroupArr
        }

        // this.docsChild.currentAction = 'create';
        this.currentFsDataObj.folderArr.push(newFolderObj);
        this.isSearch = false;
        this.docsChild._updateFs(this.currentFsDataObj)
        this.docsChild.createFolderPop();
        this.docsChild.triggerFalseClick();
    }

    /**
     * Upload file route
     */
    navigateToUpload() {
        let folderFilter = btoa(encodeURIComponent(JSON.stringify(this.currentFolder)));
        this.nLocalStorage.setValue('filter', folderFilter);
        this.retainBack = true;
        this.router.navigate(['/home/documents/uploadfile']);
    }

    ngOnDestroy() {
        this.pubSub.unsubscribe();
        this.searchPubSub.unsubscribe();
        this.changes.disconnect();
        if (!this.retainBack && !this.docsChild.retainBack) {
            this.nLocalStorage.setValue('folderFilter', null);
            this.nLocalStorage.setValue('currentFolder', null);
        }
    }


    searchFiles(filterObj) {
        let encodedFilter = btoa(JSON.stringify(filterObj));
        this.router.navigate(['/home/documents'], { queryParams: { filter: encodedFilter } });

        this.triggerSearch(filterObj);
        this.currentLinkArr = []
        this.docsChildDetails._getFSObject(null);
        this.docsChild.isFocusedFolder = this.docsChild.isFocusedFile = false;
    }

    triggerSearch(filterObj) {
        this.nLocalStorage.setValue('currentFolder', null);
        let decodedFilter = JSON.parse(decodeURIComponent(atob(filterObj)));
        let name = decodedFilter.name;
        decodedFilter = decodedFilter.searchObj || decodedFilter;

        filterObj = {
            "type": "File",
            "name": name,
            "businessDivision": decodedFilter.businessDivision,
            "supplier": decodedFilter.supplier,
            "region": decodedFilter.region,
            "language": decodedFilter.language,
            "documentType": decodedFilter.documentType,
            "$and": decodedFilter.$and,
            "hidden": { "$exists": false },
        };
        if (decodedFilter.meta && Object.keys(decodedFilter.meta).length)
            filterObj['meta'] = decodedFilter.meta;

        if (decodedFilter.adlinkdata && Object.keys(decodedFilter.adlinkdata).length)
        filterObj['adlinkdata'] = decodedFilter.adlinkdata;

        Object.keys(filterObj).forEach((data, i) => {
            if (!filterObj[data]) {
                delete filterObj[data];
            }
        })

        this.backend.searchFS({ ...filterObj, ...{ trash: false, type: 'File', latest: true } }, {}, this.pageNumber, this.pageSize).then(res => {
            this.isSearch = true;
            let fileObj;
            this.backendService.emitChange({ closeSearch: true });
            const result = res.local.res as any[];
            if (result.length === this.pageSize)
                this.showLoadMore = true;
            else
                this.showLoadMore = false;
            if (result && result.length > 0) {
                if (this.pageNumber > 1) {
                    this.currentFsDataObj.fileArr = this.currentFsDataObj.fileArr || [];
                    this.currentFsDataObj.fileArr.push(...this.genericService.getUniqueArrayWithLatestFiles(result));
                } else {
                    this.currentFsDataObj.fileArr = result.filter(el => el.type == 'File');
                    this.currentFsDataObj.fileArr = this.genericService.getUniqueArrayWithLatestFiles(this.currentFsDataObj.fileArr);
                }
                fileObj = {
                    fileArr: this.genericService.getUniqueArrayWithLatestFiles(res.local.res)
                }
                this.docsChild._updateFs(this.currentFsDataObj, true);
            } else {
                this.docsChild._updateFs({ fileArr: res.local.res });
                this.snackBar.openSnackBar('No Result Found');
            }
        });
    }

    /**
     * Check Current folder permissions
     * @param currentFolder :Current folder Object
     */
    checkFolderPermission(currentFolder) {
        let currentFolderGroups = [];
        currentFolder.privilegegroup.forEach(el => {
            if (this.backendService.userGroup.includes(el.groupId))
                currentFolderGroups.push(el);
        });
        if (currentFolderGroups.find(x => x.write == true))
            return 'RW';
        else if (currentFolderGroups.find(x => x.read == true))
            return 'R';
        else
            return 'N';
    }

    /**
     * Check Create Folder permissions
     */
    checkFolderCreatePermission() {
        if (this.backendService.userGroup.includes('super_user'))
            return true;
        else if (this.currentFolder)
            return this.checkFolderPermission(this.currentFolder) == 'RW' && this.backendService.getAccessAction().includes('folder_creation');
        else
            return false;
    }


    /**
     * Check whether user has create or upload options
     */
    checkhasCUOptions() {
        if (!this.currentFolder)
            return this.checkFolderCreatePermission();
        else if (this.checkFolderPermission(this.currentFolder) == 'RW')
            return this.backendService.getAccessAction().includes('folder_creation') || this.backendService.getAccessAction().includes('document_upload_status');
        else
            return false;
    }

    /**
     * Event triggered on arrow icons click .
     * @param direction : Previous(P) or Next(N) arrows icon click
     */
    onNavClick(direction) {
        if (direction == 'P')
            this.navPanel.nativeElement.scrollLeft -= 100;
        else
            this.navPanel.nativeElement.scrollLeft += 100;

    }

    //On breadcumb div change event
    onDomChange(event) {

    }
    /**
         * Creates an downloadable link of the file.
         * @param filePath :FileName or FilePath url
         */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    /**
     * Load more items to the documents List
     */
    loadMore() {
        this.pageNumber++;
        if (this.isSearch) {
            this.searchFiles(this.encodedFilterObj);
        } else {
            if (this.currentFolder && this.currentFolder.path)
                this._getFSData(btoa(encodeURIComponent(JSON.stringify(this.currentFolder.path))));
            else
                this._getFSData(btoa(encodeURIComponent(JSON.stringify('/'))));
        }
    }
}
