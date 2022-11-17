import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SDBaseService {

    constructor(private http: HttpClient) {

    }
    operators = {
        'eq': function (a, b, c, d) { return a == b; },
        'se': function (a, b, c, d) { return a === b; },
        'neq': function (a, b, c, d) { return a != b; },
        'sne': function (a, b, c, d) { return a !== b; },
        'lt': function (a, b, c, d) { return a < b; },
        'lte': function (a, b, c, d) { return a <= b; },
        'gt': function (a, b, c, d) { return a > b; },
        'gte': function (a, b, c, d) { return a >= b; },
        'btwn': function (a, b, c, d) { return a >= b && a <= c; },
        'cont': function (a, b, c, d) { return (a + "").indexOf(b) != -1; },
        'regex': function (a, b, c, d) { return (a + "").match(new RegExp(b, d ? 'i' : '')); },
        'true': function (a, b, c, d) { return a === true; },
        'false': function (a, b, c, d) { return a === false; },
        'null': function (a, b, c, d) { return (typeof a == "undefined" || a === null); },
        'nnull': function (a, b, c, d) { return (typeof a != "undefined" && a !== null); },
        'empty': function (a, b, c, d) {
            if (typeof a === 'string' || Array.isArray(a)) {
                return a.length === 0;
            } else if (typeof a === 'object' && a !== null) {
                return Object.keys(a).length === 0;
            }
            return false;
        },
        'nempty': function (a, b, c, d) {
            if (typeof a === 'string' || Array.isArray(a)) {
                return a.length !== 0;
            } else if (typeof a === 'object' && a !== null) {
                return Object.keys(a).length !== 0;
            }
            return false;
        },

        'istype': function (a, b, c, d) {
            if (b === "array") { return Array.isArray(a); }
            else if (b === "json") {
                try { JSON.parse(a); return true; }   // or maybe ??? a !== null; }
                catch (e) { return false; }
            }
            else if (b === "null") { return a === null; }
            else { return typeof a === b && !Array.isArray(a) && a !== null; }
        },
        /* 'head': function (a, b, c, d, parts) {
            var count = Number(b);
            return (parts.index < count);
        },
        'tail': function (a, b, c, d, parts) {
            var count = Number(b);
            return (parts.count - count <= parts.index);
        },
        'index': function (a, b, c, d, parts) {
            var min = Number(b);
            var max = Number(c);
            var index = parts.index;
            return ((min <= index) && (index <= max));
        },
        'jsonata_exp': function (a, b, c, d) { return (b === true); }, */
        'else': function (a, b, c, d) { return a === true; }
    };

    getPathAndQParamsObj(urlWithSearchParams) {
        const paramsObj = {};
        const qparams = urlWithSearchParams.split('?')[1];
        if (qparams) {
            const qkv = qparams.split('&');
            if (qkv) {
                qkv.map((qparamsPair) => qparamsPair.split('=')).forEach(v => paramsObj[v[0]] = v[1]);
            }
        }
        return { paramObj: paramsObj, path: urlWithSearchParams.split('?')[0] };
    }

    formatPathWithParams(path: string, pathparams) {
        Object.keys(pathparams || {}).forEach((pathparamKey) => {
            let value = pathparams[pathparamKey];
            value = value ? ((typeof value === 'object') ? JSON.stringify(value) : value) : `:${pathparamKey}`;
            path = path.replace(`:${pathparamKey}`, value);
        });
        return path;
    }

    __formatHeaders(headersObj) {
        let headers = new HttpHeaders();
        if (typeof headersObj === 'object') {
            Object.entries(headersObj).forEach((p: Array<any>) => {
                let value = p[1];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                headers = headers.set(p[0], value);
            });
        }
        return headers;
    }

    __formatParams(paramsObj) {
        let params = new HttpParams();
        if (typeof paramsObj === 'object') {
            Object.entries(paramsObj).forEach((p: Array<any>) => {
                let value = p[1];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                params = params.set(p[0], value);
            });
        }
        return params;
    }

    nHttpRequest(requestOptions) {
        return new Promise((resolve, reject) => {
            const responseType = requestOptions.responseType || undefined;
            const reportProgress = requestOptions.reportProgress || false;

            const headers = this.__formatHeaders(requestOptions.headers);
            const params = this.__formatParams(requestOptions.params);

            const options = { headers: headers, params: params, responseType: responseType, reportProgress: reportProgress };
            // console.log(options);
            this.http.request(requestOptions.method, requestOptions.url, { body: requestOptions.body, ...options }).subscribe(result => {
                return resolve(result);
            }, error => {
                return reject(error);
            });
        });
    }
}
