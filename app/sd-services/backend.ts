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
import { backendService } from 'app/services/backend/backend.service';
//CORE_REFERENCE_IMPORTS

declare const window: any;
declare const cordova: any;

@Injectable()
export class backend {
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
    private fileIOService: NFileIOService,
    private backendService:backendService
  ) {}

  //   service flows_backend

  public async createFolder(reqObj = undefined, ...others) {
    try {
      let bh = { input: { reqObj: reqObj }, local: { res: undefined } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_O846hCzOIUYWIG3b(bh);
      //appendnew_next_createFolder
      //Start formatting output variables
      let outputVariables =  bh.input['res'].rowdata;
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getFolders(...others) {
    try {
      let bh = { input: {}, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_ZoJewa2ryQztqlTd(bh);
      //appendnew_next_getFolders
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async curentSession(...others) {
    return {local: {res:this.backendService.currentUserObj}}
  }

  public async renameFS(
    uuid = undefined,
    reqBody = undefined,
    fsuuid = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { uuid: uuid, reqBody: reqBody, fsuuid: fsuuid },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_0nDksh5X6uo0EEuT(bh);
      //appendnew_next_renameFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async deleteFs(deleteObj = undefined, ...others) {
    try {
      let bh = { input: { deleteObj: deleteObj }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_KdDcaX4Sj5dwSoPF(bh);
      //appendnew_next_deleteFs
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async assignFolderAccess(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_UmhTgNwzhN3kJ5fr(bh);
      //appendnew_next_assignFolderAccess
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async createResourceGroup(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_xXeRU4nnBaWqA4Xv(bh);
      //appendnew_next_createResourceGroup
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getResourceFeatures(userGroup = undefined, ...others) {
    try {
      let bh = { input: { userGroup: userGroup }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_Gl4ifP2ijZiafSep(bh);
      //appendnew_next_getResourceFeatures
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getCurrentFS(
    logicalPath = undefined,
    filter = undefined,
    sort = undefined,
    pageNumber = 1,
    pageSize = 100,
    ...others
  ) {
    try {
      let bh = {
        input: {
          logicalPath: logicalPath,
          filter: filter,
          sort: sort,
          pageNumber: pageNumber,
          pageSize: pageSize
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_vpyNNf4qydP0yHAL(bh);
      //appendnew_next_getCurrentFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async moveToTrash(
    uuid = undefined,
    fsuuid = undefined,
    type = undefined,
    name = undefined,
    objectPath = undefined,
    content = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          uuid: uuid,
          fsuuid: fsuuid,
          type: type,
          name: name,
          objectPath: objectPath,
          content: content
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_dpVeUD0u9kOXFB0r(bh);
      //appendnew_next_moveToTrash
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async restoreFS(body = undefined, ...others) {
    try {
      let bh = { input: { body: body }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_pbdSq1OBRITBMXc2(bh);
      //appendnew_next_restoreFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getResourceFS(
    filterObj = undefined,
    sort = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { filterObj: filterObj, sort: sort },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_AVYTGn0cJqb2Jxol(bh);
      //appendnew_next_getResourceFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getResourceGroups(
    pageNumber = undefined,
    pageSize = undefined,
    sort = undefined,
    filter = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: sort,
          filter: filter
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_KgkeW41QJ5M3QRCt(bh);
      //appendnew_next_getResourceGroups
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getFolderFS(
    filterObj = undefined,
    sortObj = undefined,
    keys = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { filterObj: filterObj, sortObj: sortObj, keys: keys },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_Uo7yqAXIl3IJ6NBa(bh);
      //appendnew_next_getFolderFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async updateResourceFS(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_ceQDE8hiL8lK5tPA(bh);
      //appendnew_next_updateResourceFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async updateFolderFS(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_78ApqiUfS6dhw1TX(bh);
      //appendnew_next_updateFolderFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async deleteResourceGroup(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_YQsaA1zsXmzWiwuc(bh);
      //appendnew_next_deleteResourceGroup
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async auditLog(fsuuid = undefined, pageNumber = 1, ...others) {
    try {
      let bh = {
        input: { fsuuid: fsuuid, pageNumber: pageNumber },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_cjZXDrMNg20JML4n(bh);
      //appendnew_next_auditLog
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getAuth(...others) {
   return {local: {res: this.backendService.featureSet}}
  }
  public async deleteUploadedFile(deleteObj = undefined, ...others) {
    try {
      let bh = { input: { deleteObj: deleteObj }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_SRXLdAlGO54why66(bh);
      //appendnew_next_deleteUploadedFile
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getTrashList(
    pageNumber = undefined,
    pageSize = undefined,
    sort = undefined,
    filter = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: sort,
          filter: filter
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_xPlEgVp3BZGJpgqq(bh);
      //appendnew_next_getTrashList
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async deleteFileStorage(reqBody = undefined, ...others) {
    try {
      let bh = { input: { reqBody: reqBody }, local: { res: null } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_KGtRg8e6nUIopfyo(bh);
      //appendnew_next_deleteFileStorage
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async searchFS(
    filterObj = undefined,
    sortObj = undefined,
    pageNumber = 1,
    pageSize = 100,
    ...others
  ) {
    try {
      let bh = {
        input: {
          filterObj: filterObj,
          sortObj: sortObj,
          pageNumber: pageNumber,
          pageSize: pageSize
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_mkrZG6lsxSlmll1Z(bh);
      //appendnew_next_searchFS
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getPrivilegeGroupUsers(
    pageNumber = undefined,
    pageSize = undefined,
    name = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: { pageNumber: pageNumber, pageSize: pageSize, name: name },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_lEQDo1s1gmvkhQo9(bh);
      //appendnew_next_getPrivilegeGroupUsers
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getUserFolders(
    // pageNumber = undefined,
    // pageSize = undefined,
    filter = undefined,
    sort = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          // pageNumber: pageNumber,
          // pageSize: pageSize,
          filter: filter,
          sort: sort
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_eP2UvdnbTF0Fkt1A(bh);
      //appendnew_next_getUserFolders
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async multipleLocUpload(reqObj = undefined, ...others) {
    try {
      let bh = { input: { reqObj: reqObj }, local: { res: undefined } };
      bh = this.__constructDefault(bh);

      bh = await this.sd_aP04OIjCfVPRrpjO(bh);
      //appendnew_next_multipleLocUpload
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  public async getResourceData(
    filter = undefined,
    keys = undefined,
    sort = undefined,
    pageNumber = undefined,
    pageSize = undefined,
    ...others
  ) {
    try {
      let bh = {
        input: {
          filter: filter,
          keys: keys,
          sort: sort,
          pageNumber: pageNumber,
          pageSize: pageSize
        },
        local: { res: null }
      };
      bh = this.__constructDefault(bh);

      bh = await this.sd_YrTuaEm7srednEQ0(bh);
      //appendnew_next_getResourceData
      //Start formatting output variables
      let outputVariables = { input: {}, local: { res: bh.local.res } };
      //End formatting output variables
      return outputVariables;
    } catch (e) {
      throw e;
    }
  }
  //appendnew_flow_backend_Start

  async sd_O846hCzOIUYWIG3b(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/createFsObject`;

      bh = await this.sd_rtRvT0jCzidlYzuv(bh);
      
      
      //appendnew_next_sd_O846hCzOIUYWIG3b
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_rtRvT0jCzidlYzuv(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqObj
      };
      bh.input.res = await this.sdService.nHttpRequest(requestOptions);
      
      
      //appendnew_next_sd_rtRvT0jCzidlYzuv
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ZoJewa2ryQztqlTd(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/getFsObject`;

      bh = await this.sd_qJvqZNuRs8O4hh4L(bh);
      //appendnew_next_sd_ZoJewa2ryQztqlTd
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_qJvqZNuRs8O4hh4L(bh) {
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
      //appendnew_next_sd_qJvqZNuRs8O4hh4L
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_DcOtTamx8eDly8SW(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/is_login`;

      bh = await this.sd_2ukNIPDo8c5LQAvB(bh);
      //appendnew_next_sd_DcOtTamx8eDly8SW
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_2ukNIPDo8c5LQAvB(bh) {
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
      //appendnew_next_sd_2ukNIPDo8c5LQAvB
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_0nDksh5X6uo0EEuT(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateFolderName`;
      bh.local.headers = {
        fsuuid: bh.input.fsuuid
      };
      bh.input.reqBody['uuid'] = bh.input.uuid;

      bh = await this.sd_meuV9FgFBjuFczQa(bh);
      //appendnew_next_sd_0nDksh5X6uo0EEuT
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_meuV9FgFBjuFczQa(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: bh.local.headers,
        params: {},
        body: bh.input.reqBody
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_meuV9FgFBjuFczQa
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_KdDcaX4Sj5dwSoPF(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/deleteFs`;
      bh.local.body = bh.input.deleteObj;
      bh.local.headers = {
        fsuuid: bh.input.fsuuid
      };

      bh = await this.sd_5rJpNuQMroNIdAhs(bh);
      //appendnew_next_sd_KdDcaX4Sj5dwSoPF
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_5rJpNuQMroNIdAhs(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: bh.input.headers,
        params: {},
        body: bh.local.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_5rJpNuQMroNIdAhs
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_UmhTgNwzhN3kJ5fr(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/assignAccess`;

      bh = await this.sd_JhZb4qWUCJyCkKBu(bh);
      //appendnew_next_sd_UmhTgNwzhN3kJ5fr
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_JhZb4qWUCJyCkKBu(bh) {
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
      //appendnew_next_sd_JhZb4qWUCJyCkKBu
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_xXeRU4nnBaWqA4Xv(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/createResourceObj`;

      bh = await this.sd_g7wqLCrn1ekMafJv(bh);
      //appendnew_next_sd_xXeRU4nnBaWqA4Xv
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_g7wqLCrn1ekMafJv(bh) {
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
      //appendnew_next_sd_g7wqLCrn1ekMafJv
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Gl4ifP2ijZiafSep(bh) {
    try {
      let filterObj = bh.input.userGroup;
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getResource?filter=${JSON.stringify(filterObj)}`;

      bh = await this.sd_ORKkL4qwLEXYW6XJ(bh);
      //appendnew_next_sd_Gl4ifP2ijZiafSep
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ORKkL4qwLEXYW6XJ(bh) {
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
      //appendnew_next_sd_ORKkL4qwLEXYW6XJ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_vpyNNf4qydP0yHAL(bh) {
    try {
      let filterObj = { logicalPath: bh.input.logicalPath };
      if (bh.input.filter) filterObj = { ...filterObj, ...bh.input.filter };
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getFsObject?filter=${encodeURIComponent(
        JSON.stringify(filterObj)
      )}&sort=${JSON.stringify(bh.input.sort)}&pageNumber=${
        bh.input.pageNumber
      }&pageSize=${bh.input.pageSize}`;

      bh = await this.sd_Y5okaJ6TiyQPhPwS(bh);
      //appendnew_next_sd_vpyNNf4qydP0yHAL
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Y5okaJ6TiyQPhPwS(bh) {
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
      //appendnew_next_sd_Y5okaJ6TiyQPhPwS
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_dpVeUD0u9kOXFB0r(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/trashAction`;
      bh.local.headers = {
        fsuuid: bh.input.fsuuid
      };
      bh.input['reqBody'] = {
        uuid: bh.input.uuid,
        status: true,
        type: bh.input.type,
        fsuuid: bh.input.fsuuid,
        name: bh.input.name,
        objectPath: bh.input.objectPath,
        content: bh.input.content || []
      };

      bh = await this.sd_TsbWXGjgIuleBb5x(bh);
      //appendnew_next_sd_dpVeUD0u9kOXFB0r
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_TsbWXGjgIuleBb5x(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: bh.input.headers,
        params: {},
        body: bh.input.reqBody
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_TsbWXGjgIuleBb5x
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_pbdSq1OBRITBMXc2(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/trashAction`;
      bh.input['reqBody'] = Object.assign(bh.input.body, { status: false });

      bh = await this.sd_oheWpYOW26H4JqgA(bh);
      //appendnew_next_sd_pbdSq1OBRITBMXc2
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_oheWpYOW26H4JqgA(bh) {
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
      //appendnew_next_sd_oheWpYOW26H4JqgA
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_AVYTGn0cJqb2Jxol(bh) {
    try {
      let filterObj = bh.input.filterObj;
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/getResourceFsList?filter=${JSON.stringify(
        filterObj
      )}&sort=${JSON.stringify(bh.input.sort || null)}`;

      bh = await this.sd_jmSFBE3QhPj9krMp(bh);
      //appendnew_next_sd_AVYTGn0cJqb2Jxol
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_jmSFBE3QhPj9krMp(bh) {
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
      //appendnew_next_sd_jmSFBE3QhPj9krMp
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_KgkeW41QJ5M3QRCt(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/resourceGroups?pageNumber=${bh.input.pageNumber ||
        '1'}&pageSize=${bh.input.pageSize || 25}&filter=${JSON.stringify(
        bh.input.filter
      )}&sort=${JSON.stringify(bh.input.sortObj || {})}`;

      bh = await this.sd_kof6iFHg8E1wn8g2(bh);
      //appendnew_next_sd_KgkeW41QJ5M3QRCt
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_kof6iFHg8E1wn8g2(bh) {
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
      //appendnew_next_sd_kof6iFHg8E1wn8g2
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_Uo7yqAXIl3IJ6NBa(bh) {
    try {
      let filterObj = bh.input.filterObj;
      filterObj = encodeURIComponent(JSON.stringify(filterObj));
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/foldersData?filter=${filterObj}&sort=${JSON.stringify(
        bh.input.sortObj || {}
      )}&keys=${JSON.stringify(bh.input.keys || {})}`;

      bh = await this.sd_TYAh7tfgzWQHaQwR(bh);
      //appendnew_next_sd_Uo7yqAXIl3IJ6NBa
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_TYAh7tfgzWQHaQwR(bh) {
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
      //appendnew_next_sd_TYAh7tfgzWQHaQwR
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ceQDE8hiL8lK5tPA(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateResourceAccess`;

      bh = await this.sd_DeAvUdU2jahAxbF5(bh);
      //appendnew_next_sd_ceQDE8hiL8lK5tPA
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_DeAvUdU2jahAxbF5(bh) {
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
      //appendnew_next_sd_DeAvUdU2jahAxbF5
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_78ApqiUfS6dhw1TX(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/updateFolderAccess`;

      bh = await this.sd_SKrLTE6y42I8Rzjn(bh);
      //appendnew_next_sd_78ApqiUfS6dhw1TX
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_SKrLTE6y42I8Rzjn(bh) {
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
      //appendnew_next_sd_SKrLTE6y42I8Rzjn
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_YQsaA1zsXmzWiwuc(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/deleteResourceGroup`;

      bh = await this.sd_IuTzAgZqCob6AKSv(bh);
      //appendnew_next_sd_YQsaA1zsXmzWiwuc
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_IuTzAgZqCob6AKSv(bh) {
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
      //appendnew_next_sd_IuTzAgZqCob6AKSv
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_cjZXDrMNg20JML4n(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/auditLogs?fsuuid=${bh.input.fsuuid}&pagesize=10&pageNumber=${bh.input.pageNumber}`;

      bh = await this.sd_SoOA04Sq1F5yTURu(bh);
      //appendnew_next_sd_cjZXDrMNg20JML4n
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_SoOA04Sq1F5yTURu(bh) {
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
      //appendnew_next_sd_SoOA04Sq1F5yTURu
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_j4UVXLL3eMm8iCmb(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/navigate`;

      bh = await this.sd_MjHfOwfQatjLzE2X(bh);
      //appendnew_next_sd_j4UVXLL3eMm8iCmb
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_MjHfOwfQatjLzE2X(bh) {
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
      bh = await this.sd_5Sjy2ce5EtHdvEfu(bh);
      //appendnew_next_sd_MjHfOwfQatjLzE2X
      return bh;
    } catch (e) {
      throw e;
    }
  }

  async sd_5Sjy2ce5EtHdvEfu(bh) {
    try {
      let otherwiseFlag = true;
      if (
        this.sdService.operators['eq'](
          bh.local.res.length,
          0,
          undefined,
          undefined
        )
      ) {
        bh = await this.sd_BCK8wi543roiRCHb(bh);
        otherwiseFlag = false;
      }
      if (
        this.sdService.operators['else'](
          otherwiseFlag,
          undefined,
          undefined,
          undefined
        )
      ) {
        otherwiseFlag = false;
      }

      return bh;
    } catch (e) {
      throw e;
    }
  }

  async sd_BCK8wi543roiRCHb(bh) {
    try {
      const {
        paramObj: qprm,
        path: path
      } = this.sdService.getPathAndQParamsObj('/nonaccess');
      await this.router.navigate([
        this.sdService.formatPathWithParams(path, undefined)
      ]);
      //appendnew_next_sd_BCK8wi543roiRCHb
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_SRXLdAlGO54why66(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/deleteUploadedFile`;
      bh.local.body = bh.input.deleteObj;

      bh = await this.sd_EnuFbl57TJCvZchO(bh);
      //appendnew_next_sd_SRXLdAlGO54why66
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_EnuFbl57TJCvZchO(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'json',
        reportProgress: undefined,
        headers: bh.input.headers,
        params: {},
        body: bh.local.body
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_EnuFbl57TJCvZchO
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_xPlEgVp3BZGJpgqq(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/trash/list?pageNumber=${bh.input.pageNumber ||
        '1'}&pageSize=${bh.input.pageSize || 25}&filter=${encodeURIComponent(
        JSON.stringify(bh.input.filter)
      )}&sort=${JSON.stringify(bh.input.sort || {})}`;

      bh = await this.sd_nWtBUCaI7gh5HuIs(bh);
      //appendnew_next_sd_xPlEgVp3BZGJpgqq
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_nWtBUCaI7gh5HuIs(bh) {
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
      //appendnew_next_sd_nWtBUCaI7gh5HuIs
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_KGtRg8e6nUIopfyo(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/deleteFileFromStorage`;

      bh = await this.sd_TTnrYFHviqcQykKS(bh);
      //appendnew_next_sd_KGtRg8e6nUIopfyo
      console.log("from backend",bh)
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_TTnrYFHviqcQykKS(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'put',
        responseType: 'text',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqBody
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_TTnrYFHviqcQykKS
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_mkrZG6lsxSlmll1Z(bh) {
    try {
      bh.input.body = {};

      let filterObj = bh.input.filterObj;
      let searchFilterObj = encodeURIComponent(JSON.stringify(filterObj));
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/searchFS?filter=${searchFilterObj ||
        {}}&sort=${JSON.stringify(bh.input.sortObj || {})}&pageNumber=${
        bh.input.pageNumber
      }&pageSize=${bh.input.pageSize}`;

      bh = await this.sd_yKTH4hJCVV93nKBm(bh);
      //appendnew_next_sd_mkrZG6lsxSlmll1Z
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_yKTH4hJCVV93nKBm(bh) {
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
      //appendnew_next_sd_yKTH4hJCVV93nKBm
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_lEQDo1s1gmvkhQo9(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/privilegeGroupUsers?pageNumber=${bh.input.pageNumber ||
        '1'}&pageSize=${bh.input.pageSize || 25}&name=${
        bh.input.name
      }&sort=${JSON.stringify(bh.input.sortObj || {})}`;

      bh = await this.sd_HNM9RgP1x841gHBy(bh);
      //appendnew_next_sd_lEQDo1s1gmvkhQo9
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_HNM9RgP1x841gHBy(bh) {
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
      //appendnew_next_sd_HNM9RgP1x841gHBy
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_eP2UvdnbTF0Fkt1A(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/folderList?filter=${JSON.stringify(
        bh.input.filter
      )}&sort=${JSON.stringify(bh.input.sort || {})}`;

      bh = await this.sd_ZfBnzg53f4vMH5qQ(bh);
      //appendnew_next_sd_eP2UvdnbTF0Fkt1A
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_ZfBnzg53f4vMH5qQ(bh) {
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
      //appendnew_next_sd_ZfBnzg53f4vMH5qQ
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_aP04OIjCfVPRrpjO(bh) {
    try {
      bh.local.url = `${bh.system.environment.properties.modelrUrl}modelr/api/mutipleLocUpload`;

      bh = await this.sd_gsW3ocnFgCjnEfnR(bh);
      //appendnew_next_sd_aP04OIjCfVPRrpjO
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_gsW3ocnFgCjnEfnR(bh) {
    try {
      let requestOptions = {
        url: bh.local.url,
        method: 'post',
        responseType: 'json',
        reportProgress: undefined,
        headers: {},
        params: {},
        body: bh.input.reqObj
      };
      bh.local.res = await this.sdService.nHttpRequest(requestOptions);
      //appendnew_next_sd_gsW3ocnFgCjnEfnR
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_YrTuaEm7srednEQ0(bh) {
    try {
      bh.input.body = {};
      bh.local.url = `${
        bh.system.environment.properties.modelrUrl
      }modelr/api/resourceData?pageNumber=${bh.input.pageNumber ||
        '1'}&pageSize=${bh.input.pageSize || 25}&filter=${JSON.stringify(
        bh.input.filter
      )}&sort=${JSON.stringify(bh.input.sort || {})}&keys=${JSON.stringify(
        bh.input.keys || {}
      )}`;

      bh = await this.sd_98r69P1JCBCKZ42v(bh);
      //appendnew_next_sd_YrTuaEm7srednEQ0
      return bh;
    } catch (e) {
      throw e;
    }
  }
  async sd_98r69P1JCBCKZ42v(bh) {
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
      //appendnew_next_sd_98r69P1JCBCKZ42v
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
