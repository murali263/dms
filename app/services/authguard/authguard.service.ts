/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { backendService } from '../backend/backend.service';
import { NLocalStorageService} from 'neutrinos-seed-services';

import { MsalService } from '@azure/msal-angular';
const COOKIE_HARDCODED_VALUE=`{"g":"d89a67a0-3585-3aaa-b817-a4aa1d212f21","c":1628079775974,"l":1628079775974}`
@Injectable()
export class authguardService implements CanActivate, CanActivateChild {

    constructor(private router: Router,       
        public backendservice: backendService,
        public nst:NLocalStorageService,
        private authService:MsalService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try{
      let params= {displayName:localStorage.getItem('displayName'),mail:localStorage.getItem("email")}
      if(!params.mail){
        this.router.navigate(['sign-in'])
        return false;
      }
      return this.backendservice.getUserInfoAndNavData(params).then(data=>{
        const requestObj = { scopes: ['user.read', "openid", "profile"], };
        return this.authService.acquireTokenSilent(requestObj).then(tokenSet=>{
            this.backendservice.currentUserObj = data['data']['userInfo']['userInfo'] || [];
            this.backendservice.userGroup = data['data']['userInfo']['userInfo']['privilegegroup'] || [];
            let accessArr = ["home"]
            this.backendservice.featureSet = data.data.navData;
            this.backendservice.currentUserObj={...this.backendservice.currentUserObj,additional:{additional:{tko:tokenSet.accessToken}}}
              let tokens={access_token:tokenSet.accessToken,refresh_token:tokenSet.accessToken,expires_at:Math.floor(tokenSet.expiresOn.valueOf()/1000)}
              localStorage.setItem("userInfo", JSON.stringify(this.backendservice.currentUserObj))
              localStorage.setItem("tokenset", JSON.stringify(tokens))
              localStorage.setItem("featureList",JSON.stringify(data.data.navData))
              localStorage.setItem("privilegeGroup",JSON.stringify(data['data']['userInfo']['userInfo']['privilegegroup'] || []))
              data.data.navData.forEach(el => { return accessArr = [...accessArr, ...el.routesAccess] });
              return this.rclRuleCheck(route.routeConfig.path, accessArr)
            })
        });
      }
      catch{
        this.router.navigate(['sign-in'])
        return false;
      }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return true;
    }

    rclRuleCheck(routeConfig, accessArr): boolean {
        // console.log('----'+routeConfig);
        // console.log('++++'+accessArr);
        if (accessArr.includes(routeConfig)) {
            return true;
        }
        else {

            return true;
            // if (routeConfig != 'documents') {
            //     this.snackBar.openSnackBar('Sorry you dont have access to this page');
            //     this.router.navigate(['/home/documents']);
            // }
            // return false;
        }
    }

}
