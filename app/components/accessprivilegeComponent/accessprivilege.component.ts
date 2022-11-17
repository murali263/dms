import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core'
import { SelectionModel, CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { of as ofObservable, Observable, BehaviorSubject, merge } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { backend } from '../../sd-services/backend';
import { fstreeService } from '../../services/fstree/fstree.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NSnackbarService } from 'neutrinos-seed-services';
import { genericService } from '../../services/generic/generic.service';



export class TodoItemNode {
    children: TodoItemNode[];
    item: Object;
}

export class TodoItemFlatNode {
    item: Object;
    level: number;
    expandable: boolean;
}



@Component({
    selector: 'bh-accessprivilege',
    templateUrl: './accessprivilege.template.html',
    styleUrls: ['./accessprivilege.component.scss']
})



export class accessprivilegeComponent implements OnInit {

    @Input() currentGrpId: any;

    //Read access array with true values
    readAccessT = [];
    //Write access array with  true values
    writeAccessT = [];
    //Read access array with false values
    readAccessF = [];
    //Write access array with  false values
    writeAccessF = [];

    groupId;

    filterObj = { trash: false, type: "Folder", logicalPath: '/' };
    constructor(private backend: backend,
        private fsTree: fstreeService,
        private route: ActivatedRoute,
        private snackBar: NSnackbarService,
        public genericService: genericService) {



        let grpObj = this.route.snapshot.queryParamMap.get('groupObj');
        if (grpObj)
            this.groupId = JSON.parse(atob(grpObj)).groupId


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

    }

    /**
     *
     * @param folderData : FolderArr
     * @param groupId : Privilege groupID
     */
    _initializeFolderData(folderData, groupId?) {
        this.fsTree.fsArr = this.fsTree.fsDataArr = folderData;
        this.fsTree.assignRWData(folderData, groupId);
        this.dataSource.data = this.fsTree.initialData();
    }

    /**
     *
     * @param fsuuid : Current FSUUID
     * @param arr : Array to search in
     */
    _getUUIDIndex(fsuuid, arr) {
        return arr.findIndex(x => x.fsuuid == fsuuid);
    }

    /**
     *
     * @param pushArrName : Array into which uuid has to be pushed
     * @param popArrName :  Array from which uuid has to be poped
     * @param fsuuid : current Node FSUUID
     * @param groupId : Currrent GroupID
     * @param expPopArr : Exception Array
     */
    _uuidCheck(pushArrName, popArrName, fsuuid, groupId?, expPopArr?) {

        let fsObj = this.fsTree.fsDataArr.find(x => x.fsuuid == fsuuid);
        let groupCheck = fsObj && fsObj.privilegegroup.find(x => x.groupId == groupId);
        this[pushArrName].push({ groupId: (groupCheck ? groupId : null), fsuuid: fsuuid });
        let uuidIndex = this._getUUIDIndex(fsuuid, this[popArrName]);
        if (uuidIndex != -1)
            this[popArrName].splice(uuidIndex, 1);

        if (!groupId) {
            // Remove Duplicates
            this[pushArrName] = this.getUnique(this[pushArrName], 'fsuuid');
            this[popArrName] = this.getUnique(this[popArrName], 'fsuuid');

            // If  pushed in R , should be removed from write & vice versa
            if (expPopArr && this[expPopArr].length > 0) {
                let expIndex = this._getUUIDIndex(fsuuid, this[expPopArr]);
                if (expIndex != -1)
                    this[expPopArr].splice(expIndex, 1);
            }

        }
        this.getFileArr(pushArrName, popArrName, fsuuid, groupId, expPopArr);

    }


    /**
     *
     * @param arr : Array
     * @param comp :Key based on which duplicates has to be removed
     */
    getUnique(arr, comp) {
        let unique = arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    /**
     * Check event actions
     * @param event : Checkbox click event .
     * @param node : Current fs tree node
     * @param key : Key [R/RW]
     */
    readAccessCheck(event, node, key) {

        let nodeGroup = node['item'].privilegegroup.find(x => x.groupId == this.currentGrpId);
        // Read Checkbox Action
        if (key == 'R') {


            // Read is checked
            if (node['item']['checkedR']) {

                this.triggerFolderClick(event, key, node);

                this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedR', true);
                this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedRW', false);


                if (nodeGroup && nodeGroup.groupId) {
                    this._uuidCheck('writeAccessF', 'writeAccessT', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId);

                }

                // If Read Checked , assign write access false
                node['item']['checkedRW'] = false;
                // Push in fsuuid array
                this._uuidCheck('readAccessT', 'readAccessF', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId, 'writeAccessT');


                // Assign all of the parents with minimum of READ Access
                this.assignParentRules(node);
            }
            // Read is unchecked
            else {
                //Check whether any of children has read/write access
                this.checkChidrenRules(node, this.currentGrpId).then(res => {
                    if (!res) {
                        this.snackBar.openSnackBar('Has a child with read access , cannot unassign');
                        setTimeout(() => {
                            node['item']['checkedR'] = true;
                            this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedR', true);
                        }, 0);
                    } else {
                        // Push in fsuuid array
                        this._uuidCheck('readAccessF', 'readAccessT', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId);

                        this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedR', false);
                    }

                });
            }
        }
        // Write Checkbox Action
        else {
            // Write is checked
            if (node['item']['checkedRW']) {

                this.triggerFolderClick(event, key, node);

                // If Write Checked , assign read access false
                node['item']['checkedR'] = false;

                if (nodeGroup && nodeGroup.groupId) {
                    this._uuidCheck('readAccessF', 'readAccessT', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId);
                }

                this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedRW', true);
                this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedR', false);

                // Push in uuid array
                this._uuidCheck('writeAccessT', 'writeAccessF', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId, 'readAccessT');


                // Assign all of the parents with minimum of READ Access
                this.assignParentRules(node);
            }
            // Write is unchecked
            else {
                //Check whether any of children has read/write access
                this.checkChidrenRules(node, this.currentGrpId).then(res => {
                    if (!res) {
                        this.snackBar.openSnackBar('Has a child with read access , cannot unassign');
                        setTimeout(() => {
                            node['item']['checkedRW'] = true;
                            this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedRW', true);
                        }, 0);
                    } else {
                        // Push in uuid array
                        this._uuidCheck('writeAccessF', 'writeAccessT', node['item']['fsuuid'], nodeGroup && nodeGroup.groupId);
                        this.fsTree.assignRWStatus(node['item']['fsuuid'], 'checkedRW', false);
                    }

                });
            }
        }

    }


    /**
     * Triggers an programatic toggleFolder expand event .
     * @param event : Checkbox click event
     * @param key : R/RW [ Read / Read-Write]
     * @param node : Current Folder Node
     */
    triggerFolderClick(event, key, node?) {
        let buttonToClick = event.source._elementRef.nativeElement.parentElement.parentNode.querySelectorAll('.mat-icon-button');
        let expandedFlag = buttonToClick[0].querySelectorAll('.node-expanded');

        if (expandedFlag.length <= 0) {
            buttonToClick[0].classList.add(key);
            buttonToClick[0].click();
        } else {
            this.dataSource.triggerCheckBoxCheck(node, key);
        }
    }

    /**
    *  If  child is check , all of its parent should have min of Read Access
    * @param node : Current Node
    */
    assignParentRules(node) {
        let nodeGroup = node['item'].privilegegroup.find(x => x.groupId == this.currentGrpId);
        node['item']['objectPath'].forEach(ele => {
            if (ele) {
                let fsObj = this.dataSource.data.find(x => x['item']['fsuuid'] == ele) && this.dataSource.data.find(x => x['item']['fsuuid'] == ele).item;
                if (fsObj && !fsObj['checkedR'] && !fsObj['checkedRW']) {
                    fsObj['checkedR'] = true;
                    this._uuidCheck('readAccessT', 'readAccessF', fsObj['fsuuid'], nodeGroup && nodeGroup.groupId);
                }
            }
        });
    }

    getFileArr(pushArrName, popArrName, fsuuid, groupId?, expPopArr?) {
        let filterObj = { objectPath: { "$in": [fsuuid] }, type: 'File' };
        this.backend.getFolderFS(filterObj).then(res => {
            let resultArr = res.local.res;
            if (resultArr && resultArr.length > 0)
                resultArr.forEach(el => {
                    if (el.objectPath[el.objectPath.length - 1] == fsuuid) {
                        this[pushArrName].push({ groupId: groupId, fsuuid: el.fsuuid });
                        let uuidIndex = this._getUUIDIndex(el.fsuuid, this[popArrName]);
                        if (uuidIndex != -1)
                            this[popArrName].splice(uuidIndex, 1);

                        if (!groupId) {
                            // Remove Duplicates
                            this[pushArrName] = this.getUnique(this[pushArrName], 'fsuuid');
                            this[popArrName] = this.getUnique(this[popArrName], 'fsuuid');

                            // If  pushed in R , should be removed from write & vice versa
                            if (expPopArr && this[expPopArr].length > 0) {
                                let expIndex = this._getUUIDIndex(el.fsuuid, this[expPopArr]);
                                if (expIndex != -1)
                                    this[expPopArr].splice(expIndex, 1);
                            }

                        }
                    }
                });
        });



    }

    /**
     * Check whether any of the children has Read or Write Permission
     */
    checkChidrenRules(node, groupId?) {
        let status = false;
        let childArr = this.fsTree.fsDataArr.filter(el => node.item.content.includes(el['fsuuid']) && el['fsuuid'].slice(0, 2) == 'DR');

        let isInNodeExpanded: boolean = false;

        for (let k = 0; k < node.item.content.length; k++) {
            if (this.fsTree.fsDataArr.find(x => x.fsuuid == node.item.content[k]))
                isInNodeExpanded = true;
        }

        if (groupId && !isInNodeExpanded)
            return new Promise((resolve, reject) => {
                let filterObj = { fsuuid: { "$in": node.item.content }, trash: false, type: 'Folder' };
                return this.backend.getFolderFS(filterObj).then(res => {
                    let resultArr = res.local.res;

                    let privilegegroupArr = res.local.res.map(el => {
                        return [...el.privilegegroup];
                    });

                    privilegegroupArr = [].concat.apply([], privilegegroupArr);

                    for (let i = 0; i < privilegegroupArr.length; i++) {
                        if (groupId == privilegegroupArr[i].groupId)
                            if (privilegegroupArr[i].read || privilegegroupArr[i].write)
                                return resolve(status = false);
                    }
                    return resolve(status = true);
                });
            });
        else
            return new Promise((resolve, reject) => {
                for (let i = 0; i < childArr.length; i++) {
                    if (childArr[i]['checkedR'] || childArr[i]['checkedRW'])
                        return resolve(status = false);
                }
                return resolve(status = true);
            });


    }

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
                    this.triggerCheckBoxCheck(node, ev.target.classList[1]);
                node.isLoading = false;
            }, 0);
        });
    }

    /**
     * Triggers an programatic checkbox click event.
     * @param node : Current FS node {DynamicFlatNode : Class}
     * @param eventClass : Mouse Event Triggered
     */
    triggerCheckBoxCheck(node, eventClass) {
        setTimeout(() => {
            let contentChildren = node.item['content'];
            contentChildren.forEach(el => {
                el = `${eventClass}-${el}`;
                if (document.getElementById(el)) {
                    if (!document.getElementById(el).querySelectorAll(`.mat-checkbox-input`)['0'].checked)
                        document.getElementById(el).querySelectorAll(`.mat-checkbox-input`)['0'].click();
                }

            })
        }, 100);
    }

}
