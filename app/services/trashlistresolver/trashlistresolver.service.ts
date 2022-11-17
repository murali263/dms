/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { backend } from '../../sd-services/backend';

@Injectable()
export class trashlistresolverService {
    constructor(private backend: backend) {
    }
    resolve() {
        let filter = { "hidden": { "$exists": false }, trash: true };
        return this.backend.getTrashList(1, 10, { deletedAt: -1 }, filter).then(res => {
            let result = res.local.res;
            return result;
        });
    }

}
