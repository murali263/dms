/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { HttpClient } from '@angular/common/http';

declare const Scribe: any;
@Component({
    selector: 'bh-docviewer',
    styleUrls: ['./docviewer.comopnent.scss'],
    templateUrl: './docviewer.template.html'
})
export class docviewerComponent implements OnInit {
    img_extensions: string[] = ['tif', 'tiff', 'gif', 'jpeg', 'jpg', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd', 'png'];
    /**
     * src_content : Can be any of the following:
     * 1) url
     * 2) blob.
     * 3) string content(text) 
     */
    @Input() src_content: any;
    @Input() auth: any;
    /**
     * docType: doctype is the extension of the file that is requested to be rendered. 
     */
    @Input() docType: string;
    @Input() options: Object;


    //to the get the value for authentication from parent component

    @Output() error = new EventEmitter<any>();
    docLoader = false;
    @ViewChild('view', { static: true }) private view: ElementRef;
    constructor(private renderer: Renderer2, private http: HttpClient) {
    }

    ngOnInit() {
        this.docLoader = true;
        if (this.src_content instanceof Blob) {

        } else if (typeof this.src_content == 'string' && this._isUrl(this.src_content)) {
            this._processURL(this.src_content);
        } else {
        }

    }
    _processURL(content) {
        this.docType = this.docType.toLowerCase() || '';
        let img_status = false;
        if (this.img_extensions.includes(this.docType)) { // triggerd if doc is image.
            this._img_pdf_urlParse(true, content);

        } else if (this.docType == 'pdf') {
            img_status = false;
            this._img_pdf_urlParse(false, content);
        }
        // else if (this.docType == 'docx') {
        //     this.error.emit("Viewing this file type is not supported.");
        //     return this.http.get(content, { responseType: 'blob' },).subscribe((res: any) => {
        //         this._wordHandler(res);
        //     });
        // } 
        else if (this.docType == 'html') {
            this._htmlHandler(content);
        }
        else {
            this.error.emit("Viewing this file type is not supported, Please Download the File.");
        }
    }
    /**
     * 
     * @param {Blob} content 
     */
    _wordHandler(content: Blob) {
        new Response(content).arrayBuffer().then(arr => {
            const doc = Scribe.read(arr, { type: "array" });
            let docviewer = this.renderer.createElement('iframe');
            docviewer.srcdoc = Scribe.utils.doc_to_html(doc);
            docviewer.style = "width:100%;height:100vh";
            docviewer.onload = function () {
                this.docLoader = false;
            }
            this.renderer.appendChild(this.view.nativeElement, docviewer);
            this.docLoader = false;
        });
    }

    _htmlHandler(content) {
        return new Promise((resolve, reject) => {
            this.http.get(content, {
                responseType: 'blob',
                headers: {
                    fsuuid: this.auth,
                    disableLoader: 'Y'
                }
            }).subscribe(res => {
                let x :any;
                x = res
                x.text().then(text =>{
                    let node = document.createElement('div');
                    node.innerHTML = text;
                    this.view.nativeElement.appendChild(node);
                    this.docLoader = false;
                })


            });
        });
    }
    /**
     * 
     * @param img_status if image it is set to true.
     * @param content url of image or pdf.
     */
    _img_pdf_urlParse(img_status, content) {

        return new Promise((resolve, reject) => {
            this.http.get(content, {
                responseType: 'blob',
                headers: {
                    fsuuid: this.auth,
                    disableLoader: 'Y'
                }
            }).subscribe(res => {
                let objectURL = URL.createObjectURL(res);
                if (objectURL != null) {

                    let docviewer: any = img_status ? this.renderer.createElement('img') : this.renderer.createElement('iframe');
                    this.docLoader = true;
                    docviewer.src = objectURL;
                    docviewer.style = "width:100%;height:100vh";
                    docviewer.onload = () => {
                        //console.log("asdfa");
                        this.docLoader = false;
                    }
                    this.renderer.appendChild(this.view.nativeElement, docviewer);
                }
            });
        });

        // let docviewer: any = img_status ? this.renderer.createElement('img') : this.renderer.createElement('iframe');
        // this.docLoader = true;
        // docviewer.src = content;
        // docviewer.style = "width:100%;height:100vh";
        // docviewer.onload = () => {
        //     console.log("asdfa");
        //     this.docLoader = false;
        // }
        // this.renderer.appendChild(this.view.nativeElement, docviewer);
        // this.docLoader = false;
    }


    _processBlob(blob) {
        let img_status;
        for (let extension in this.img_extensions) {
            if (blob.endsWith(extension)) {
                img_status = true;
                break;
            }
        }
        const reader: FileReader = new FileReader();
        reader.onload = (evt: any) => {
            let iframe = img_status ? this.renderer.createElement('img') : this.renderer.createElement('iframe');
            iframe.src = window.URL.createObjectURL(blob);
            this.renderer.appendChild(this.view.nativeElement, iframe);
        }
        reader.readAsDataURL(blob);
    }

    _isUrl(url) {
        try {
            return toString.call(url) === "[object String]" && !!(new URL(url));
        } catch (_) {
            return false;
        }
    }
}
