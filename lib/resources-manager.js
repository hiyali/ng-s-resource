"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var resource_creator_1 = require("./resource-creator");
var ResourcesManager = (function () {
    function ResourcesManager(_http) {
        this.http = _http;
        this.ResourceInstances = new Map();
    }
    ResourcesManager.prototype.init = function (_service) {
        var _this = this;
        var _loop_1 = function (prop) {
            var _resource = _service.Config[prop];
            if (typeof _resource === 'string') {
                Object.defineProperty(_service, prop, { get: function () { return _this.create(_resource); } });
            }
            else {
                Object.defineProperty(_service, prop, { get: function () { return _this.create(_resource.url, _resource.options); } });
            }
        };
        for (var prop in _service.Config) {
            _loop_1(prop);
        }
    };
    ResourcesManager.prototype.create = function (url, serviceOptions) {
        if (serviceOptions === void 0) { serviceOptions = null; }
        // Get a API resource or resource bucket base on a url
        // console.info('Get resource for url', url, serviceOptions)
        if (!serviceOptions) {
            if (this.ResourceInstances.has(url)) {
                return this.ResourceInstances.get(url);
            }
            var inst = new resource_creator_1.ResourceCreator(url, null, this.http);
            this.ResourceInstances.set(url, inst);
            return inst;
        }
        var resourceBucket = {};
        for (var propName in serviceOptions) {
            var _inst = void 0;
            if (this.ResourceInstances.has(url + propName)) {
                _inst = this.ResourceInstances.get(url + propName);
            }
            else {
                _inst = new resource_creator_1.ResourceCreator(url, serviceOptions[propName], this.http);
                this.ResourceInstances.set(url + propName, _inst);
            }
            var method = serviceOptions[propName].method;
            if (method) {
                resourceBucket[propName] = _inst[method.toLowerCase()].bind(_inst);
            }
            else {
                resourceBucket[propName] = _inst;
            }
        }
        return resourceBucket;
    };
    ResourcesManager = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ResourcesManager);
    return ResourcesManager;
}());
exports.ResourcesManager = ResourcesManager;
//# sourceMappingURL=resources-manager.js.map