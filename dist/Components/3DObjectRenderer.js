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
var Renderer3D_1 = require("../Components/Renderer3D");
var Managers_1 = require("../Managers");
var gl_matrix_1 = require("gl-matrix");
var Triangulator_1 = require("../Components/Triangulator");
var EngineUtility_1 = require("../EngineUtility");
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["SPHERE"] = 0] = "SPHERE";
    ObjectType[ObjectType["CYLINDER"] = 1] = "CYLINDER";
    ObjectType[ObjectType["CUBE"] = 2] = "CUBE";
    ObjectType[ObjectType["CONE"] = 3] = "CONE";
    ObjectType[ObjectType["DOME"] = 4] = "DOME";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
var ObjectRenderer = /** @class */ (function (_super) {
    __extends(ObjectRenderer, _super);
    function ObjectRenderer() {
        var _this = _super.call(this) || this;
        _this.buffer = new Triangulator_1.buffers();
        return _this;
    }
    ObjectRenderer.prototype.create = function () {
        //call create buffers beforehand??
        this.init_un(Managers_1.SurfaceManager.GetBlankWorldSurface(), Managers_1.ObjectManager.editorCamera);
    };
    ObjectRenderer.prototype.createBuffers = function (type, offset, size) {
        switch (type) {
            case ObjectType.SPHERE:
                Triangulator_1.Triangulator.MakeSphere(this.buffer, offset, size / 2, size, [1, 1, 1]);
                break;
            case ObjectType.CYLINDER:
                Triangulator_1.Triangulator.MakeCylinder(this.buffer, offset, size / 2, size / 2, size, [1, 1, 1]);
                break;
            case ObjectType.CONE:
                Triangulator_1.Triangulator.MakeCylinder(this.buffer, offset, size / 2, 0, size, [1, 1, 1]);
                break;
            case ObjectType.DOME:
                Triangulator_1.Triangulator.MakeDome(this.buffer, offset, size / 2, size, false, [1, 1, 1]);
                break;
            case ObjectType.CUBE:
            default:
                Triangulator_1.Triangulator.MakeCube(this.buffer, new EngineUtility_1.Vector3(size, size, size), offset, [1, 1, 1]);
        }
        console.log("VERTS = " + this.buffer.verts.length);
        console.log("INDICIES = " + this.buffer.indicies.length);
    };
    ObjectRenderer.prototype.initVertexBuffer = function (gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        this.positions = new Float32Array(this.buffer.verts);
        console.log("POSITIONS:");
        console.log(this.positions);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    };
    ObjectRenderer.prototype.initColorBuffer = function (gl) {
        //colors each face white - for now
        var alpha = 1;
        var colors = [];
        for (var i = 0; i < this.buffer.indicies.length; i++) {
            var white = [1, 1, 1, 1];
            colors = colors.concat(white, white, white, white);
        }
        /*for (let i = 0; i < this.buffer.colors.length; ++i){
            const c = this.buffer.colors[i];
            //face colors contains an array of 3 colors
            colors = colors.concat(c);
            colors.push(alpha);
        }*/
        this.colors = new Float32Array(colors);
        console.log("COLORS:");
        console.log(this.colors);
        this._colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    };
    ObjectRenderer.prototype.initIndexBuffer = function (gl) {
        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        this.indicies = new Uint16Array(this.buffer.indicies);
        console.log("INDICIES:");
        console.log(this.indicies);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicies, gl.STATIC_DRAW);
    };
    ObjectRenderer.prototype.initNormalBuffer = function (gl) {
        this._normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBuffer);
        this.normals = new Float32Array(this.buffer.normals);
        console.log("NORMALS:");
        console.log(this.normals);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    };
    ObjectRenderer.prototype.init_un = function (surface, camera, url, width, height) {
        _super.prototype.init_renderer.call(this, surface, camera);
        var gl = this.surface.gl;
        this.initVertexBuffer(gl);
        this.initColorBuffer(gl);
        this.initIndexBuffer(gl);
        this.initNormalBuffer(gl);
        //if(url && width && height)
        //	this.texture = new Texture2D(surface, this, url, width,height);
    };
    ObjectRenderer.prototype.blit = function () {
        var surface = this.surface;
        var gl = this.surface.gl;
        var program = this.surface.locations.program;
        //drawing position
        var modelViewMatrix = gl_matrix_1.mat4.create();
        EngineUtility_1.computeMatrix(modelViewMatrix, modelViewMatrix, this.gameObject.transform.position, this.gameObject.transform.rotation);
        this.assignAttrib(this._vertexBuffer, this.surface.locations.attributes.position, 3);
        this.assignAttrib(this._colorBuffer, this.surface.locations.attributes.color, 4);
        this.assignAttrib(this._normalBuffer, this.surface.locations.attributes.normal, 3);
        this.bindIndexToVerts();
        gl.useProgram(program);
        if (this.texture != null)
            this.texture.bindTexture();
        else
            gl.disableVertexAttribArray(this.surface.locations.attributes.texture);
        gl.uniformMatrix4fv(surface.locations.uniforms.projection, false, this.camera.viewProjectionMatrix);
        gl.uniformMatrix4fv(surface.locations.uniforms.matrix, false, modelViewMatrix);
        var normalMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.invert(normalMatrix, modelViewMatrix);
        gl_matrix_1.mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(surface.locations.uniforms.normal, false, normalMatrix);
        var vertexCount = this.indicies.length;
        var type = gl.UNSIGNED_SHORT;
        var offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    };
    ObjectRenderer.prototype.assignAttrib = function (buffer, attribLocation, components) {
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
    ObjectRenderer.prototype.bindIndexToVerts = function () {
        var gl = this.surface.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    };
    ObjectRenderer.prototype.update = function (dt) {
    };
    ObjectRenderer.prototype.cartesianToHomogeneous = function (point) {
        var x = point.x;
        var y = point.y;
        var z = point.z;
        return new EngineUtility_1.Vector4(x, y, z, 1);
    };
    ObjectRenderer.prototype.homogeneousToCartesian = function (point) {
        var x = point.x;
        var y = point.y;
        var z = point.z;
        var w = point.w;
        return new EngineUtility_1.Vector3(x / w, y / w, z / w);
    };
    return ObjectRenderer;
}(Renderer3D_1.Renderer3D));
exports.ObjectRenderer = ObjectRenderer;
