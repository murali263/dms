/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { dmsconfiguration } from '../../sd-services/dmsconfiguration'
import { AuthService } from '../authService/auth.service';

@Injectable()
export class resolverService implements Resolve<any> {
    constructor(private dmsconfiguration: dmsconfiguration, private authService: AuthService) {

    }
    resolve() {
        if (window.location.hash.indexOf('document') ||
            window.location.hash.indexOf('configuration')) {
              return this.getConfig();
        }
        else return true;
    }
    async getConfig() {
        let collectionNames = ["document_type_configuration",
            "business_division_configuration",
            "S_M_B_configuration",
            "region_configuration",
            "language_configuration"];
        let collectionNamesPromise = collectionNames.map(el => {
            return new Promise((resolve, reject) => {
                //let filterObj = { "activeFlag": "true" };
                // let activeFlag = true;
                this.dmsconfiguration.getConfigurationData(el).then(response => {
                    resolve({
                        [el]: response.local.res
                    });
                });
            });
        });
        return await Promise.all(collectionNamesPromise);
    }
}

