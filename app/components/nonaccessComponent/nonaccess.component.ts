import { Component, OnInit } from '@angular/core'
import { Observable, timer } from 'rxjs';
import { backendService } from "../../services/backend/backend.service";
import { NLocalStorageService } from 'neutrinos-seed-services';


@Component({
    selector: 'bh-nonaccess',
    templateUrl: './nonaccess.template.html'
})

export class nonaccessComponent implements OnInit {

    counter: Number = 0;
    loginUrl;
    constructor(private backendService: backendService,
        private nlocalStorage: NLocalStorageService) {
        this.loginUrl = `${this.backendService.modelerUrl}auth/login?redirectUrl=${window.location.href}`;
    }

    ngOnInit() {
        let timerCount = timer(100, 1000).subscribe(res => {
            this.counter = 10 - res;
            if (this.counter == 0) {
                timerCount.unsubscribe();
                this.nlocalStorage.setValue("routeBack", '#/home/documents');
                let baseUrl = this.backendService.modelerUrl;
                window.location.href = `${this.backendService.modelerUrl}auth/login?redirectUrl=${window.location.href}`;
            }
        });
    }

}
