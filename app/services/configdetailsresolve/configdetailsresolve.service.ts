import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { dmsconfiguration } from '../../sd-services/dmsconfiguration';

@Injectable()
export class configdetailsresolveService implements Resolve<any> {

    constructor(private dmsConfig: dmsconfiguration, private route: ActivatedRoute, ) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const configId = route.params['configId'];
        const config: any = await new Promise((resolve, reject) => {
            this.dmsConfig.getConfigData(configId).then((configResult: any) => {
                if (configResult && configResult.local && configResult.local.configData) {
                    resolve(configResult.local.configData[0]);
                }
            });
        });
        let values: any[];
        let parentValues: any[];
        const filter: any = { 'active': true };
        if (config.isChildren) {
            parentValues = await new Promise((resolve, reject) => {
                filter['configId'] = config.parent;
                this.dmsConfig.getConfigValues(filter).then((valuesResult: any) => {
                    resolve(valuesResult.local.configValues);
                });
            });
        } else {
            values = await new Promise((resolve, reject) => {
                filter['configId'] = configId;
                this.dmsConfig.searchConfigValues(filter, 1, 20).then((valuesResult: any) => {
                    resolve(valuesResult.local.res);
                });
            });
        }
        return {
            config: config,
            values: values,
            parentValues: parentValues
        }
    }
}
