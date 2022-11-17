import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NSnackbarService } from 'neutrinos-seed-services';
import sidenavConfig from '../../../assets/DMS-config/sidenav.json';


@Component({
    selector: 'bh-accessfeature',
    templateUrl: './accessfeature.template.html',
    styleUrls: ['./accessfeature.component.scss']
})

export class accessfeatureComponent implements OnInit {

    @Output() featureDetails = new EventEmitter();

    features = []

    selectAll = false;

    constructor(private fb: FormBuilder,
        public snackBar: NSnackbarService, ) {
        this.features = sidenavConfig.sidenav;
    }

    ngOnInit() {
        let docObj = {
            "key": "documents_view",
            "label": "Documents View",
            "function": "Documents View",
            "default": false,
            "sidenav": false,
            "checked": true,
            "disabled": true ,
            "index" : 11
        }

        if (!this.features.find(x => x.key == 'documents_view'))
            this.features.push(docObj);
    }


    onChange(event, index) {
        this.features[index]['checked'] = event.checked;
        this.isSelected();
    }

    /**
     * On Select All checkbox event
     * @param flag : Select all key flag
     */
    selectAllAction(flag) {
        this.features.forEach(el => {
            el.checked = flag
        });
    }

    isSelected() {
        this.selectAll = true;
        for (let e of this.features) {
            if (e.checked == false) {
                this.selectAll = false;
                break;
            }
        }
    }
}
