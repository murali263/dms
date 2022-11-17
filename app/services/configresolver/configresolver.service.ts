/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { backend } from '../../sd-services/backend';

@Injectable()
export class configresolverService {
    sidenavList = [];
    constructor(private backend:backend) {

    }
    resolve() {
        return this.backend.getAuth();
    }
}


