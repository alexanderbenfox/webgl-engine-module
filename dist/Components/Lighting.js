"use strict";
//references: Phong Shading
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Light = /** @class */ (function () {
    function Light(surface) {
        this.surface = surface;
    }
    return Light;
}());
exports.Light = Light;
var DirectionalLight = /** @class */ (function (_super) {
    __extends(DirectionalLight, _super);
    function DirectionalLight(surface, rotation) {
        var _this = _super.call(this, surface) || this;
        _this.rotation = rotation;
        _this.initRender();
        return _this;
    }
    DirectionalLight.prototype.initRender = function () {
        this.surface.gl.useProgram(this.surface.locations.program);
        this.surface.gl.uniform3f(this.surface.locations.uniforms.light_direction, this.rotation.x, this.rotation.y, this.rotation.z);
    };
    return DirectionalLight;
}(Light));
exports.DirectionalLight = DirectionalLight;
