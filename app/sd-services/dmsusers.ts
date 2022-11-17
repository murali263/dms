/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SDBaseService } from '../n-services/SDBaseService';
import { environment } from '../../environments/environment';
import {
  NAlertComponent,
  NAlertService,
  NFileIOService,
  NFileUploadComponent
} from 'neutrinos-module';
import {
  NDataModelService,
  NAuthGuardService,
  NHTTPLoaderService,
  NLocalStorageService,
  NLoginService,
  NLogoutService,
  NNotificationService,
  NPubSubService,
  NSessionStorageService,
  NSnackbarService,
  NSystemService,
  NTokenService
} from 'neutrinos-seed-services';
//CORE_REFERENCE_IMPORTS

declare const window: any;
declare const cordova: any;

@Injectable()
export class dmsusers {
  systemService = NSystemService.getInstance();
  appProperties;

  constructor(
    private http: HttpClient,
    private matSnackBar: MatSnackBar,
    private sdService: SDBaseService,
    private sessionStorage: NSessionStorageService,
    private tokenService: NTokenService,
    private router: Router,
    private httpLoaderService: NHTTPLoaderService,
    private dataModelService: NDataModelService,
    private loginService: NLoginService,
    private authGuardService: NAuthGuardService,
    private localStorageService: NLocalStorageService,
    private logoutService: NLogoutService,
    private notificationService: NNotificationService,
    private pubsubService: NPubSubService,
    private snackbarService: NSnackbarService,
    private alertService: NAlertService,
    private fileIOService: NFileIOService
  ) {}

  //   service flows_dmsusers

  public async getUser(
    size = undefined,
    filter = undefined,
    skipToken = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { size: size, filter: filter, skipToken: skipToken },
        local: { users: undefined, modelrApiUrl: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_bYjFxaj679sQXORz(bh);
      //appendnew_next_getUser
      //Start formatting output variables
      let outputVariables = { input: {}, local: { users: bh.local.users } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }

  public async searchuserbyfilter(param) {
    try {
      let bh = {
        input: {body:param},
        local: { userGroups: undefined, modelrApiUrl: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.searchuserbyfilterapi(bh);
      //appendnew_next_getUserGroups
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { userGroups: bh.local.userGroups }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }


  async searchuserbyfilterapi(bh) {
    try {
      // let next = bh.input.skipToken ? `&$skiptoken=${bh.input.skipToken}` : '';
      // let search = bh.input.filter ? `&$filter=${bh.input.filter}` : '';
      // let orderBy = bh.input.filter ? '' : `&$orderBy=displayName asc`;
      // bh.input.body = {};

      bh.local.modelrApiUrl = `${bh.system.environment.properties.baseUrlAF}apiGetFilebyFilter`;

      bh = await this.sd_2FEopm5aHLb4pGwA(bh);
      //appendnew_next_sd_fUoy5KmAkLCjorHa
      return bh;
    } catch (e) {
      throw e;
    }
  }



  
  public async getUserGroups(
    size = undefined,
    filter = undefined,
    skipToken = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { size: size, filter: filter, skipToken: skipToken },
        local: { userGroups: undefined, modelrApiUrl: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_fUoy5KmAkLCjorHa(bh);
      //appendnew_next_getUserGroups
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { userGroups: bh.local.userGroups }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getVersionHistory(
    pageSize = undefined,
    sortObj = undefined,
    filter = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { pageSize: pageSize, sortObj: sortObj, filter: filter },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_0y299x5Cn6H0X96D(bh);
      //appendnew_next_getVersionHistory
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getGroupUserList(filter = undefined, ...others) {
    try {
      let bh = {
        input: { filter: filter },
        local: { usergrps: undefined, modelrApiUrl: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_IZV77g4v3K8YU1a8(bh);
      //appendnew_next_getGroupUserList
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { usergrps: bh.local.usergrps }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_dmsusers_Start

  async sd_bYjFxaj679sQXORz(bh) {
    try {
      bh.input.body = {};
      let next = bh.input.skipToken ? `&$skiptoken=${bh.input.skipToken}` : '';
      let search = bh.input.filter ? `&$filter=${bh.input.filter}` : '';
      let orderBy = bh.input.filter ? '' : `&$orderBy=displayname asc`;
      bh.local.modelrApiUrl = `${bh.system.environment.properties.modelrUrl}modelr/api/getUser?size=${bh.input.size}${search}${next}${orderBy}`;

      bh = await this.sd_IWHxoNAOyXneCJGR(bh);
      //appendnew_next_sd_bYjFxaj679sQXORz
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_IWHxoNAOyXneCJGR(bh) {
    try {
      let requestOptions = {
        url: bh.local.modelrApiUrl,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: { disableLoader: 'Y' },
        params: {},
        body: bh.input.body
      };
      bh.local.users = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_IWHxoNAOyXneCJGR
      return bh;
    } catch (e) {
      throw e;
    }
  }




  async sd_fUoy5KmAkLCjorHa(bh) {
    try {
      let next = bh.input.skipToken ? `&$skiptoken=${bh.input.skipToken}` : '';
      let search = bh.input.filter ? `&$filter=${bh.input.filter}` : '';
      let orderBy = bh.input.filter ? '' : `&$orderBy=displayName asc`;
      bh.input.body = {};

      bh.local.modelrApiUrl = `${bh.system.environment.properties.modelrUrl}modelr/api/getUserGroups?size=${bh.input.size}${search}${next}${orderBy}`;

      bh = await this.sd_2FEopm5aHLb4pGwA(bh);
      //appendnew_next_sd_fUoy5KmAkLCjorHa
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_2FEopm5aHLb4pGwA(bh) {
    try {
      let requestOptions = {
        url: bh.local.modelrApiUrl,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: { disableLoader: 'Y' },
        params: {},
        body: bh.input.body
      };
      bh.local.userGroups = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_2FEopm5aHLb4pGwA
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_0y299x5Cn6H0X96D(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getVersionHistory?pageSize=${bh.input.pageSize ||
        25}&filter=${JSON.stringify(bh.input.filter)}&sort=${JSON.stringify(
        bh.input.sortObj || {}
      )}`;

      bh = await this.sd_CjmYzUu8XxmOkAkD(bh);
      //appendnew_next_sd_0y299x5Cn6H0X96D
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_CjmYzUu8XxmOkAkD(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_CjmYzUu8XxmOkAkD
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_IZV77g4v3K8YU1a8(bh) {
    try {
      let search = bh.input.filter ? `&$filter=${bh.input.filter}` : '';
      bh.input.body = {};

      bh.local.modelrApiUrl = `${bh.system.environment.properties.modelrUrl}modelr/api/getUserList?${search}`;

      bh = await this.sd_yaDC5EWHXov705TZ(bh);
      //appendnew_next_sd_IZV77g4v3K8YU1a8
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_yaDC5EWHXov705TZ(bh) {
    try {
      let requestOptions = {
        url: bh.local.modelrApiUrl,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: { disableLoader: 'y' },
        params: {},
        body: bh.input.body
      };
      bh.local.usergrps = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_yaDC5EWHXov705TZ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_node

  __constructDefault(bh) {
    const system: any = {};

    try {
      system.currentUser = this.sessionStorage.getValue('userObj');
      system.environment = environment;
      system.tokenService = this.tokenService;
      system.deviceService = this.systemService;
      system.router = this.router;
      system.httpLoaderService = this.httpLoaderService;
      system.dataModelService = this.dataModelService;
      system.loginService = this.loginService;
      system.authGuardService = this.authGuardService;
      system.localStorageService = this.localStorageService;
      system.logoutService = this.logoutService;
      system.notificationService = this.notificationService;
      system.pubsubService = this.pubsubService;
      system.snackbarService = this.snackbarService;
      system.alertService = this.alertService;
      system.fileIOService = this.fileIOService;

      Object.defineProperty(bh, 'system', {
        value: system,
        writable: false
      });

      return bh;
    } catch (e) {
      throw e;
    }
  }
}
