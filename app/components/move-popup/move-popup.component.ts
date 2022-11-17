import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { backend } from 'app/sd-services/backend';
import { genericService } from '../../services/generic/generic.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { fstreeService } from '../../services/fstree/fstree.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as ofObservable, Observable, BehaviorSubject, merge } from 'rxjs';
import { SelectionModel, CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { NSnackbarService } from 'neutrinos-seed-services';
import { backendService } from 'app/services/backend/backend.service';

@Component({
    selector: 'app-move-popup',
    templateUrl: './move-popup.component.html',
    styleUrls: ['./move-popup.component.scss']
})
export class MovePopupComponent implements OnInit {


    foldersArr = [];
    title: string;
    action: string;// for file action(Move or Copy) getting from doc child component
    groupId: any;
    selectedFolder: any;
    file: any; // for file object getting from doc child component

    currentUserInfo: any; //for storing user info from local storage
    currentFolder: any; //for storing folder info doc child component
    isMoved: boolean = false;
    isCopied: boolean = false; // for


    filterObj = { trash: false, type: "Folder", logicalPath: '/' };

    constructor(
        public dialogRef: MatDialogRef<MovePopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data,
        public backend: backend,
        public genericService: genericService,
        private fsTree: fstreeService,
        private snackbar: NSnackbarService,
        private backendService: backendService,) {

        this.action = data['action'];
        this.file = data['file'];
        this.currentFolder = data['currentFolder'];

        this.backend.getFolderFS(this.filterObj).then(res => {
            if (this.groupId) {
                this._initializeFolderData(res.local.res, this.groupId);
                this.dataSource.groupId = this.groupId;
            }
            else
                this._initializeFolderData(res.local.res);
        });
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, this.fsTree);
    }

    treeControl: FlatTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    getLevel = (node: DynamicFlatNode) => { return node.level; };

    isExpandable = (node: DynamicFlatNode) => { return node.expandable; };

    hasChild = (_: number, _nodeData: DynamicFlatNode) => { return _nodeData.expandable; };


    ngOnInit() {
       
        this.currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));

    }

    close() {
        this.dialogRef.close();
    }
    closeDialog(status){
        this.dialogRef.close({status:status});

    }

    _initializeFolderData(folderData, groupId?) {
        this.fsTree.fsArr = this.fsTree.fsDataArr = folderData;
        this.fsTree.assignRWData(folderData, groupId);
        this.dataSource.data = this.fsTree.initialData();
    }

    /**
         * Folder Select Event
         * @param checkStatus
         * @param folderObj
         */
    folderSelection(checkStatus, folderObj) {
        if (checkStatus) {
            this.selectedFolder = folderObj;
            // console.log("selected Folder", this.selectedFolder);
        }

    }


    //<---------------------------------------- Move File one Folder to another Folder--------------------------->

    MoveFile() {
        if (!this.selectedFolder) {
            this.snackbar.openSnackBar('Please Select Destination Folder for Moving Document...');
        } else {
            if (this.currentUserInfo.su == true) {
                
                let payload: any = {};
                payload.uuid = this.file.uuid;
                payload.fsuuid = this.file.fsuuid;
                payload.logicalPath = this.selectedFolder.item.path;
                payload.path = this.selectedFolder.item.path + '/' + this.file.name;
                payload.objectPath = [] = this.file.objectPath;
                payload.objectPath.push(this.selectedFolder.item.fsuuid);
                let index = payload.objectPath.indexOf(this.currentFolder.fsuuid);
                payload.objectPath.splice(index, 1);
                payload.content = [] = (this.selectedFolder.item.content);
                payload.content.push(this.file.fsuuid);
                
                this.backendService.moveFile(payload).subscribe(res => {
                    
                    if (res['success'] == true) {

                        this.isMoved = true                        
                        // setTimeout(() => {
                        //     this.closeDialog(true);                          
                           
                        //   }, 2000);
                    }
                    else {
                        this.isMoved = false;
                    }
                });

            } else {
                
                for (let i = 0; i < this.currentUserInfo.privilegegroup.length; i++) {
                    for (let j = 0; j < this.selectedFolder.item.privilegegroup.length; j++) {
                        if (this.currentUserInfo.privilegegroup[i] == this.selectedFolder.item.privilegegroup[j].groupId) {
                            if (this.selectedFolder.item.privilegegroup[j].write == true) {                                                      
                                let payload: any = {};
                                payload.uuid = this.file.uuid;
                                payload.fsuuid = this.file.fsuuid;
                                payload.logicalPath = this.selectedFolder.item.path;
                                payload.path = this.selectedFolder.item.path + '/' + this.file.name;
                                payload.objectPath = [] = this.file.objectPath;
                                payload.objectPath.push(this.selectedFolder.item.fsuuid);
                                let index = payload.objectPath.indexOf(this.currentFolder.fsuuid);
                                payload.objectPath.splice(index, 1);
                                payload.content = [] = (this.selectedFolder.item.content);
                                payload.content.push(this.file.fsuuid);
                                
                                this.backendService.moveFile(payload).subscribe(res => {
                                   
                                    if (res['success'] == true) {

                                        this.isMoved = true;
                                        // setTimeout(() => {
                                        //     this.closeDialog(true);                        
                                           
                                        //   }, 2000);
                                    }
                                    else {
                                        this.isMoved = false;

                                    }
                                });
                            }
                            else {
                                this.snackbar.openSnackBar('You Dont have Write Access to Destination Folder for Moving Document...');
                            }
                        } else {
                            this.snackbar.openSnackBar('You Dont have Access to Destination Folder for Moving Document...');

                        }

                    }

                }

            }




        }


    }
 //<---------------------------------------- Move File one Folder to another Folder--------------------------->

  //<---------------------------------------- Copy File one Folder to another Folder--------------------------->

    CopyFile() {
        if (!this.selectedFolder) {
            this.snackbar.openSnackBar('Please Select Destination Folder for Copy Document...');
        } else {
            if (this.currentUserInfo.su == true) {                
                let payload: any = {};
                payload = this.file;                
                payload.logicalPath = this.selectedFolder.item.path;
                payload.path = this.selectedFolder.item.path + '/' + this.file.name;
                payload.objectPath.push(this.selectedFolder.item.fsuuid);
                payload.content = [] = (this.selectedFolder.item.content);
                payload.content.push(this.file.fsuuid);
                
                this.backendService.copyFile(payload).subscribe(res => {
                    
                    if (res['success'] == true) {
                        this.isCopied = true;
                        // setTimeout(() => {
                        //     this.close();                        
                           
                        //   }, 2000);
                    }
                    else {
                        this.isCopied = false;
                    }
                });

            } else {                
                for (let i = 0; i < this.currentUserInfo.privilegegroup.length; i++) {
                    for (let j = 0; j < this.selectedFolder.item.privilegegroup.length; j++) {
                        if (this.currentUserInfo.privilegegroup[i] == this.selectedFolder.item.privilegegroup[j].groupId) {
                            if (this.selectedFolder.item.privilegegroup[j].write == true) {
                                let payload: any = {};
                                payload = this.file;                                
                                payload.logicalPath = this.selectedFolder.item.path;
                                payload.path = this.selectedFolder.item.path + '/' + this.file.name;
                                payload.objectPath.push(this.selectedFolder.item.fsuuid);
                                payload.content = [] = (this.selectedFolder.item.content);
                                payload.content.push(this.file.fsuuid);
                                
                                this.backendService.copyFile(payload).subscribe(res => {
                                   
                                    if (res['success'] == true) {
                                        this.isCopied = true;
                                        // setTimeout(() => {
                                        //     this.close();                        
                                           
                                        //   }, 2000);
                                    }
                                    else {
                                        this.isCopied = false;
                                    }
                                });
                            }
                            else {
                                this.snackbar.openSnackBar('You Dont have Write Access to Destination Folder for Copy Document...');
                            }
                        } else {
                            this.snackbar.openSnackBar('You Dont have Access to Destination Folder for Copy Document...');

                        }

                    }

                }
            }

        }

    }

    //<---------------------------------------- Copy File from one Folder to another Folder--------------------------->




}
/** Flat node with expandable and level information */
export class DynamicFlatNode {
    constructor(public item: Object, public level: number = 1, public expandable: boolean = false,
        public isLoading: boolean = false) { }
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

    dataChange: BehaviorSubject<DynamicFlatNode[]> = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }
    set data(value: DynamicFlatNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    groupId;
    constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
        private database: fstreeService) { }

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this.treeControl.expansionModel.onChange!.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach((node) => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.reverse().forEach((node) => this.toggleNode(node, false));
        }
    }

    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: DynamicFlatNode, expand: boolean) {

        let ev;
        if (event)
            ev = event;

        this.database.getChildren(node, this.groupId).then(res => {
            const children = res;

            const index = this.data.indexOf(node);
            if (!children || index < 0) { // If no children, or cannot find the node, no op
                return;
            }
            node.isLoading = true;
            setTimeout(() => {
                if (expand) {
                    const nodes = children.map(name =>
                        new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
                    this.data.splice(index + 1, 0, ...nodes);
                } else {
                    //this.data.splice(index + 1, children.length);
                    let afterCollapsed = this.data.slice(index + 1, this.data.length);

                    let count = 0;
                    for (count; count < afterCollapsed.length; count++) {
                        const tmpNode = afterCollapsed[count];
                        if (tmpNode.level <= node.level) {
                            break;
                        }
                    }
                    this.data.splice(index + 1, count);
                }

                // notify the change
                this.dataChange.next(this.data);

                // ev['pageX'] && ev['pageY'] will be 0 for programatically triggered event
                if (ev && ev['pageX'] == 0 && ev['pageY'] == 0)
                    //  this.triggerCheckBoxCheck(node, ev.target.classList[1]);
                    node.isLoading = false;
            }, 0);
        });
    }




}
