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
export class dmsstatus {
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

  //   service flows_dmsstatus

  public async getMyFiles(
    size = undefined,
    status = undefined,
    pageNumber = undefined,
    filter = undefined,
    sort = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          size: size,
          status: status,
          pageNumber: pageNumber,
          filter: filter,
          sort: sort
        },
        local: { files: undefined, modelrApiUrl: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_Bd6j2yDpveM3SqcE(bh);
      //appendnew_next_getMyFiles
      //Start formatting output variables
      let outputVariables = { input: {}, local: { files: bh.local.files } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getFileByUuid(filterObj = null, ...others) {
    try {
      let bh = { input: { filterObj: filterObj }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_bg4fuJUuGysZlIGq(bh);
      //appendnew_next_getFileByUuid
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_dmsstatus_Start

  async sd_Bd6j2yDpveM3SqcE(bh) {
    try {
      bh.input.body = {};
      bh.local.modelrApiUrl = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getMyFiles?size=${bh.input.size}&status=${
        bh.input.status
      }&pageNumber=${bh.input.pageNumber}&filter=${encodeURIComponent(
        JSON.stringify(bh.input.filter)
      )}&sort=${JSON.stringify(bh.input.sort)}`;

      bh = await this.sd_ON9BqmWU3dsWOFsu(bh);
      //appendnew_next_sd_Bd6j2yDpveM3SqcE
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ON9BqmWU3dsWOFsu(bh) {
    try {
      let requestOptions = {
        url: bh.local.modelrApiUrl,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.body
      };
      bh.local.files = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_ON9BqmWU3dsWOFsu
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_bg4fuJUuGysZlIGq(bh) {
    try {
      let filterObj = bh.input.filterObj || null;
      filterObj = JSON.stringify(filterObj);
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/getDocumentByUuid?filterObj=${filterObj}`;

      bh = await this.sd_Cqb6QxGPbnyCW6U1(bh);
      //appendnew_next_sd_bg4fuJUuGysZlIGq
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Cqb6QxGPbnyCW6U1(bh) {
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
      //appendnew_next_sd_Cqb6QxGPbnyCW6U1
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
