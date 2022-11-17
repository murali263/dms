/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders,
    HttpResponse,
    HttpErrorResponse,
    HttpClient
} from "@angular/common/http";
import { NSnackbarService, NLocalStorageService } from 'neutrinos-seed-services';
import { catchError, finalize } from 'rxjs/operators';
import { NPubSubService } from 'neutrinos-seed-services';
import { throwError } from 'rxjs';
import { backendService } from '../backend/backend.service';
import { Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';


@Injectable()
export class ingredionloaderService implements HttpInterceptor {

    reqCounter = 0;
    loaderStatus: any;

    constructor(public pubSubService: NPubSubService,
        private nSnackBar: NSnackbarService,
        private backendService: backendService,
        private router:Router,
        private nlocalStorage: NLocalStorageService, private authService:AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        // Disable Loader based on Headers
        this.loaderStatus = req.headers.get('disableLoader');
        this.requestInterceptor();

        return next
            .handle(this.requestOptions(req))
            .pipe(
                catchError(error => this.onCatch(error, req, next)),
                finalize(() => {
                    this.responseInterceptor();
                })
            )
    }

    private requestInterceptor(): void {
        this.reqCounter++;
        if (this.reqCounter > 0)
            if (!this.loaderStatus)
                this.pubSubService.$pub('loader', true);
            else
                this.pubSubService.$pub('loader', false);

    }

    private responseInterceptor(): void {
        this.reqCounter--;
        if (this.reqCounter < 1)
            if (!this.loaderStatus)
                this.pubSubService.$pub('loader', false);
    }

    private requestOptions(req?: HttpRequest<any>) {
        let headers = req.headers;
        if (req.headers == null) {
          headers = new HttpHeaders();
        }
        let dataToSend={
            userInfo:JSON.parse(localStorage.getItem("userInfo")),
            tokenset:JSON.parse(localStorage.getItem("tokenset")),
            privilegeGroup:JSON.parse(localStorage.getItem("privilegeGroup")),
            featureList:localStorage.getItem("featureList"),
        };

        if(req.url.includes("modelr/")){

          headers=this.addExtraHeaders(headers,"group",dataToSend.userInfo.group);
          headers=this.addExtraHeaders(headers,"featurelist",dataToSend.featureList);
          headers=this.addExtraHeaders(headers,"privilegegroup",dataToSend.privilegeGroup);
          headers=this.addExtraHeaders(headers,"userinfo",JSON.stringify({displayName:dataToSend.userInfo.displayName,username:dataToSend.userInfo.username}));
        }

        let cloneObj = {
            url: req.url,
            headers:headers
        };
        if (req.url.includes("api/") || req.url.includes("public/")) cloneObj["withCredentials"] = true;
        req = req.clone(cloneObj);
        return req;
    }

    private addExtraHeaders(headers: HttpHeaders,headerName,headerValue): HttpHeaders {
      headers = headers.append(headerName, headerValue);
      return headers;
    }

    private onCatch(
        error: HttpErrorResponse,
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        return this.onSubscribeError(error);
    }

    private onSubscribeError(err): Observable<any> {
      this.authService.showLoader.next(false)
        if (err && err.status == 403 && err.error && err.error.message)
            this.nSnackBar.openSnackBar(err.error.message);
        if (err && err.status == 401 && err.error) {
            this.nSnackBar.openSnackBar(err.error.message);
            this.nlocalStorage.setValue("routeBack", window.location.hash);
            let baseUrl = this.backendService.modelerUrl;
            this.router.navigate(['/'])
            //window.location.href = `${baseUrl}auth/login?redirectUrl=${window.location.href}`;
            // this.nSnackBar.openSnackBar(err.error);
        }
        return throwError(err);
    }


}
