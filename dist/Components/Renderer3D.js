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
var Component_1 = require("./Component");
var EngineUtility_1 = require("../EngineUtility");
var gl_matrix_1 = require("gl-matrix");
var Renderer3D = /** @class */ (function (_super) {
    __extends(Renderer3D, _super);
    function Renderer3D() {
        return _super.call(this) || this;
    }
    Renderer3D.prototype.init = function (surface, camera) {
        this.gameObject.renderer = this;
        this.surface = surface;
        this._vertexBuffer = surface.gl.createBuffer();
        this._colorBuffer = surface.gl.createBuffer();
        this._normalBuffer = surface.gl.createBuffer();
        this.camera = camera;
    };
    Renderer3D.prototype.blit = function () { };
    Renderer3D.prototype.update = function (dt) { };
    return Renderer3D;
}(Component_1.Renderer));
exports.Renderer3D = Renderer3D;
var CubeRenderer = /** @class */ (function (_super) {
    __extends(CubeRenderer, _super);
    function CubeRenderer() {
        return _super.call(this) || this;
    }
    CubeRenderer.prototype.initVertexBuffer = function (gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
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
        this.positions = new Float32Array(vertexPositions);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    };
    CubeRenderer.prototype.initColorBuffer = function (gl) {
        //colors each face white - for now
        var white_color = [1.0, 1.0, 1.0, 0.9];
        //6 faces
        var faceColors = [white_color, white_color, white_color, white_color, white_color, white_color];
        var colors = [];
        for (var i = 0; i < faceColors.length; ++i) {
            var c = faceColors[i];
            colors = colors.concat(c, c, c, c);
        }
        this.colors = new Float32Array(colors);
        this._colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    };
    CubeRenderer.prototype.initIndexBuffer = function (gl) {
        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        var indicies = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ];
        this.indicies = new Uint16Array(indicies);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
    };
    CubeRenderer.prototype.initNormalBuffer = function (gl) {
        this._normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);
        var vertexNormals = [
            // Front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            // Back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            // Top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            // Bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            // Right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            // Left
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0
        ];
        this.normals = new Float32Array(vertexNormals);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    };
    CubeRenderer.prototype.init = function (surface, camera) {
        _super.prototype.init.call(this, surface, camera);
        var gl = this.surface.gl;
        this.initVertexBuffer(gl);
        this.initColorBuffer(gl);
        this.initIndexBuffer(gl);
        this.initNormalBuffer(gl);
    };
    CubeRenderer.prototype.blit = function () {
        var surface = this.surface;
        var gl = this.surface.gl;
        var program = this.surface.locations.program;
        //drawing position
        var modelViewMatrix = gl_matrix_1.mat4.create();
        EngineUtility_1.computeMatrix(modelViewMatrix, modelViewMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);
        this.assignAttrib(this._vertexBuffer, this.surface.locations.attributes.position, 3);
        this.assignAttrib(this._colorBuffer, this.surface.locations.attributes.texture, 4);
        this.assignAttrib(this._normalBuffer, this.surface.locations.attributes.normal, 3);
        this.bindIndexToVerts();
        gl.useProgram(program);
        gl.uniformMatrix4fv(surface.locations.uniforms.projection, false, this.camera.viewProjectionMatrix);
        gl.uniformMatrix4fv(surface.locations.uniforms.matrix, false, modelViewMatrix);
        var normalMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.invert(normalMatrix, modelViewMatrix);
        gl_matrix_1.mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(surface.locations.uniforms.normal, false, normalMatrix);
        var vertexCount = 36;
        var type = gl.UNSIGNED_SHORT;
        var offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    };
    CubeRenderer.prototype.assignAttrib = function (buffer, attribLocation, components) {
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
    CubeRenderer.prototype.bindIndexToVerts = function () {
        var gl = this.surface.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    };
    CubeRenderer.prototype.update = function (dt) {
    };
    CubeRenderer.prototype.cartesianToHomogeneous = function (point) {
        var x = point.x;
        var y = point.y;
        var z = point.z;
        return new EngineUtility_1.Vector4(x, y, z, 1);
    };
    CubeRenderer.prototype.homogeneousToCartesian = function (point) {
        var x = point.x;
        var y = point.y;
        var z = point.z;
        var w = point.w;
        return new EngineUtility_1.Vector3(x / w, y / w, z / w);
    };
    return CubeRenderer;
}(Renderer3D));
exports.CubeRenderer = CubeRenderer;
