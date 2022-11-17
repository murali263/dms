import { dmsstatus } from '../../sd-services/dmsstatus';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { NPubSubService, NLocalStorageService } from 'neutrinos-seed-services';

export class FileDataSource extends DataSource<any> {

    public files = [];
    private dataStream = new BehaviorSubject([]);
    limitReached = false;
    pageNumber = 1;
    searchPubSub;
    filesArr = [];
    //filterObj = {};
    sortObj = { timestamp: -1 }
    /**
     * 
     * @param {dmsstatus} api 
     * @param {Number} size 
     * @param {String} status 
     */
    constructor(
        private api: dmsstatus,
        private size: Number,
        private status: String,
        private filterObj: Object,
        private snackBar: any
    ) {
        super();
        this._getData(this.filterObj);
        this.limitReached = false;
    }


    connect(collectionViewer: CollectionViewer) {
        // this._getData(this.filterObj);
        return this.dataStream;
    }


    _getData(filterObj?, encodeState = false) {
        this.limitReached = true;
        let decodedFilter = (encodeState) ? JSON.parse(decodeURIComponent(atob(filterObj))) : filterObj;
        let filter = {"hidden": { "$exists": false }}

        this.api.getMyFiles(this.size, this.status, this.pageNumber, decodedFilter || filter , this.sortObj)
            .then((res) => {
                if(res.local.files['fileList'].length > 0){
                if (res.local.files['pageNumber'] == this.pageNumber) {
                    this.files = this.files.concat(res.local.files['fileList']);
                    if (res.local.files['fileList'].length == 0 || res.local.files['fileList'].length < this.size) {
                        this.limitReached = true;
                    } else {
                        this.limitReached = false;
                        this.pageNumber++;
                    }
                    this.dataStream.next(this.files);
                }
            }else{
                this.snackBar.openSnackBar('No Result Found');
            }
            
            }).catch(err => {
                console.error("error in FileDataSource", err);
            });
    }
   
    update() {
        this._getData(this.filterObj);
    }
    disconnect(): void {
    }

}
