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
///<reference path = "./Surface.ts"/>
var Matrix_1 = require("./Matrix");
var Shape = /** @class */ (function () {
    function Shape(surface, startCoord, endCoord, width) {
        this._surface = surface;
        this._vertexBuffer = surface.gl.createBuffer();
        this._colorBuffer = surface.gl.createBuffer();
        this._points = new Float32Array([
            startCoord.x, startCoord.y, endCoord.x, startCoord.y,
            startCoord.x, endCoord.y, startCoord.x, endCoord.y,
            endCoord.x, startCoord.y, endCoord.x, endCoord.y
        ]);
        this._width = width;
    }
    Shape.prototype.blit = function () { };
    return Shape;
}());
exports.Shape = Shape;
var Stroke = /** @class */ (function (_super) {
    __extends(Stroke, _super);
    function Stroke(surface, startCoord, endCoord, width) {
        return _super.call(this, surface, startCoord, endCoord, width) || this;
    }
    Stroke.prototype.blit = function () {
        var surface = this._surface;
        //rendering context
        var gl = this._surface.gl;
        var program = this._surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.position;
        var vertexColor = surface.locations.texture;
        var matrixLocation = surface.locations.matrix;
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
    return Stroke;
}(Shape));
exports.Stroke = Stroke;
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(surface, startCoord, endCoord, width) {
        return _super.call(this, surface, startCoord, endCoord, width) || this;
    }
    Square.prototype.blit = function () {
        var surface = this._surface;
        var gl = this._surface.gl;
        var program = this._surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.position;
        var vertexColor = surface.locations.texture;
        var matrixLocation = surface.locations.matrix;
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
    return Square;
}(Shape));
exports.Square = Square;
