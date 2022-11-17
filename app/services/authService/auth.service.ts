import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { backendService } from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuth: boolean = false;

  public accessToken: string = null;
  public loggedInEmail: string;
  public loggedInUserFName: string;
  public loggedInUserLName: string;
  public loggedInUserPhone: string;
  public id: string;
  public userPrincipalName: string;
  public jobTitle: string;
  public officeLocation: string;
  public preferredLanguage: string;
  public displayName: string;
  public businessPhones: string;
  public showLoader=new Subject<boolean>();

  public currentUserRoleAccess = null;
  public currentRoleAccessSubject: Subject<boolean> = new Subject<boolean>();

  public _tokenExpiryInSeconds: number = null;
  private _refreshInProgress: boolean = false;

  constructor(
    private _router: Router,
    private _authService: MsalService,
    private backend: backendService
  ) { }

  public async checkAuth(): Promise<any> {
      const requestObj = { scopes: ['user.read', "openid", "profile"], };
      return this._authService.acquireTokenSilent(requestObj)
  }

  public logout(): void {
    let lang = localStorage.getItem('lang');
    this._authService.logout();
    this.isAuth = false;
    window.localStorage.clear();
    sessionStorage.clear()
    localStorage.setItem('lang', lang);
  }

  public getisAuth() {
    return this.isAuth;
  }

  public storeUserData(userDetails): void {

    this.accessToken = userDetails.apiToken.access_token;
    this.loggedInEmail = userDetails.userDetails.mail;
    this.loggedInUserFName = userDetails.userDetails.givenName;
    this.loggedInUserLName = userDetails.userDetails.surname;
    this.loggedInUserPhone = userDetails.userDetails.mobilePhone;
    this.id = userDetails.userDetails.id;
    this.userPrincipalName = userDetails.userDetails.userPrincipalName;
    this.jobTitle = userDetails.userDetails.jobTitle;
    this.officeLocation = userDetails.userDetails.officeLocation;
    this.preferredLanguage = userDetails.userDetails.preferredLanguage;
    this.displayName = userDetails.userDetails.displayName;
    this.businessPhones = userDetails.userDetails.businessPhones;
    // console.log(userDetails.userDetails.userPrincipalName)
    localStorage.setItem('accessTokenApi', userDetails.apiToken.access_token);
    localStorage.setItem('email', userDetails.userDetails.userPrincipalName);
    localStorage.setItem('firstName', userDetails.userDetails.givenName);
    localStorage.setItem('lastName', userDetails.userDetails.surname);
    localStorage.setItem("displayName",userDetails.userDetails.displayName);

  }

  public getAccessToken() {
    if (this.accessToken) return this.accessToken;
    return localStorage.getItem('accessTokenApi');
  }

}
