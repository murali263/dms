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
export class dmsconfiguration {
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

  //   service flows_dmsconfiguration

  public async createDocTypeConfig(
    collectionName = undefined,
    reqObj = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { collectionName: collectionName, reqObj: reqObj },
        local: {}
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_SbrSfwPPMKW05hkV(bh);
      //appendnew_next_createDocTypeConfig
      //Start formatting output variables
      let outputVariables = { input: {}, local: {} };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigurationData(
    collectionName = undefined,
    activeFlag = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { collectionName: collectionName, activeFlag: activeFlag },
        local: { res: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_k6mYQXKDzyvMwz9u(bh);
      //appendnew_next_getConfigurationData
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async deleteConfiguration(
    collectionName = undefined,
    configId = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { collectionName: collectionName, configId: configId },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_l4qI3TrGQf0FTYvL(bh);
      //appendnew_next_deleteConfiguration
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async editConfiguration(
    reqBody = undefined,
    collectionName = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { reqBody: reqBody, collectionName: collectionName },
        local: { res: undefined, url: undefined }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_F96HDayTUwbM50X6(bh);
      //appendnew_next_editConfiguration
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigValues(filter = null, ...others) {
    try {
      let bh = { input: { filter: filter }, local: { configValues: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_XwR9lKDD3ATZLwdr(bh);
      //appendnew_next_getConfigValues
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { configValues: bh.local.configValues }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigData(configId = null, ...others) {
    try {
      let bh = { input: { configId: configId }, local: { configData: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_ffHHUHH26DGC29Bk(bh);
      //appendnew_next_getConfigData
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { configData: bh.local.configData }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async createConfigValue(configValues = null, ...others) {
    try {
      let bh = { input: { configValues: configValues }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_Iu4bd9CauOzfnxJF(bh);
      //appendnew_next_createConfigValue
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async updateConfigValue(update = null, ...others) {
    try {
      let bh = { input: { update: update }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_gORilOef7U8V08l9(bh);
      //appendnew_next_updateConfigValue
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async searchConfigValues(
    filter = null,
    pageNumber = undefined,
    size = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { filter: filter, pageNumber: pageNumber, size: size },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_yjwwo1aX3WqQgcAk(bh);
      //appendnew_next_searchConfigValues
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getFileConfigData(configData = null, ...others) {
    try {
      let bh = { input: { configData: configData }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_tXr63YHKJ0jieoVY(bh);
      //appendnew_next_getFileConfigData
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async searchConfigs(
    searchText = undefined,
    pageNumber = undefined,
    size = undefined,
    businessDepartment =undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { searchText: searchText, pageNumber: pageNumber, size: size, businessDepartment:businessDepartment },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_dYuiu4SnwJtXxfct(bh);
      //appendnew_next_searchConfigs
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async createNewConfig(config = null, ...others) {
    try {
      let bh = { input: { config: config }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_1uujWyaWbiEcSRQ3(bh);
      //appendnew_next_createNewConfig
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async configUsedCount(configId = undefined, ...others) {
    try {
      let bh = { input: { configId: configId }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_nIEUe8QsQfE9FnIj(bh);
      //appendnew_next_configUsedCount
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async editConfigData(config = null, ...others) {
    try {
      let bh = { input: { config: config }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_7DyPBV8wek53RN4V(bh);
      //appendnew_next_editConfigData
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigsByFilter(filter = null, ...others) {
    try {
      let bh = { input: { filter: filter }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_LmlNGBGPMFugsgV5(bh);
      //appendnew_next_getConfigsByFilter
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigLinks(configId = null, ...others) {
    try {
      let bh = { input: { configId: configId }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_P90XQqQOfGtX2NZi(bh);
      //appendnew_next_getConfigLinks
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async addConfigLinks(data = null, ...others) {
    try {
      let bh = { input: { data: data }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_rB0PUVW1q4u79wUi(bh);
      //appendnew_next_addConfigLinks
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getChildrenConfigCount(configId = null, ...others) {
    try {
      let bh = { input: { configId: configId }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_leVoLBHPW60NhZcZ(bh);
      //appendnew_next_getChildrenConfigCount
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async searchLinkDetails(
    filter = null,
    pageNumber = undefined,
    pageSize = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { filter: filter, pageNumber: pageNumber, pageSize: pageSize },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_SR8AkPcXVe0GekgB(bh);
      //appendnew_next_searchLinkDetails
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigLinkProps(configId = undefined, ...others) {
    try {
      let bh = { input: { configId: configId }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_uZHsw0g45fm5clc7(bh);
      //appendnew_next_getConfigLinkProps
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async createConfigLinkDetails(linkDetails = null, ...others) {
    try {
      let bh = { input: { linkDetails: linkDetails }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_2uqw9t1Iyz5aKNv7(bh);
      //appendnew_next_createConfigLinkDetails
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async editConfigLinkDetails(linkDetails = null, ...others) {
    try {
      let bh = { input: { linkDetails: linkDetails }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_jZbob8eSWZKYiNV8(bh);
      //appendnew_next_editConfigLinkDetails
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getConfigdataByUuid(fsuuid = null, ...others) {
    try {
      let bh = { input: { fsuuid: fsuuid }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_DtAeilu0tP87BFgu(bh);
      //appendnew_next_getConfigdataByUuid
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getMetadataValues(filter = null, ...others) {
    try {
      let bh = { input: { filter: filter }, local: { configValues: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_FNufOypqQbdlEyjI(bh);
      //appendnew_next_getMetadataValues
      //Start formatting output variables
      let outputVariables = {
        input: {},
        local: { configValues: bh.local.configValues }
      };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_dmsconfiguration_Start

  async sd_SbrSfwPPMKW05hkV(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/saveConfiguration/${bh.input.collectionName}`;

      bh = await this.sd_m1FrR6ZkNQHXNsWp(bh);
      //appendnew_next_sd_SbrSfwPPMKW05hkV
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_m1FrR6ZkNQHXNsWp(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqObj
      };
      bh.input.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_m1FrR6ZkNQHXNsWp
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_k6mYQXKDzyvMwz9u(bh) {
    try {
      //let filterObj = bh.input.filterObj;
      //let activeFlag = true;
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/config/${bh.input.collectionName}`;

      bh = await this.sd_F6dZcV1YxxrSiWRZ(bh);
      //appendnew_next_sd_k6mYQXKDzyvMwz9u
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_F6dZcV1YxxrSiWRZ(bh) {
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
      //appendnew_next_sd_F6dZcV1YxxrSiWRZ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_l4qI3TrGQf0FTYvL(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateConfiguration/${bh.input.collectionName}?configId=${bh.input.configId}`;

      bh = await this.sd_JQiTSCshq4FEGTpu(bh);
      //appendnew_next_sd_l4qI3TrGQf0FTYvL
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_JQiTSCshq4FEGTpu(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: undefined
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_JQiTSCshq4FEGTpu
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_F96HDayTUwbM50X6(bh) {
    try {
      //console.log(bh.input.configId)
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateConfiguration?collectionName=${bh.input.collectionName}`;

      bh = await this.sd_wsGU0vLBBeafpV4k(bh);
      //appendnew_next_sd_F96HDayTUwbM50X6
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_wsGU0vLBBeafpV4k(bh) {
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
      //appendnew_next_sd_wsGU0vLBBeafpV4k
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_XwR9lKDD3ATZLwdr(bh) {
    try {
      const filter = JSON.stringify(bh.input.filter);
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configValues?filter=${filter}`;

      bh = await this.sd_dEkcepLUaoH91SaD(bh);
      //appendnew_next_sd_XwR9lKDD3ATZLwdr
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_dEkcepLUaoH91SaD(bh) {
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
      bh.local.configValues = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_dEkcepLUaoH91SaD
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ffHHUHH26DGC29Bk(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/config/${bh.input.configId}`;

      bh = await this.sd_2TOCcHKevH4ud7VN(bh);
      //appendnew_next_sd_ffHHUHH26DGC29Bk
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_2TOCcHKevH4ud7VN(bh) {
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
      bh.local.configData = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_2TOCcHKevH4ud7VN
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Iu4bd9CauOzfnxJF(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/createConfigValues`;

      bh = await this.sd_j00O9nwFEES9wMD1(bh);
      //appendnew_next_sd_Iu4bd9CauOzfnxJF
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_j00O9nwFEES9wMD1(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.configValues
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_j00O9nwFEES9wMD1
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_gORilOef7U8V08l9(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configValues`;

      bh = await this.sd_g9yF6DCNEri3SK0b(bh);
      //appendnew_next_sd_gORilOef7U8V08l9
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_g9yF6DCNEri3SK0b(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.update
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_g9yF6DCNEri3SK0b
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_yjwwo1aX3WqQgcAk(bh) {
    try {
      bh.local.params = {
        filter: JSON.stringify(bh.input.filter),
        pageNumber: bh.input.pageNumber || 1,
        pageSize: 10
      };
      bh.input.body = {};

      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/search/configValues`;

      bh = await this.sd_tgRRDfp7Wont4QsB(bh);
      //appendnew_next_sd_yjwwo1aX3WqQgcAk
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_tgRRDfp7Wont4QsB(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: bh.local.params,
        body: bh.input.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_tgRRDfp7Wont4QsB
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_tXr63YHKJ0jieoVY(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/file/configdata`;

      bh = await this.sd_OR85dEZCpyhqrWWO(bh);
      //appendnew_next_sd_tXr63YHKJ0jieoVY
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_OR85dEZCpyhqrWWO(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.configData
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_OR85dEZCpyhqrWWO
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_dYuiu4SnwJtXxfct(bh) {
    try {
      bh.local.params = {
        searchText: bh.input.searchText || '',
        pageNumber: bh.input.pageNumber || 1,
        pageSize: bh.input.size,
      };
      bh.input.body = {
        businessDepartment: bh.input.businessDepartment
      };

      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/config/search`;

      bh = await this.sd_MEZOtLPDjxMPjNb6(bh);
      //appendnew_next_sd_dYuiu4SnwJtXxfct
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_MEZOtLPDjxMPjNb6(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: bh.local.params,
        body: bh.input.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_MEZOtLPDjxMPjNb6
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_1uujWyaWbiEcSRQ3(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/config`;

      bh = await this.sd_HjLiFjY5JeSNd5Dd(bh);
      //appendnew_next_sd_1uujWyaWbiEcSRQ3
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_HjLiFjY5JeSNd5Dd(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.config
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_HjLiFjY5JeSNd5Dd
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_nIEUe8QsQfE9FnIj(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/isConfigUsed/${bh.input.configId}`;

      bh = await this.sd_gXxZhcYfulYRSiCS(bh);
      //appendnew_next_sd_nIEUe8QsQfE9FnIj
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_gXxZhcYfulYRSiCS(bh) {
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
      //appendnew_next_sd_gXxZhcYfulYRSiCS
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_7DyPBV8wek53RN4V(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/config`;

      bh = await this.sd_xZUq5tm9bdMIJlF7(bh);
      //appendnew_next_sd_7DyPBV8wek53RN4V
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_xZUq5tm9bdMIJlF7(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.config
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_xZUq5tm9bdMIJlF7
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_LmlNGBGPMFugsgV5(bh) {
    try {
      let filter = bh.input.filter || { active: true };
      filter = JSON.stringify(filter);
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs?filter=${filter}`;

      bh = await this.sd_ScXLPAHR3FcNnrSl(bh);
      //appendnew_next_sd_LmlNGBGPMFugsgV5
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ScXLPAHR3FcNnrSl(bh) {
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
      //appendnew_next_sd_ScXLPAHR3FcNnrSl
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_P90XQqQOfGtX2NZi(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/links/${bh.input.configId}`;

      bh = await this.sd_mO3Pa3Sg70fufqgB(bh);
      //appendnew_next_sd_P90XQqQOfGtX2NZi
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_mO3Pa3Sg70fufqgB(bh) {
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
      //appendnew_next_sd_mO3Pa3Sg70fufqgB
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_rB0PUVW1q4u79wUi(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/links`;

      bh = await this.sd_2CNl2ouDCCkf10hd(bh);
      //appendnew_next_sd_rB0PUVW1q4u79wUi
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_2CNl2ouDCCkf10hd(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.data
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_2CNl2ouDCCkf10hd
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_leVoLBHPW60NhZcZ(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/${bh.input.configId}/childCount`;

      bh = await this.sd_NhfGuMLivFC5Dk8i(bh);
      //appendnew_next_sd_leVoLBHPW60NhZcZ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_NhfGuMLivFC5Dk8i(bh) {
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
      //appendnew_next_sd_NhfGuMLivFC5Dk8i
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_SR8AkPcXVe0GekgB(bh) {
    try {
      bh.local.params = {
        filter: JSON.stringify(bh.input.filter),
        pageNumber: bh.input.pageNumber || 1,
        pageSize: bh.input.pageSize
      };
      bh.input.body = {};

      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/search/configs/linkDetails`;

      bh = await this.sd_X36Vyt4WnxPYaspd(bh);
      //appendnew_next_sd_SR8AkPcXVe0GekgB
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_X36Vyt4WnxPYaspd(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: bh.local.params,
        body: bh.input.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_X36Vyt4WnxPYaspd
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_uZHsw0g45fm5clc7(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/${bh.input.configId}/linkProps`;

      bh = await this.sd_OLTNV7NCACubfO9C(bh);
      //appendnew_next_sd_uZHsw0g45fm5clc7
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_OLTNV7NCACubfO9C(bh) {
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
      //appendnew_next_sd_OLTNV7NCACubfO9C
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_2uqw9t1Iyz5aKNv7(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/linkDetails`;

      bh = await this.sd_7ZpMsYFUJrEmoOxG(bh);
      //appendnew_next_sd_2uqw9t1Iyz5aKNv7
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_7ZpMsYFUJrEmoOxG(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.linkDetails
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_7ZpMsYFUJrEmoOxG
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_jZbob8eSWZKYiNV8(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configs/linkDetails`;

      bh = await this.sd_aL4y0LqnV6denMx5(bh);
      //appendnew_next_sd_jZbob8eSWZKYiNV8
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_aL4y0LqnV6denMx5(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.linkDetails
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_aL4y0LqnV6denMx5
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_DtAeilu0tP87BFgu(bh) {
    try {
      let filter = bh.input.filter || { active: true };
      filter = JSON.stringify(filter);
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/configData?fsuuid=${bh.input.fsuuid}`;

      bh = await this.sd_nXR3ymQC26IVyByP(bh);
      //appendnew_next_sd_DtAeilu0tP87BFgu
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_nXR3ymQC26IVyByP(bh) {
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
      //appendnew_next_sd_nXR3ymQC26IVyByP
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_FNufOypqQbdlEyjI(bh) {
    try {
      bh.input.body = {};
      const filter = JSON.stringify(bh.input.filter);
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/metadataValues?filter=${filter}`;

      bh = await this.sd_RbZvHtU29ITS5MYQ(bh);
      //appendnew_next_sd_FNufOypqQbdlEyjI
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_RbZvHtU29ITS5MYQ(bh) {
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
      bh.local.configValues = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_RbZvHtU29ITS5MYQ
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
