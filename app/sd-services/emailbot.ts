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
export class emailbot {
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

  //   service flows_emailbot

  public async getCaseList(
    pageNumber = 1,
    filterObj = undefined,
    sort = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { pageNumber: pageNumber, filterObj: filterObj, sort: sort },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_4EAt9T6jpHlsn9gy(bh);
      //appendnew_next_getCaseList
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async updateCaseDetails(reqBody = undefined, ...others) {
    try {
      let bh = {
        input: { reqBody: reqBody },
        local: { res: undefined, url: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_t6CMzcnJ3UW8vHGa(bh);
      //appendnew_next_updateCaseDetails
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async caseStatus(reqBody = undefined, ...others) {
    try {
      let bh = {
        input: { reqBody: reqBody },
        local: { res: undefined, url: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_eN5ho58K5agim82A(bh);
      //appendnew_next_caseStatus
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_emailbot_Start

  async sd_4EAt9T6jpHlsn9gy(bh) {
    try {
      bh.input.body = {};
      let filter = JSON.stringify(bh.input.filterObj);
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getCases?pagesize=10&pageNumber=${
        bh.input.pageNumber
      }&filter=${filter}&sort=${JSON.stringify(bh.input.sort || {})}`;

      bh = await this.sd_rjnyAdDXzqeReOuJ(bh);
      //appendnew_next_sd_4EAt9T6jpHlsn9gy
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_rjnyAdDXzqeReOuJ(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: undefined,
        body: bh.input.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_rjnyAdDXzqeReOuJ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_t6CMzcnJ3UW8vHGa(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/CaseDetails`;

      bh = await this.sd_4n6RodToHoHV1IRc(bh);
      //appendnew_next_sd_t6CMzcnJ3UW8vHGa
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_4n6RodToHoHV1IRc(bh) {
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
      //appendnew_next_sd_4n6RodToHoHV1IRc
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_eN5ho58K5agim82A(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/caseStatus`;

      bh = await this.sd_o56LD4FTqohv85fX(bh);
      //appendnew_next_sd_eN5ho58K5agim82A
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_o56LD4FTqohv85fX(bh) {
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
      //appendnew_next_sd_o56LD4FTqohv85fX
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
