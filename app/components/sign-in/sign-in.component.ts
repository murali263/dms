import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'app/services/authService/auth.service';
import { backendService } from 'app/services/backend/backend.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public authPassed: boolean = true;
  public subscription: Subscription;

  constructor(
    private authService: MsalService,
    private snackBar: MatSnackBar,
    private _auth: AuthService,
    private backend: backendService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  public showSpinner: boolean = false;

  async login() {
    console.log("data")
    this.showSpinner = true;
    this.popUpInWebBrowser();
  }

  popUpInWebBrowser() {
    if (!!this.authService.getAccount() && this.authPassed) {
      this.getAccessTokenPopup();
      return;
    }
    this.authService.loginPopup({ extraScopesToConsent: ['user.read', 'openid', 'profile'], prompt: 'select_account', }).then((data) => {
      const requestObj = { scopes: ['user.read'], };
      let self = this;
      this.authService.acquireTokenSilent(requestObj).then((tokenResponse) => {
        localStorage.setItem('accessTokenApi', tokenResponse.accessToken);
        self.getProfile(tokenResponse.accessToken);
      }).catch(function (error) {

        self.showSpinner = false
      });
    }).catch(err => {

      this.showSpinner = false
    });
  }

  async getAccessTokenPopup() {
    try {

      let tokenResponse = await this.authService.acquireTokenPopup({ scopes: ['user.read'], });
      if (tokenResponse.accessToken) {
        localStorage.setItem('accessTokenApi', tokenResponse.accessToken);
        this.getProfile(tokenResponse.accessToken);
        return;
      }
      this.snackBar.open("Unable to acquire token. Please click on Let's Start button again.", "Ok");
      this.showSpinner = false;
    } catch (err) {
      this.authPassed = false;
      this.popUpInWebBrowser();
      this.showSpinner = false;
    }
  }


  getProfile(accessToken) {

    try {
      this.backend.getDetailsFromAccessToken(accessToken).then((userDetails) => {

        this.setTokensUserDetails(userDetails);
      }).catch((error) => {
        this.authPassed = false;
        this.popUpInWebBrowser();
      });
    } catch (err) {
      this.authPassed = false;
      this.popUpInWebBrowser();
      this.snackBar.open('Login failed!', "Ok");
      this.showSpinner = false;
      console.error(err);
    }
  }

  async setTokensUserDetails(userDetails) {

    this.subscription = this._auth.showLoader.subscribe(load => {
      this.showSpinner = load;
    })
    if (userDetails.success == true) {
      this._auth.accessToken = userDetails.apiToken.access_token;
      localStorage.setItem('accessTokenApi', this._auth.accessToken);
      this._auth.isAuth = true;
      this._auth.storeUserData(userDetails);

      this.router.navigate(['home/dashboard'])
    } else {
      this.snackBar.open('Login Failed!', 'Ok');
    }
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
