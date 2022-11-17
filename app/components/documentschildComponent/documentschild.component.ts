import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, Renderer } from '@angular/core'
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { backend } from '../../sd-services/backend'
import { backendService } from '../../services/backend/backend.service';
import { genericService } from '../../services/generic/generic.service';
import { NPubSubService, NLocalStorageService, NSnackbarService } from 'neutrinos-seed-services';
import { versionhistoryComponent } from '../versionhistoryComponent/versionhistory.component';
import { dmsusers } from '../../sd-services/dmsusers';
import { Router } from '@angular/router';
import { viewnotesComponent } from '../viewnotesComponent/viewnotes.component';
import { deletegroupComponent } from '../deletegroupComponent/deletegroup.component';
import { dilogueComponent } from '../dilogueComponent/dilogue.component'
import { createfolderComponent } from '../createfolderComponent/createfolder.component';
import { MovePopupComponent } from '../move-popup/move-popup.component';
import { ShowUserListDialogComponent } from '../show-user-list-dialog/show-user-list-dialog.component';
import * as JSZip from 'jszip';
import { confirmdlgComponent } from '../confirmdlgComponent/confirmdlg.component';

@Component({
    selector: 'bh-documentschild',
    templateUrl: './documentschild.template.html',
    styleUrls: ['./documentschild.component.scss']
})

export class documentschildComponent implements OnInit {

    @Input('currentFsDataObj') currentFsDataObj;
    @Input('currentFolder') currentFolder;

    @Output() folderActionEvent = new EventEmitter<any>();
    @Output() crudEvent = new EventEmitter<any>();
    @Output() singleclickFolderActionEvent = new EventEmitter<any>();
    @Output() singleclickFolderActionPositionEvent = new EventEmitter<any>();

    @ViewChild('folderInput', { static: false }) folderInput: ElementRef<HTMLElement>;

    @ViewChild(MatMenuTrigger, { static: false })
    contextMenu: MatMenuTrigger;
    filesArr = [];
    folderArr = [];
    FSchange = false;
    falseImageIcon = [];

    currentAction = 'read';
    timer = 0;
    delay = 200;
    prevent = false;
    sortKey = 'name';

    filterArray = [{
        key: 'name',
        description: 'Name'
    }, {
        key: 'createdTime',
        description: 'Update'
    }]

    retainBack: boolean = false;

    contextMenuPosition = { x: '0px', y: '0px' };

    isDoubleClick = false;
    currentSelectedFolderIndex = 0;
    currentSelectedFileIndex = 0;
    isFocusedFile = false;
    isFocusedFolder = false;
    hasFolderMenuContent;
    total;
    current;
    selectedFileList: any = [];
    folderName: any;


    constructor(private backend: backend,
        public backendService: backendService,
        private renderer: Renderer,
        public pubSubService: NPubSubService,
        public dialog: MatDialog,
        private userService: dmsusers,
        public genericService: genericService,
        private snackBar: NSnackbarService,
        private router: Router,
        private nLocalStorage: NLocalStorageService,
        private snackbar: NSnackbarService) {

    }

    ngOnInit() {
        this._updateFs(this.currentFsDataObj, true);
    }

    viewVersionHistory(fsData): void {
        this.router.navigate(['home/version-history'], { queryParams: { fsuuid: fsData.fsuuid } })
        // let filterObj = {
        //     "fsuuid": fsData.fsuuid,
        //     "type": 'File',
        //     "trash": false,
        //     "approvalStatus": "approved",
        //     "hidden": { "$exists": false }
        // };
        // let sortObj = { 'timestamp': -1 };
        // this.userService.getVersionHistory(1, sortObj, filterObj).then(res => {
        //     let versionData = res.local.res;
        //     console.log(versionData);
        //     if (versionData && versionData.length > 0)

        //         // this.dialog.open(versionhistoryComponent, {
        //         //     width: '35%',
        //         //     data: { fsuuid: fsData.fsuuid, versionData: versionData },
        //         //     autoFocus: false,
        //         //     disableClose: true
        //         // })
        //     else
        //         this.snackBar.openSnackBar('No version history found');
        // });



    }

    viewNotes(fsData): void {
        this.dialog.open(viewnotesComponent, {
            width: '35%',
            panelClass: 'custom-dialog-container',
            data: fsData,
            autoFocus: false,
            disableClose: true
        })
    }


    redirectToEditUploadFile(fsData) {

        let id = fsData.fsuuid;
        let encodedFilter = btoa(encodeURIComponent(JSON.stringify(id)));
        let folderFilter = btoa(encodeURIComponent(JSON.stringify(this.currentFolder)));
        
        let businessDept = fsData.businessDepartment;
        this.nLocalStorage.setValue('id', encodedFilter);
        this.nLocalStorage.setValue('filter', folderFilter);

        this.retainBack = true;
        //If the current parent folder RW access , then only he has access to edit the file,
        if (this.getFolderPrivilege(this.currentFolder) == 'RW')
            this.router.navigate([`home/documents/editfile`], { queryParams: { action: 'edit',businessDept: businessDept } });
        else
            this.snackBar.openSnackBar('Not sufficient permissios to edit the file');
    }

    /**
     * Re-initializes the current FS tree.
     * @param fsObj : FS object containing current folder & file array of parent
     */
    _updateFs(fsObj, sortable?) {
        if (sortable) {
            this.filesArr = this._sortArray('name', fsObj.fileArr, 'String', true);
            this.folderArr = this._sortArray('name', fsObj.folderArr, 'String', true);
        }
        else {
            this.filesArr = fsObj.fileArr;
            this.folderArr = fsObj.folderArr;
        }
    }

    /**
     * DOM double click event on Folder
     * @param event : Event of double click on folder
     * @param item : Current FS object
     * @param index : Index of the current FS
     */
    onDoubleClick(event, item, index) {
        this.selectedFileList = [];        
        
        if (item.uuid) {
            this.isDoubleClick = true;
            let eventObj = item;
            this.folderActionEvent.emit(eventObj);
            this.singleclickFolderActionEvent.emit(null);
        }
        else {
            return false;
        }
    }

    /**
     * DOM single click event on Folder
     */
    onSingleClick(item, position) {
        this.isDoubleClick = false;
        setTimeout(() => {
            if (!this.isDoubleClick) {
                this.singleclickFolderActionEvent.emit(item);
                this.singleclickFolderActionPositionEvent.emit(position);
            }
        }, 400)


    }

    /**
     * Event triggered on mouse right click on FS
     * @param event : Mouse right click event
     * @param item : Current FS object
     */
    onContextMenu(event: MouseEvent, item) {
        // event.preventDefault();
        // this.contextMenuPosition.x = event.clientX + 'px';
        // this.contextMenuPosition.y = event.clientY + 'px';
        // this.contextMenu.menuData = { 'item': item };
        // this.contextMenu.menu.focusFirstItem('mouse');
        // this.contextMenu.openMenu();
    }

    /**
     * Popup to create folder
     * @param index :index of current folder
     */
    createFolderPop(index?) {
        let currentIndex = this.folderArr.length - 1; //last index
        if (index >= 0)
            currentIndex = index;
        this.dialog.open(createfolderComponent, {
            width: '20rem',
            maxWidth: '20rem',
            minHeight: '18rem',
            data: this.folderArr[currentIndex],
            autoFocus: false,
            restoreFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res['status']) {
                this.onBlurAction(res.currentFSName, res.currentFSobj, currentIndex)
            } else if (res.currentFSobj['action'] == 'create') {
                this.folderArr.pop();
                this.singleclickFolderActionEvent.emit(null);
                this.isFocusedFile = this.isFocusedFolder = false;
            } else if (res.currentFSobj['action'] == 'rename') {
                this.folderArr[index]['action'] = 'read';
            }
        })
    }

    /**
     * Folder creation or Folder renamne event
     * @param event : Event of blur action on input folder
     * @param element : Current FS object
     * @param index : Index of the current FS
     */
    onBlurAction(event, element, index) {
        let fsFolderArray = [];
        if (element['action'] == 'rename' && element['uuid']) {
            fsFolderArray = this.folderArr.filter(el => el.uuid != element['uuid']);
        }
        if (this.folderArr.length > 0) {
            let existingIndex = this.folderArr.findIndex(x => x.name.toLowerCase() == event.trim().toLowerCase());
            if (element['action'] != 'rename' && existingIndex != -1 && index != existingIndex) {
                this.snackBar.openSnackBar('Folder with same name already exists');
                this.createFolderPop(index);
                return false;
            }
            else if (element['action'] == 'rename' && element['uuid'] && fsFolderArray.find(x => x.name.toLowerCase() == event.trim().toLowerCase())) {
                this.snackBar.openSnackBar('Folder with same name already exists');
                this.createFolderPop(index);
                return false;
            }
            // Find the same folder exists in trash in current logicalPath
            else if ((event.length > 0)) {
                let filter = { trash: true, type: 'Folder', logicalPath: element['logicalPath'], name: event }
                this.backend.getFolderFS(filter).then(res => {
                    let obj = element;
                    obj['lastModified'] = new Date();
                    if (element['action'] == 'create') {
                        obj['name'] = event.trim();
                        obj['type'] = 'Folder';
                        obj['content'] = [];
                        obj['action'] = 'read';

                        obj['path'] = `${obj['logicalPath']}${(obj['logicalPath'] == '/' ? '' : '/')}${obj['name']}`;
                        this.singleclickFolderActionEvent.emit(null);
                        this.isFocusedFile = this.isFocusedFolder = false;
                        //let logicalPath = btoa(JSON.stringify(obj['logicalPath']));
                        this.backend.createFolder(obj).then(res => {
                            this.folderArr[index]['action'] = 'read';
                            this.pubSubService.$pub('operation', { action: 'create', logicalPath: btoa(encodeURIComponent(JSON.stringify(obj['logicalPath']))), path: obj['path'] });
                        })
                    }
                    if (element['action'] == 'rename') {
                        obj['newFolderName'] = event;
                        obj['action'] = 'read';
                        this.folderArr[index]['name'] = event;
                        let logicalPath = btoa(encodeURIComponent(JSON.stringify(obj['logicalPath'])));
                        this.backend.renameFS(element['uuid'], obj, this.folderArr[index]['fsuuid']).then((res) => {
                            this.folderArr[index]['action'] = 'read';
                            this.pubSubService.$pub('operation', { action: 'create', logicalPath: logicalPath, path: obj['path'] });
                        })
                    }
                });
            }
        }
    }

    /**
     * False click trigger on create of rename action on folder .
     * To activate insertion point on input field for above actions
     */
    triggerFalseClick() {
        // let el: HTMLElement = this.folderInput.nativeElement;
        // el.click();
    }

    /**
     * Deletes the current FS
     * @param item : Current FS object
     * @param index : Index of the current FS
     */
    deleteFilesPopup(item, index) {
        // this.dialog.open(deletegroupComponent, {
        //     width: '30%',
        //     data: {
        //         msg: item.type == 'Folder' ? 'Are you sure you want to delete this folder and the documents inside it?' : 'Are you sure you want to delete this document?',
        //         positiveButton: 'Yes',
        //         negativebuuton: 'No'
        //     },
        //     autoFocus: false,
        //     restoreFocus: false,
        //     disableClose: true
        // }).afterClosed().subscribe(res => {
        //     if (res['status']) {
        //         this.deleteFolder(item, index);
        //     }
        // })

        this.dialog.open(confirmdlgComponent, {
            width: '600px',
            panelClass: 'custom-dialog-container',
            data: {
                'title': 'Delete Confirmation',
                'messageContent': item.type == 'Folder' ? 'Are you sure you want to delete this folder and the documents inside it?' : 'Are you sure you want to delete this document?',
            },
            autoFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {
            if (res && res['confirmed']) {
                this.deleteFolder(item, index);
            }
        })
    }
    deleteFolder(item, index) {
        this.backend.moveToTrash(item['uuid'], item.fsuuid, item.type, item.name, item.objectPath, item.content).then(res => {
            if (item.type == 'Folder')
                this.folderArr.splice(index, 1);
            else
                this.filesArr.splice(index, 1);
        });
        this.singleclickFolderActionEvent.emit(null);
    }

    /**
     * Creates an downloadable link of the file.
     * @param filePath :FileName or FilePath url
     */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        this.backendService.downloadFile(filePath, fileName, fsuuid, clientContainerName);
    }

    /**
     * Event triggered on sort drop down change
     * @param sortKey  : Sort key value ['name' , 'createdTime']
     */
    filterSort(sortKey) {
        let dataType = (sortKey == 'name') ? 'String' : 'Number'
        this.filesArr = this._sortArray(sortKey, this.filesArr, dataType, sortKey == 'name');
        this.folderArr = this._sortArray(sortKey, this.folderArr, dataType, sortKey == 'name');
    }

    /**
     * Returns an sorted array based on key
     * @param key : Key name on which sort has to happen
     * @param {any}array : Array to be sorted
     * @param {String} dataType : String to make case insensitive sort.
     * @param {Boolean} ascending : sort order [optional]
     */
    _sortArray(key, array, dataType, ascending?) {
        let _convertCase;
        if (dataType == 'String') {
            _convertCase = (value) => value.toString().toLowerCase();
        }
        else {
            _convertCase = (value) => value;
        }
        return array.sort(function (a, b) {
            if (_convertCase(a[key]) < _convertCase(b[key])) {
                return ascending ? -1 : 1;
            }
            if (_convertCase(a[key]) > _convertCase(b[key])) {
                return ascending ? 1 : -1;
            }
            return 0;
        })
    }



    /**
     * Returns Read ; Write Access for the current folder [RW : Read & Write, R : Read , N : Null]
     * @param folder : Current Folder
     */
    getFolderPrivilege(folder) {
        if (folder.privilegegroup && folder.privilegegroup.find(x => x.write == true))
            return 'RW';
        else if (folder.privilegegroup && folder.privilegegroup.find(x => x.read == true))
            return 'R';
        else
            return 'N';
    }


    /**
     * Function will check whether it has all approval levels
     * @param fileObj : File Object
     */
    getFileAccess(fileObj) {
        let status = fileObj.approvalLevels.find(x => x.approvalStatus == 'awaiting' || x.approvalStatus == 'rejected');
        if (status)
            return false;
        else
            return true;
    }


    /**
     * Check Current folder permissions
     * @param currentFolder :Current folder Object
     */
    checkFolderPermission(currentFolder) {
        if (!currentFolder)
            return false;
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

    FolderPermision(currentFolder) {
        if (this.backendService.currentUserObj.su || currentFolder) {
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
    }

    /**
     * Deletes the current Folder
     * @param item : Current FS object
     */
    DownloadFolder(item) {
        this.backendService.folderDownloadCount = 0;
        this.backendService.downloadFolder(item.name, item.path);
        this.dialog.open(dilogueComponent, {
            width: '35%',
            panelClass: "dialog-container",
            data: { loader: true, Folder: true }
        });
    }

    showUserList(item) {
        this.dialog.open(ShowUserListDialogComponent, {
            maxWidth: "45rem",
            width: "45rem",
            panelClass: "showUserListDialog",
            data: { item: item }
        })
    }
    /**
     * Scrolls the window to Top
     */
    public scrollToTop() {
        let element = document.querySelector('#folderContent');
        if (!element)
            element = document.querySelector('#fileContent');
        if (element)
            element.scrollIntoView();
    }

    /**
    * Move File one to another Folder
    */
    moveFile(file, index) {

        this.dialog.open(MovePopupComponent, {
            panelClass: 'custom-movedialog-container',
            data: {
                'action': 'MOVE',
                'file': file,
                'currentFolder': this.currentFolder
            },
            autoFocus: false,
            disableClose: true
        }).afterClosed().subscribe(res => {


            if (res['status']) {
                this.removeFile(file, index);
            }
        })
    }

    removeFile(item, index) {
        this.filesArr.splice(index, 1);
    }




    /**
    * Copy the File in another folder
    */

    copyFile(file) {
        this.dialog.open(MovePopupComponent, {
            panelClass: 'custom-movedialog-container',
            data: {
                'action': 'COPY',
                'file': file
            },
            autoFocus: false,
            disableClose: true
        });
    }

    selectFiles(checkStatus, fileObj) {
        if (checkStatus) {
            this.selectedFileList.push(fileObj);
        }

        else {
            let popIndex = this.selectedFileList.findIndex(x => x.uuid == fileObj['uuid'])
            this.selectedFileList.splice(popIndex, 1)
        }
    }

    downloadMultipleFiles() {        
        
        if (this.selectedFileList.length > 1) {
            this.backendService.folderDownloadCount = 0;
            this.backendService.DownloadCurrCount = 0;

            let FileList = this.selectedFileList;
            this.folderName = "DMS";
            this.backendService.folderDownloadCount = FileList.length;
            FileList = this.genericService.getUniqueArray(FileList, 'fsuuid');
            FileList = FileList.map(el => {
                return this.backendService._getFile(el.fileName, el.name, el.fsuuid, el.clientContainerName);
            });

            Promise.all(FileList).then(async filesBlobs => {
                let zip: JSZip = new JSZip();
                await filesBlobs.forEach(fileElement => {
                    zip.folder(this.folderName).file(fileElement['name'], fileElement['blob']);
                });
                zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                }).then(res => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(res);
                    link.download = this.folderName;
                    link.click();
                    this.backendService.folderDownloadCount = -1;
                    this.backendService.DownloadCurrCount = 0;
                });
            });

            this.dialog.open(dilogueComponent, {
                width: '35%',
                panelClass: "dialog-container",
                data: {
                    loader: true,
                    Files: true,
                },
            });
            return ;


        } else {
            this.snackbar.openSnackBar('Please Select 2 or more Files for Downloading...🙂');
        }

    }

}
