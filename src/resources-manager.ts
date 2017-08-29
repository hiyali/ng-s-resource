import { Injectable, Injector } from '@angular/core'
import { Http } from '@angular/http'

import { ResourceCreator as ACS } from './resource-creator'

@Injectable()
export class ResourcesManager {
  http: Http
  ResourceInstances: Map<string, ACS>

  constructor (
    _http: Http
  ) {
    this.http = _http
    this.ResourceInstances = new Map()
  }

  init(_service: any) {
    for (let prop in _service.Config) {
      const _resource = _service.Config[prop]

      if (typeof _resource === 'string') {
        Object.defineProperty(_service, prop, { get: () => this.create(_resource) })
      } else {
        Object.defineProperty(_service, prop, { get: () => this.create(_resource.url, _resource.options) })
      }
    }
  }

  create(url:string, serviceOptions: any | null = null): any | ACS {
    // Get a API resource or resource bucket base on a url
    // console.info('Get resource for url', url, serviceOptions)
    if (!serviceOptions) {
      if (this.ResourceInstances.has(url)) {
        return this.ResourceInstances.get(url)
      }

      const inst = new ACS(url, null, this.http)
      this.ResourceInstances.set(url, inst)
      return inst
    }

    const resourceBucket = {}
    for (let propName in serviceOptions) {
      let _inst
      if (this.ResourceInstances.has(url + propName)) {
        _inst = this.ResourceInstances.get(url + propName)
      } else {
        _inst = new ACS(url, serviceOptions[propName], this.http)
        this.ResourceInstances.set(url + propName, _inst)
      }

      const method = serviceOptions[propName].method
      if (method) {
        resourceBucket[propName] = _inst[method.toLowerCase()].bind(_inst)
      } else {
        resourceBucket[propName] = _inst
      }
    }
    return resourceBucket
  }
}
