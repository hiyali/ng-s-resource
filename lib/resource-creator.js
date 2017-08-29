"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var createOptions = function (options) {
    if (options === void 0) { options = null; }
    if (!options) {
        return null;
    }
    // params
    var _options = new http_1.RequestOptions();
    _options.params = options.params;
    // headers
    if (options.headers) {
        // _options.headers = new Headers(options.headers)
        _options.headers = options.headers;
    }
    return _options;
};
var ResourceCreator = (function () {
    function ResourceCreator(url, options, http) {
        this.url = url;
        this.options = options;
        this.http = http;
        this.options = options || {};
        // console.info('Create resource for url', url, options)
    }
    ResourceCreator.prototype.getUrl = function (runtimeOptions) {
        if (runtimeOptions === void 0) { runtimeOptions = null; }
        if (!runtimeOptions) {
            runtimeOptions = {};
        }
        var params = runtimeOptions.params || {};
        var url = this.url;
        while (true) {
            var reg = new RegExp(/\:(\w*)?/g); // params in the url like :name
            var matched = reg.exec(url);
            if (!matched)
                break;
            var uriName = matched[1];
            var replaceWith = params[uriName] ? params[uriName] : '';
            url = url.replace(matched[0], replaceWith);
        }
        return url;
    };
    ResourceCreator.prototype.getMergedOptions = function (runtimeOptions) {
        if (runtimeOptions === void 0) { runtimeOptions = null; }
        if (!runtimeOptions) {
            return JSON.parse(JSON.stringify(this.options));
        }
        var headers = null;
        var params = null;
        var data = null;
        if (this.options['headers'] || runtimeOptions.headers) {
            headers = __assign({}, this.options['headers'], runtimeOptions.headers);
        }
        if (this.options.params || runtimeOptions.params) {
            params = __assign({}, this.options.params, runtimeOptions.params);
        }
        if (this.options['data'] || runtimeOptions.data) {
            data = __assign({}, this.options['data'], runtimeOptions.data);
        }
        return {
            headers: headers,
            params: params,
            data: data
        };
    };
    ResourceCreator.prototype.getSafeParams = function (runtimeOptions) {
        if (runtimeOptions === void 0) { runtimeOptions = null; }
        if (!runtimeOptions) {
            return null;
        }
        var runtimeParams = runtimeOptions.params || {};
        var _params = JSON.parse(JSON.stringify(runtimeParams));
        var url = this.url;
        while (true) {
            var reg = new RegExp(/\:(\w*)?/g); // params in the url like :name
            var matched = reg.exec(url);
            if (!matched)
                break;
            var uriName = matched[1];
            var replaceWith = runtimeParams[uriName] ? runtimeParams[uriName] : '';
            url = url.replace(matched[0], replaceWith);
            if (matched[0].indexOf(':') === 0) {
                var uriName_1 = matched[1];
                delete _params[uriName_1]; // delete a child that like this :uriName from params
            }
        }
        runtimeOptions.params = _params;
        return createOptions(runtimeOptions);
    };
    ResourceCreator.prototype.head = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.head(this.getUrl(_options), this.getSafeParams(_options));
    };
    ResourceCreator.prototype.get = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.get(this.getUrl(_options), this.getSafeParams(_options));
    };
    ResourceCreator.prototype.delete = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.delete(this.getUrl(_options), this.getSafeParams(_options));
    };
    /*
    jsonp(options: ApiOptions | null): Observable<any> {
      const _options = this.getMergedOptions(options)
      return this.http.jsonp(this.getUrl(_options), this.getSafeParams(_options))
    }
    // */
    ResourceCreator.prototype.post = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.post(this.getUrl(_options), _options.data, this.getSafeParams(_options));
    };
    ResourceCreator.prototype.put = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.put(this.getUrl(_options), _options.data, this.getSafeParams(_options));
    };
    ResourceCreator.prototype.patch = function (options) {
        var _options = this.getMergedOptions(options);
        return this.http.patch(this.getUrl(_options), _options.data, this.getSafeParams(_options));
    };
    return ResourceCreator;
}());
exports.ResourceCreator = ResourceCreator;
//# sourceMappingURL=resource-creator.js.map