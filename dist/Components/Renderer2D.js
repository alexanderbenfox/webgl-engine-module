"use strict";
//Renderer2D
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
var EngineUtility_1 = require("../EngineUtility");
var Matrix_1 = require("../Matrix");
var Component_1 = require("./Component");
var Renderer2D = /** @class */ (function (_super) {
    __extends(Renderer2D, _super);
    function Renderer2D() {
        return _super.call(this) || this;
    }
    Renderer2D.prototype.init = function (surface) {
        _super.prototype.init.call(this, surface);
    };
    Renderer2D.prototype.init_renderer = function (surface, camera) {
        this.init(surface);
        this.gameObject.renderer = this;
        this._surface = surface;
        this._vertexBuffer = surface.gl.createBuffer();
        this._colorBuffer = surface.gl.createBuffer();
        this.camera = camera;
        this._initialized = true;
    };
    Renderer2D.prototype.blit = function () { };
    Renderer2D.prototype.update = function (dt) {
        var x = this.gameObject.transform.position.x - this.size.x / 2;
        var y = this.gameObject.transform.position.y - this.size.y / 2;
        var z = this.gameObject.transform.position.z - this.size.z / 2;
        this.renderPoint = new EngineUtility_1.Vector3(x, y, z);
    };
    return Renderer2D;
}(Component_1.Renderer));
exports.Renderer2D = Renderer2D;
var LineRenderer = /** @class */ (function (_super) {
    __extends(LineRenderer, _super);
    function LineRenderer() {
        return _super.call(this) || this;
    }
    LineRenderer.prototype.init_line_renderer = function (camera, surface, startCoord, endCoord, width) {
        _super.prototype.init_renderer.call(this, surface, camera);
        this.size = new EngineUtility_1.Vector3(Math.abs(endCoord.x - startCoord.x), Math.abs(endCoord.y - endCoord.y), 0);
        this._points = new Float32Array([
            startCoord.x, startCoord.y, endCoord.x, startCoord.y,
            startCoord.x, endCoord.y, startCoord.x, endCoord.y,
            endCoord.x, startCoord.y, endCoord.x, endCoord.y
        ]);
        this._width = width;
    };
    LineRenderer.prototype.blit = function () {
        var surface = this._surface;
        //rendering context
        var gl = this._surface.gl;
        var program = this._surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.attributes.position;
        var vertexTexture = surface.locations.attributes.texture;
        var vertexColor = surface.locations.attributes.color;
        var matrixLocation = surface.locations.uniforms.matrix;
        var matrix = surface.getMatrix();
        //gl.disableVertexAttribArray(vertexTexture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._points, gl.STATIC_DRAW);
        // void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        /*var colors = [
        1.0, 1.0, 1.0, 1.0,//white
        1.0, 0.0, 0.0, 0.0,//red
        0.0, 1.0, 0.0, 0.0,//green
        0.0, 0.0, 1.0, 0.0];//blue*/
        var colors = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexColor, 2, gl.FLOAT, false, 0, 0);
        var n_matrix = new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(matrix));
        gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
        gl.lineWidth(this._width);
        gl.drawArrays(gl.LINES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return LineRenderer;
}(Renderer2D));
exports.LineRenderer = LineRenderer;
var SquareRenderer = /** @class */ (function (_super) {
    __extends(SquareRenderer, _super);
    function SquareRenderer() {
        return _super.call(this) || this;
    }
    SquareRenderer.prototype.init_square_renderer = function (camera, surface, startCoord, endCoord, width) {
        _super.prototype.init_renderer.call(this, surface, camera);
        this.size = new EngineUtility_1.Vector3(Math.abs(endCoord.x - startCoord.x), Math.abs(endCoord.y - endCoord.y), 0);
        this._points = new Float32Array([
            startCoord.x, startCoord.y, endCoord.x, startCoord.y,
            startCoord.x, endCoord.y, startCoord.x, endCoord.y,
            endCoord.x, startCoord.y, endCoord.x, endCoord.y
        ]);
        this._width = width;
    };
    SquareRenderer.prototype.blit = function () {
        var surface = this._surface;
        var gl = this._surface.gl;
        var program = this._surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.attributes.position;
        var vertexColor = surface.locations.attributes.color;
        var matrixLocation = surface.locations.uniforms.matrix;
        var matrix = surface.getMatrix();
        //gl.disableVertexAttribArray(vertexTexture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._points, gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        /*var colors = [
        1.0, 1.0, 1.0, 1.0,//white
        1.0, 0.0, 0.0, 0.0,//red
        0.0, 1.0, 0.0, 0.0,//green
        0.0, 0.0, 1.0, 0.0];//blue*/
        var colors = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexColor, 1, gl.FLOAT, false, 0, 0);
        var n_matrix = new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(matrix));
        gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
        //gl.lineWidth(this.width);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return SquareRenderer;
}(Renderer2D));
exports.SquareRenderer = SquareRenderer;
