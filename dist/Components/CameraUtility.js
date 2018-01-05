"use strict";
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
require("sylvester");
var EngineUtility_1 = require("../EngineUtility");
var gl_matrix_1 = require("gl-matrix");
var Component_1 = require("./Component");
var CameraUtility;
(function (CameraUtility) {
    function makeFrustrum(left, right, bottom, top, znear, zfar) {
        var X = 2 * znear / (right - left);
        var Y = 2 * znear / (top - bottom);
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(zfar + znear) / (zfar - znear);
        var D = -2 * zfar * znear / (zfar - znear);
        return Matrix.create([[X, 0, A, 0],
            [0, Y, B, 0],
            [0, 0, C, D],
            [0, 0, -1, 0]]);
    }
    CameraUtility.makeFrustrum = makeFrustrum;
    function makePerspective(fovy, aspect, znear, zfar) {
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;
        return makeFrustrum(xmin, xmax, ymin, ymax, znear, zfar);
    }
    CameraUtility.makePerspective = makePerspective;
    function makeOrtho(left, right, bottom, top, znear, zfar) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(zfar + znear) / (zfar - znear);
        return Matrix.create([[2 / (right - left), 0, 0, tx],
            [0, 2 / (top - bottom), 0, ty],
            [0, 0, -2 / (zfar - znear), tz],
            [0, 0, 0, 1]]);
    }
    CameraUtility.makeOrtho = makeOrtho;
})(CameraUtility || (CameraUtility = {}));
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this._time = 0;
        //main matrix that carries all of the data
        _this.projectionMatrix = gl_matrix_1.mat4.create();
        //combination of view & projection
        _this.viewProjectionMatrix = gl_matrix_1.mat4.create();
        return _this;
    }
    Camera.prototype.init = function (gl) {
        var fieldOfView = 45 * Math.PI / 180; //radians
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        gl_matrix_1.mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);
        this.gameObject.transform.position = new EngineUtility_1.Vector3(0, 0, 0);
        this.gameObject.transform.rotation = new EngineUtility_1.Vector3(0, 0, 0);
        this.updateMatrix();
    };
    Camera.prototype.update = function (degree) {
        var radians = (degree / 360) * 360 * Math.PI / 180;
        console.log(radians);
        this.gameObject.transform.rotation = new EngineUtility_1.Vector3(0, radians, 0);
        this.updateMatrix();
        //this.updateMatrixLookAt(lookAt);
    };
    Camera.prototype.updatePosition = function (deltaMovement) {
        this.gameObject.transform.position = this.gameObject.transform.position.add(deltaMovement);
        this.updateMatrix();
    };
    Camera.prototype.updateMatrix = function () {
        //this matrix represents the position and orientation of the camera in the world
        var cameraMatrix = gl_matrix_1.mat4.create();
        EngineUtility_1.computeMatrix(cameraMatrix, cameraMatrix, this.pos, this.rot);
        //view matrix moves everything opposite to the camera - making it as though cam is at origin
        var viewMatrix = gl_matrix_1.mat4.create();
        viewMatrix = gl_matrix_1.mat4.invert(viewMatrix, cameraMatrix);
        this.viewProjectionMatrix = gl_matrix_1.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, viewMatrix);
    };
    Camera.prototype.updateMatrixLookAt = function (lookAt) {
        var cameraMatrix = gl_matrix_1.mat4.create();
        EngineUtility_1.computeMatrix(cameraMatrix, cameraMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);
        var cameraPosition = new EngineUtility_1.Vector3(cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]);
        var up = new EngineUtility_1.Vector3(0, 1, 0);
        cameraMatrix = this.lookAt(cameraPosition, lookAt.transform.position, up);
        var viewMatrix = gl_matrix_1.mat4.create();
        viewMatrix = gl_matrix_1.mat4.invert(viewMatrix, cameraMatrix);
        this.viewProjectionMatrix = gl_matrix_1.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, viewMatrix);
    };
    Camera.prototype.lookAt = function (cameraPosition, targetPosition, up) {
        var zAxis = cameraPosition.sub(targetPosition).normalize();
        var xAxis = up.cross(zAxis);
        var yAxis = zAxis.cross(xAxis);
        return [
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, zAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            cameraPosition.x, cameraPosition.y, cameraPosition.z, 1
        ];
    };
    return Camera;
}(Component_1.Component));
exports.Camera = Camera;
