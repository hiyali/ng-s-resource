import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
export interface ApiDatableOptions {
    headers: any | null;
    params: any | null;
    data: any | null;
}
export interface ApiOptions {
    headers: any | null;
    params: any | null;
}
export declare class ResourceCreator {
    url: string;
    private options;
    private http;
    constructor(url: string, options: any, http: Http);
    getUrl(runtimeOptions?: any): string;
    getMergedOptions(runtimeOptions?: any): any;
    getSafeParams(runtimeOptions?: any): RequestOptions;
    head(options: ApiOptions | null): Observable<any>;
    get(options: ApiOptions | null): Observable<any>;
    delete(options: ApiOptions | null): Observable<any>;
    post(options: ApiDatableOptions | null): Observable<any>;
    put(options: ApiDatableOptions | null): Observable<any>;
    patch(options: ApiDatableOptions | null): Observable<any>;
}
