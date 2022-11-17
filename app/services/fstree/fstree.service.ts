/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { backend } from '../../sd-services/backend';


@Injectable()
export class fstreeService {

    fsArr = [];

    fsDataArr = []
    constructor(private backend: backend) {

    }

    /** Initial data from database */
    initialData(): any {
        return this.fsArr.map(name => new DynamicFlatNode(name, 0, true));
    }


    /**Get Current Nodr Children */
    getChildren(node: DynamicFlatNode, groupId?): any | undefined {
        return new Promise((resolve, reject) => {
            return this.backend.getFolderFS({ trash: false, logicalPath: node['item']['path'], objectPath: { "$in": [node.item['fsuuid']] }, type: 'Folder' }).then(res => {
                res.local.res.forEach(ele => {
                    let hasInFS = this.fsDataArr.find(el => el.fsuuid == ele.fsuuid);
                    if (!hasInFS)
                        this.fsDataArr.push(ele);
                    else {
                        ele.checkedR = hasInFS['checkedR'];
                        ele.checkedRW = hasInFS['checkedRW'];
                    }

                    if (groupId && !hasInFS) {
                        ele.privilegegroup.forEach(x => {
                            if (x.groupId == groupId) {
                                if (!ele.checkedR)
                                    ele.checkedR = x.read;
                                if (!ele.checkedRW) {
                                    ele.checkedRW = x.write;
                                    if (ele.checkedRW)
                                        ele.checkedR = false;
                                }
                            }
                        });
                    }
                });
                return resolve(res.local.res);
            });
        });
    }

    /** Checks boolean whether the node is expandabale */
    isExpandable(node: string): boolean {
        return node['content'] && node['content'].length > 0;
    }

    assignRWData(privilegeGroupArr, groupId) {
        privilegeGroupArr.forEach(el => {
            el.privilegegroup.forEach(x => {
                if (x.groupId == groupId) {
                    if (x.write) {
                        el.checkedRW = true;
                        el.checkedR = false;
                    }
                    else if (x.read) {
                        el.checkedR = true;
                        el.checkedRW = false;
                    }
                    else {
                        el.checkedRW = false;
                        el.checkedR = false;
                    }
                }
            });
        });
    }

    assignRWStatus(fsuuid, action, value) {
        let status = this.fsDataArr.find(x => x.fsuuid == fsuuid);
        if (status)
            status[action] = value;
    }
}





export class DynamicFlatNode {
    constructor(public item: Object, public level: number = 1, public expandable: boolean = false,
        public isLoading: boolean = false) { }
}