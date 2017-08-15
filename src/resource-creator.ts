import { Http, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'

export interface ApiDatableOptions {
  params: any | null // get method query, 做成替换 url 里的 {/id} 字符的形式
  data: any | null
}
export interface ApiOptions {
  params: any | null
}

export class ResourceCreator {
  constructor (
    public url: string,
    private options: any,
    private http: Http
  ) {
    this.options = options || {}
    console.info('Create resource for url', url, options)
  }

  // + data.payReason
  getUrl(runtimeParams: any = null) {
    let url = this.url
    const params = runtimeParams || {}

    while (true) {
      const reg = new RegExp(/{\/\:?(\w*)}?/g) //    \/? {/name} 斜杠必须得有，并且在花括号里
      const matched = reg.exec(url)
      if (!matched) break

      const uriName = matched[1]
      const replaceWith = params[uriName] ? '/' + params[uriName] : ''
      url = url.replace(matched[0], replaceWith)
    }
    return url
  }

  getMergedOptions(runtimeOptions: any = null) {
    if (!runtimeOptions) {
      return JSON.parse(JSON.stringify(this.options))
    }

    let params = null
    let data = null
    if (this.options.params || runtimeOptions.params) {
      params = { ...this.options.params, ...runtimeOptions.params }
    }
    if (this.options['data'] || runtimeOptions.data) {
      data = { ...this.options['data'], ...runtimeOptions.data }
    }

    return {
      params,
      data
    }
  }

  getSafeParams(runtimeParams: any = null) {
    if (!runtimeParams) {
      return null
    }

    const _params = JSON.parse(JSON.stringify(runtimeParams))
    let url = this.url

    while (true) {
      const reg = new RegExp(/{\/\:?(\w*)}?/g) //    \/? {/name} 斜杠必须得有，并且在花括号里
      const matched = reg.exec(url)
      if (!matched) break

      const uriName = matched[1]
      const replaceWith = runtimeParams[uriName] ? '/' + runtimeParams[uriName] : ''
      url = url.replace(matched[0], replaceWith)

      if (matched[0].indexOf('/:') === 1) {
        const uriName = matched[1]
        delete _params[uriName] // delete a child that like this {/:uriName} from params
      }
    }

    const _options = new RequestOptions()
    _options.params = _params
    return _options
  }

  get(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.get(this.getUrl(_options.params), this.getSafeParams(_options.params))
  }

  post(options: ApiDatableOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.post(this.getUrl(_options.params), _options.data, this.getSafeParams(_options.params))
  }

  put(options: ApiDatableOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.put(this.getUrl(_options.params), _options.data, this.getSafeParams(_options.params))
  }

  delete(options: ApiOptions | null): Observable<any> {
    const _options = this.getMergedOptions(options)
    return this.http.delete(this.getUrl(_options.params), this.getSafeParams(_options.params))
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
