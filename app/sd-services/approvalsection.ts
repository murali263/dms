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
export class approvalsection {
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

  //   service flows_approvalsection

  public async getApprovalListList(
    pageNumber = undefined,
    pageSize = undefined,
    sort = undefined,
    filter = undefined,
    key = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: sort,
          filter: filter,
          key: key
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_lFts38cWvjr1DsBb(bh);
      //appendnew_next_getApprovalListList
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async approvalAction(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_3MoO9RghniII3ox1(bh);
      //appendnew_next_approvalAction
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async resetApproval(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_Tx9h8HUVTAtjuyyf(bh);
      //appendnew_next_resetApproval
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getDocUploaders(...others) {
    try {
      let bh = { input: {}, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_3AUY42fk3qDtzdPg(bh);
      //appendnew_next_getDocUploaders
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_approvalsection_Start

  async sd_lFts38cWvjr1DsBb(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/approval/list?key=${bh.input.key}&pageNumber=${bh.input
        .pageNumber || '1'}&pageSize=${bh.input.pageSize ||
        25}&filter=${encodeURIComponent(
        JSON.stringify(bh.input.filter)
      )}&sort=${JSON.stringify(bh.input.sort || {})}`;

      bh = await this.sd_spkkyCRe7w7EiCGm(bh);
      //appendnew_next_sd_lFts38cWvjr1DsBb
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_spkkyCRe7w7EiCGm(bh) {
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
      //appendnew_next_sd_spkkyCRe7w7EiCGm
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_3MoO9RghniII3ox1(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateApproval`;

      bh = await this.sd_Ixe1REoqLN60RAZe(bh);
      //appendnew_next_sd_3MoO9RghniII3ox1
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Ixe1REoqLN60RAZe(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqBody
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_Ixe1REoqLN60RAZe
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Tx9h8HUVTAtjuyyf(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/resetApproval`;

      bh = await this.sd_aCDmlHWV62K3KEUS(bh);
      //appendnew_next_sd_Tx9h8HUVTAtjuyyf
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_aCDmlHWV62K3KEUS(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqBody
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_aCDmlHWV62K3KEUS
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_3AUY42fk3qDtzdPg(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/documentUsers`;

      bh = await this.sd_Nl6R5gKhfx32r4bV(bh);
      //appendnew_next_sd_3AUY42fk3qDtzdPg
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Nl6R5gKhfx32r4bV(bh) {
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
      //appendnew_next_sd_Nl6R5gKhfx32r4bV
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
