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
var EngineUtility_1 = require("./EngineUtility");
var Matrix_1 = require("./Matrix");
var gl_matrix_1 = require("gl-matrix");
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
var Shape3D = /** @class */ (function () {
    function Shape3D(surface) {
        this.surface = surface;
        this._vertexBuffer = surface.gl.createBuffer();
        this._colorBuffer = surface.gl.createBuffer();
    }
    Shape3D.prototype.blit = function () { };
    Shape3D.prototype.update = function (dt) { };
    return Shape3D;
}());
exports.Shape3D = Shape3D;
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube(surface) {
        var _this = _super.call(this, surface) || this;
        _this.rotation = 0;
        var gl = _this.surface.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, _this._vertexBuffer);
        //4 verticies per side, 24 verticies in total
        var vertexPositions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];
        _this.positions = new Float32Array(vertexPositions);
        gl.bufferData(gl.ARRAY_BUFFER, _this.positions, gl.STATIC_DRAW);
        var white_color = [1.0, 1.0, 1.0, 1.0];
        //6 faces
        var faceColors = [white_color, white_color, white_color, white_color, white_color, white_color];
        var colors = [];
        for (var i = 0; i < faceColors.length; ++i) {
            var c = faceColors[i];
            colors = colors.concat(c, c, c, c);
        }
        _this.colors = new Float32Array(colors);
        _this._colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _this.colors, gl.STATIC_DRAW);
        _this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _this._indexBuffer);
        var indicies = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];
        _this.indicies = new Uint16Array(indicies);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _this.indicies, gl.STATIC_DRAW);
        return _this;
    }
    Cube.prototype.blit = function () {
        var surface = this.surface;
        var gl = this.surface.gl;
        var program = this.surface.locations.program;
        //stuff for camera??
        var fieldOfView = 45 * Math.PI / 180; //radians
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        //drawing position
        var modelViewMatrix = gl_matrix_1.mat4.create();
        this.moveCube(modelViewMatrix);
        this.assignAttrib(this._vertexBuffer, this.surface.locations.position, 3);
        this.assignAttrib(this._colorBuffer, this.surface.locations.texture, 4);
        this.bindIndexToVerts();
        gl.useProgram(program);
        gl.uniformMatrix4fv(surface.locations.projection, false, projectionMatrix);
        gl.uniformMatrix4fv(surface.locations.matrix, false, modelViewMatrix);
        var vertexCount = 36;
        var type = gl.UNSIGNED_SHORT;
        var offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    };
    Cube.prototype.moveCube = function (modelViewMatrix) {
        var moveVector = new EngineUtility_1.Vector3(0, 0, -6);
        var zAxis = new EngineUtility_1.Vector3(0, 0, 1);
        var yAxis = new EngineUtility_1.Vector3(0, 1, 0);
        gl_matrix_1.mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        moveVector.toArray()); // amount to translate
        gl_matrix_1.mat4.rotate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        this.rotation, // amount to rotate in radians
        zAxis.toArray()); // axis to rotate around (Z)
        gl_matrix_1.mat4.rotate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        this.rotation * .7, // amount to rotate in radians
        yAxis.toArray()); // axis to rotate around (X)
    };
    Cube.prototype.assignAttrib = function (buffer, attribLocation, components) {
        var gl = this.surface.gl;
        var numComponents = components;
        var type = this.surface.gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribLocation, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(attribLocation);
    };
    Cube.prototype.bindIndexToVerts = function () {
        var gl = this.surface.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    };
    Cube.prototype.update = function (dt) {
        this.rotation += dt;
    };
    return Cube;
}(Shape3D));
exports.Cube = Cube;
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
