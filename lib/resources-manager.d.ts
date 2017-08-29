import { Http } from '@angular/http';
import { ResourceCreator as ACS } from './resource-creator';
export declare class ResourcesManager {
    http: Http;
    ResourceInstances: Map<string, ACS>;
    constructor(_http: Http);
    init(_service: any): void;
    create(url: string, serviceOptions?: any | null): any | ACS;
}
