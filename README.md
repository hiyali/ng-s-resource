# ng-s-resource
🏌🏽 Simplify RESTful http resource generator for Angular 4+

[![npm package](https://img.shields.io/npm/v/ng-s-resource.svg)](https://npmjs.com/package/ng-s-resource)
[![NPM downloads](http://img.shields.io/npm/dm/ng-s-resource.svg)](https://npmjs.org/package/ng-s-resource)

## Quick look
```typescript
UserService = this._res.create('/api/user/:id') // 1. define
...
this.api.UserService.get({ params: { id : 5 } })... // 2. usage
/*
Also can use `...UserService. post | put | head | patch | delete`
*/
```

![Screen shot](https://raw.githubusercontent.com/hiyali/ng-s-resource/master/assets/nice-shot.png "screenshot")

## Install
```shell
yarn add ng-s-resource
```
or
```
npm i -S ng-s-resource
```

## Configuration
> _res.create(url, [options])
> Service.Sub([options])

| Name                 | Type            | Explain                                       |
| -------------------- | --------------- | --------------------------------------------- |
| url                  | `String`        | Api url, and you can use api/user/`:id`, and use dynamic params { id: 2 } for replace it |
| options[sub]         | `Object`        | Service children name                      |
| options[sub].params  | `Object`        | Resource params, like url params etc.         |
| options[sub].headers | `Object`        | Api headers, like { ...headers: { 'x-auth-token': '***' } } |
| options[sub].data    | `Object`        | Api data, just use in these methods `post`, `put`, `patch` |
| options[sub].method  | `String`        | Api method type, like `get`, `head`, `delete`, `post`, `put`, `patch` |

## Example
### Define
#### services/api.service.ts
```typescript
import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Resources } from 'ng-s-resource'

@Injectable()
export class ApiResources {
  _res: Resources
  constructor (private _http: Http) {
    this._res = new Resources(_http)
  }
  get PayService () { return this._res.create('/api/transaction/payInfo/:payReason') } // any method
  get LoginService() { return this._res.create('/api/user/customer/registerOrLogin/:uriName', {
    dynamicKey: { params: { uriName: 'finish' }, method: 'post' }, // just post
    requestKey: { params: { uriName: 'request'} } // any method
  }) }
}
```

### Usage
#### pages/app.component.ts
```typescript
import { API } from '../services'
...
@Component(...)
export class AppComponent {
  constructor (private api: API) {}

  someMethod () {
    const payReason = 'yo'

    // get
    this.api.PayService.get({ params: { payReason }}).subscribe(res => {
      console.log(res)
    })

    // post
    this.api.LoginService.dynamicKey({ data: { payReason }, headers: { 'token': 'asdf' }}).subscribe(res => {
      console.log(res)
    })
  }
}
```

### Required things
#### app.module.ts
```typescript
import { HttpModule } from '@angular/http'
import { AppServices } from '../services'
...
@NgModule({
  ...
  imports: [
    HttpModule
  ],
  providers: [
    AppServices
  ]
  ...
})
```

#### services/index.ts
```typescript
import { ApiResources as API } from './api.service'

export { API }
export const AppServices = [
  API
]
```

## Any problem?

> Please let me know.
* [Open a new issue for this repo](https://github.com/hiyali/ng-s-resource/issues)
* [Send a Email to: hiyali920@gmail.com](mailto:hiyali920@gmail.com)

## Is it useful?

🌚 [Donate a github star ⍟](https://github.com/hiyali/ng-s-resource)

## License

MIT
