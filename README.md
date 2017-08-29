# ng-s-resource
Simple resource generator for Angular (version >= 2)

## Quick look
```typescript
PayService = this._res.create('/api/transaction/payInfo/:payReason') // 1. define
...
this.api.PayService.get(...)... // 2. usage
```

## Configuration
> _res.create(url, [options])

| Name                 | Type            | Explain                                       |
| -------------------- | --------------- | --------------------------------------------- |
| url                  | `String`        | Api url, and you can use api/user/`:id`, and use dynamic params { id: 2 } for replace it |
| options[sub]         | `Object`|`null` | Resource options                              |
| options[sub].params  | `Object`        | Resource params, like url params etc.         | 
| options[sub].headers | `Object`        | Api headers, like { ...headers: { 'x-auth-token': '***' } } |
| options[sub].data    | `Object`        | Api data, just use in these methods `post`, `put`, `patch` |
| options[sub].method  | `String`        | Api method type, like `get`, `head`, `delete`, `post`, `put`, `patch` |

> [sub] is your Service children name.

## Example
### Define
#### service/api.service.ts
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
  get PayService () { return this._res.create('/api/transaction/payInfo/:payReason') }
  get LoginService() { return this._res.create('/api/user/customer/registerOrLogin/:uriName', {
    dynamicKey: { params: { uriName: 'finish' }, method: 'post' },
    requestKey: { params: { uriName: 'request'} }
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

    this.api.PayService.get({ params: { payReason }}).subscribe(res => {
      console.log(res)
    })
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
import { Services } from '../services'
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
import { Resources } from 'ng-s-resource'
import { ApiResources as API } from './api.service'

export { API }
export const Services = [
  API,
  Resources
]
```
