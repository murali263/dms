/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NSystemService, NSessionStorageService } from 'neutrinos-seed-services';
import { map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { genericService } from '../generic/generic.service';
import { environment } from 'environments/environment';
import { AuthService } from '../authService/auth.service';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class backendService {
    private sysServiceObj = NSystemService.getInstance();
    modelerUrl: string;
    currentFolder: any;
    currentUserObj;

    featureSet = [];

    userGroup = [];

    currentResourceAccess = []

    emitChangeSource = new Subject<any>();
    changeEmitted = this.emitChangeSource.asObservable();

    folderDownloadCount = -1;
    DownloadCurrCount = 0;
    // folderDownloadCount = 3;
    // DownloadCurrCount = 2;

    constructor(private http: HttpClient,
        private router: Router,
        private mSalService: MsalService,
        private genericService: genericService) {
        this.modelerUrl = this.sysServiceObj.getVal('modelrUrl');
    }

    public getHeader(): HttpHeaders {
        let headers: HttpHeaders = new HttpHeaders({
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": environment.properties.subscriptionKey,
            "Authorization": `Bearer ${localStorage.getItem("accessTokenApi")}`
        });
        return headers;
    }


    makeGetApiCall(endpoint: string, params?): Observable<any> {
        let headers: HttpHeaders = this.getHeader();
        let url = `${environment.properties.baseUrlAF}${endpoint}`;
        return this.http.get(url, { headers, params });
    }

    // make a POST API request and returns Observable
    makePostApiCall(endpoint: string, payload: any): Observable<any> {
        let headers: HttpHeaders = this.getHeader();
        let url = `${environment.properties.baseUrlAF}${endpoint}`;
        return this.http.post(url, payload, { headers });
    }

    public getDetailsFromAccessToken(accessToken) {
        let headers: HttpHeaders = this.getHeader();
        let url = `${environment.properties.tokenURL}/get_token_from_access_token`;
        let obj = { accessToken, onlyBasicUser: "yes" };
        return this.http.post(url, obj, { headers }).toPromise();
    }

    public getUserInfoAndNavData(params) {
        return this.makeGetApiCall("apiCheckIsUserValid", params).toPromise()
    }

    public getResourceGroupMod(params) {
        return this.makeGetApiCall("apiGetResourceGroup", params).toPromise()
    }
    emitChange(keyAction) {
        this.emitChangeSource.next(keyAction);
    }

    getAccessAction() {
        return this.featureSet.map(el => { return el['key'] });
    }
    apiGetUserGroup(paginationIndex) {

        return this.makeGetApiCall('apiGetUserGroup', { page: paginationIndex });
    }
    createUpdatePrivilegeGroup(reqObj) {
        return this.makePostApiCall("createUpdateResourceGrp", reqObj).toPromise();
    }
    deleteResourceGroups(params) {

        return this.makePostApiCall('apiSaveUserGroup', params)
    }

    public getFSUserList(params) {
        return this.makeGetApiCall('apiGetFSUserList', params);
    }
    // curentSession() {
    //     return this.http.get(`${this.modelerUrl}modelr/api/is_login`);
    // }

    /**
     * Uploads file to azure , returns an url
     * @param fileData :File Content
     * @param filename : File Name
     * @param filetype : File type (Extension)
     */
    uploadfile(fileData: File, filename, filetype?) {
        let uploadData = new FormData();
        uploadData.append('myFile', fileData, filename);
        return this.http.post(`${this.modelerUrl}modelr/api/fileUpload`, fileData, {
            headers: new HttpHeaders({
                'fileextension': filetype,
                'content-type': 'multipart/form-data'
            })
        });
    }

    async searchUser(val) {
        try {
            if (!val) {
                return [];
            }
            let tokenSet = JSON.parse(localStorage.getItem('tokenset'));
            val = val.trim();
            let searchUserUrl = `https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName, '${val}')`;

            let headers = new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenSet.access_token,
            });
            const res: any = await this.http.get(searchUserUrl, { headers }).toPromise();
            if (res && res.value) {
                return res.value;
            }

            return [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    public getUserGroup(params) {
        return this.makeGetApiCall('apiGetUserGroup', params);
    }

    // /**
    //  * Renames the FS
    //  * @param uuid : uuid of Folder/File
    //  * @param reqBody : Object containg newFolderName value
    //  */
    // renameFS(uuid, reqBody) {
    //     return this.http.put(`${this.modelerUrl}public/updateFolderName?uuid=${uuid}`, reqBody);
    // }


    // /**
    //  * Deletes the folder
    //  * @param uuid : uuid of Folder/File
    //  * @param parentId : Parent  FS uuid
    //  */
    // deleteFs(uuid, parentId) {
    //     return this.http.put(`${this.modelerUrl}public/deleteFs?uuid=${uuid}&parentId=${parentId}`, null)
    // }

    /**
     * Creates an downloadable link
     * @param filePath : FilePath or fileName(Azure URl)
     */
    downloadFile(filePath, fileName, fsuuid, clientContainerName) {
        // window.location.href = `${this.modelerUrl}public/getFile?fileName=${filePath}`;
        return this.http.post(`${this.modelerUrl}modelr/api/getFile?fileName=${filePath}&clientContainerName=${clientContainerName}`, {}, {
            responseType: 'blob',
            headers: { fsuuid: fsuuid }
        }).subscribe(res => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(res);
            link.download = fileName;
            link.click();
        });


    }
    downloadFolder(folderName, logicalPath) {
        this.DownloadCurrCount = 0;
        let filter = JSON.stringify({
            logicalPath: logicalPath,
            type: "File",
            latest: true
        });

        let sort = JSON.stringify({ timestamp: -1 })

        this.http.post(`${this.modelerUrl}modelr/api/getFsObject?filter=${filter}&sort=${sort}`, {}).subscribe((FileList: any) => {
            this.folderDownloadCount = FileList.length;
            // To download only latest version based on unique FSSUID key
            FileList = this.genericService.getUniqueArray(FileList, 'fsuuid');
            FileList = FileList.map(el => {
                return this._getFile(el.fileName, el.name, el.fsuuid, el.clientContainerName);
            });
            Promise.all(FileList).then(async filesBlobs => {
                let zip: JSZip = new JSZip();
                await filesBlobs.forEach(fileElement => {
                    zip.folder(folderName).file(fileElement['name'], fileElement['blob']);
                });
                zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                }).then(res => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(res);
                    link.download = folderName;
                    link.click();
                    this.folderDownloadCount = -1;
                    this.DownloadCurrCount = 0;
                });
            });
        });
    }

    _getFile(filePath, fileName, fsuuid, clientContainerName) {
        console.log(filePath, fileName, fsuuid, clientContainerName)
        return new Promise((resolve, reject) => {
            this.http.post(`${this.modelerUrl}modelr/api/getFile?fileName=${filePath}&clientContainerName=${clientContainerName}`, {}, {
                responseType: 'blob',
                headers: {
                    fsuuid: fsuuid,
                    disableLoader: 'Y'
                }
            }).subscribe(res => {
                this.DownloadCurrCount++;
                resolve({
                    name: fileName,
                    blob: res
                });
            });
        });
    }

    getCategoryList() {
        let endpoint = "apiGetUserGroupCategory";
        return this.makeGetApiCall(endpoint);
    }

    bulkupdate(payload) {
        return this.makePostApiCall('apiBulkupdate', payload)
    }

    saveUserGroup(payload) {
        return this.makePostApiCall('apiSaveUserGroup', payload)
    }

    checkDuplicateUserGroup(params) {
        return this.makeGetApiCall('apiGetUserGroup', params)
    }

    moveFile(payload) {
        return this.makePostApiCall('apiMoveFile', payload)
    }

    copyFile(payload) {
        return this.makePostApiCall('apiCopyFile', payload)
    }

    getUserList(params) {
        return this.makeGetApiCall('apiGetUserList', params)
    }

    updateMetadataConfig(payload) {
        return this.makePostApiCall('apiUpdateMetaDataConfiguration', payload).toPromise();
    }

    multireject(reqObj) {
        return this.makePostApiCall('apiMultipleRejection', reqObj)
    }

    multiApprove(reqObj) {
        return this.makePostApiCall('apiMultipleApproval', reqObj)
    }
    getFileList(params) {
        return this.makeGetApiCall('apiGetFileList', params);
    }
    restoreDocVersion(payload) {
        return this.makePostApiCall('apiRestoreDocumentVersion', payload);
    }

    searchuserbyfilter(payload) {
        return this.makePostApiCall('apiGetFilebyFilter', payload);
    }
    businessDepartments() {
        return this.makeGetApiCall('apiGetBusinessDepartments')
    } 
    mailNotifications(payload) {
        return this.makePostApiCall('apiAddToNotificationQueue', payload);
    }
}
