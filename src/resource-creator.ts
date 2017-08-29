import { Http, RequestOptions, Headers } from '@angular/http'
import { Observable } from 'rxjs/Observable'

const createOptions = (options: any = null) => {
  if (!options) {
    return null
  }
  // params
  const _options = new RequestOptions()
  _options.params = options.params

  // headers
  if (options.headers) {
    // _options.headers = new Headers(options.headers)
    _options.headers = options.headers
  }

  return _options
}

export interface ApiDatableOptions {
  headers: any | null
  params: any | null
  data: any | null
}
export interface ApiOptions {
  headers: any | null
  params: any | null
}

export class ResourceCreator {
  constructor (
    public url: string,
    private options: any,
    private http: Http
  ) {
    this.options = options || {}
    // console.info('Create resource for url', url, options)
  }

  getUrl(runtimeOptions: any = null) {
    if (!runtimeOptions) {
      runtimeOptions = {}
    }

    const params = runtimeOptions.params || {}
    let url = this.url

    while (true) {
      const reg = new RegExp(/\:(\w*)?/g) // params in the url like :name
      const matched = reg.exec(url)
      if (!matched) break

      const uriName = matched[1]
      const replaceWith = params[uriName] ? params[uriName] : ''
      url = url.replace(matched[0], replaceWith)
    }
    return url
  }

  getMergedOptions(runtimeOptions: any = null) {
    if (!runtimeOptions) {
      return JSON.parse(JSON.stringify(this.options))
    }

    let headers = null
    let params = null
    let data = null

    if (this.options['headers'] || runtimeOptions.headers) {
      headers = { ...this.options['headers'], ...runtimeOptions.headers }
    }
    if (this.options.params || runtimeOptions.params) {
      params = { ...this.options.params, ...runtimeOptions.params }
    }
    if (this.options['data'] || runtimeOptions.data) {
      data = { ...this.options['data'], ...runtimeOptions.data }
    }

    return {
      headers,
      params,
      data
    }
  }

  getSafeParams(runtimeOptions: any = null) {
    if (!runtimeOptions) {
      return null
    }
    const runtimeParams = runtimeOptions.params || {}

    const _params = JSON.parse(JSON.stringify(runtimeParams))
    let url = this.url

    while (true) {
      const reg = new RegExp(/\:(\w*)?/g) // params in the url like :name
      const matched = reg.exec(url)
      if (!matched) break

      const uriName = matched[1]
      const replaceWith = runtimeParams[uriName] ? runtimeParams[uriName] : ''
      url = url.replace(matched[0], replaceWith)

      if (matched[0].indexOf(':') === 0) {
        const uriName = matched[1]
        delete _params[uriName] // delete a child that like this :uriName from params
      }
    }

    runtimeOptions.params = _params
    return createOptions(runtimeOptions)
  }

  head(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.head(this.getUrl(_options), this.getSafeParams(_options))
  }

  get(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.get(this.getUrl(_options), this.getSafeParams(_options))
  }

  delete(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.delete(this.getUrl(_options), this.getSafeParams(_options))
  }

  /*
  jsonp(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.jsonp(this.getUrl(_options), this.getSafeParams(_options))
  }
  // */

  post(options: ApiDatableOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.post(this.getUrl(_options), _options.data, this.getSafeParams(_options))
  }

  put(options: ApiDatableOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.put(this.getUrl(_options), _options.data, this.getSafeParams(_options))
  }

  patch(options: ApiDatableOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.patch(this.getUrl(_options), _options.data, this.getSafeParams(_options))
  }

  /*
  url	string	请求的URL
  method	string	请求的HTTP方法，例如：'GET', 'POST'或其他HTTP方法
  body	Object, FormData string	request body
  params	Object	请求的URL参数对象
  headers	Object	request header
  timeout	number	单位为毫秒的请求超时时间 (0 表示无超时时间)
  before	function(request)	请求发送前的处理函数，类似于jQuery的beforeSend函数
  progress	function(event)	ProgressEvent回调处理函数
  credentials	boolean	表示跨域请求时是否需要使用凭证
  emulateHTTP	boolean	发送PUT, PATCH, DELETE请求时以HTTP POST的方式发送，并设置请求头的X-HTTP-Method-Override
  emulateJSON boolean	将request body以application/x-www-form-urlencoded content type发送
   */

  /*
  get(url, [options])
  head(url, [options])
  delete(url, [options])
  jsonp(url, [options])
  post(url, [body], [options])
  put(url, [body], [options])
  patch(url, [body], [options])
    */
}

