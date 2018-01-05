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
var EngineUtility_1 = require("../EngineUtility");
var GLUtility_1 = require("../GLUtility");
var Matrix_1 = require("../Matrix");
var Component_1 = require("./Component");
var SpriteRenderer = /** @class */ (function (_super) {
    __extends(SpriteRenderer, _super);
    function SpriteRenderer() {
        return _super.call(this) || this;
    }
    SpriteRenderer.prototype.init_renderer = function (camera, surface, url, width, height) {
        this.gameObject.renderer = this;
        this.surface = surface;
        this.camera = camera;
        this.image = new Image();
        this.size = new EngineUtility_1.Vector2(32, 32);
        //this.size = new Vector2(this.image.width, this.image.height);
        this.vertexBuffer = this.surface.gl.createBuffer();
        this.textureBuffer = this.surface.gl.createBuffer();
        this.textureCoords = new Float32Array([
            0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 0.0, 1.0, 1.0
        ]);
        this.image.onload = this.onLoad.bind(this);
        if (url)
            this.loadUrl(url);
        this._initialized = true;
    };
    SpriteRenderer.prototype.onLoad = function () {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = GLUtility_1.GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
        canvas.width = size;
        canvas.height = size;
        var safeW = Math.min(this.size.x, this.image.width);
        var safeH = Math.min(this.size.y, this.image.height);
        context.clearRect(0, 0, size, size);
        context.drawImage(this.image, 0, 0, safeW, safeH, 0, 0, size, size);
        this.createTexture(canvas);
    };
    SpriteRenderer.prototype.createTexture = function (canvas, index) {
        if (index === void 0) { index = false; }
        var texture = this.surface.gl.createTexture();
        var gl = this.surface.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        // Makes non-power-of-2 textures ok:
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        // Store the texture
        this.texture = texture;
    };
    SpriteRenderer.prototype.canvasFrame = function (frame, drawFunction) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = GLUtility_1.GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
        canvas.width = size;
        canvas.height = size;
        drawFunction(context, canvas.width, canvas.height);
        this.createTexture(canvas, frame);
    };
    SpriteRenderer.prototype.loadUrl = function (url) {
        this.image.src = '../img/' + url;
    };
    SpriteRenderer.prototype.blit = function () {
        var surface = this.surface;
        var gl = this.surface.gl;
        var program = this.surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.position;
        var vertexTexture = surface.locations.texture;
        var matrixLocation = surface.locations.matrix;
        var matrix = surface.getMatrix();
        gl.enableVertexAttribArray(vertexTexture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        var x = this.gameObject.transform.position.x;
        var y = this.gameObject.transform.position.y;
        var x1 = x;
        var x2 = x + this.size.x;
        var y1 = y;
        var y2 = y + this.size.y;
        //creating a new array on every draw call is gonna be really slow...
        var verticies = new Float32Array([
            x1, y1, x2, y1,
            x1, y2, x1, y2,
            x2, y1, x2, y2
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);
        //vertex buffer -> shader position attribute
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        //set shader buffer to current buffer and add texture data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureCoords, gl.STATIC_DRAW);
        //texture buffer -> shader texture attribute
        gl.vertexAttribPointer(vertexTexture, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        var n_matrix = new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(matrix));
        //apply matrix transformations
        gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    return SpriteRenderer;
}(Component_1.Renderer));
exports.SpriteRenderer = SpriteRenderer;
var AnimatedSprite = /** @class */ (function (_super) {
    __extends(AnimatedSprite, _super);
    function AnimatedSprite() {
        return _super.call(this) || this;
    }
    AnimatedSprite.prototype.init_renderer = function (camera, surface, url, width, height) {
        _super.prototype.init_renderer.call(this, camera, surface, url);
        width = width || this.image.width;
        height = height || this.image.height;
        this.currentFrame = 0;
        this.textures = [];
        this.size = new EngineUtility_1.Vector2(width, height);
        this._currentFrameTime = 0;
        this._initialized = true;
    };
    AnimatedSprite.prototype.createTexture = function (canvas, index) {
        if (index === void 0) { index = false; }
        var texture = this.surface.gl.createTexture();
        //push it on to the end
        index = index || this.textures.length;
        var gl = this.surface.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        // Makes non-power-of-2 textures ok:
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        // Store the texture with a base amount of time
        this.textures[index] = { texture: texture, frameTime: 1.0 };
    };
    AnimatedSprite.prototype.onLoad = function () {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = GLUtility_1.GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
        canvas.width = size;
        canvas.height = size;
        for (var y = 0; y < this.image.height; y += this.size.y) {
            for (var x = 0; x < this.image.width; x += this.size.x) {
                context.clearRect(0, 0, size, size);
                var safeW = Math.min(this.size.x, this.image.width - x);
                var safeH = Math.min(this.size.y, this.image.height - y);
                context.drawImage(this.image, x, y, safeW, safeH, 0, 0, size, size);
                this.createTexture(canvas);
            }
        }
    };
    AnimatedSprite.prototype.update = function (dt) {
        this._currentFrameTime += dt;
        if (this._currentFrameTime >= this.textures[this.currentFrame].frameTime) {
            this.currentFrame++;
            //default to looping
            if (this.currentFrame >= this.textures.length)
                this.currentFrame = 0;
        }
    };
    AnimatedSprite.prototype.blit = function () {
        var frame = this.currentFrame;
        if (!this.textures[frame])
            return;
        var surface = this.surface;
        var gl = this.surface.gl;
        var program = this.surface.locations.program;
        gl.useProgram(program);
        var vertexPosition = surface.locations.position;
        var vertexTexture = surface.locations.texture;
        var matrixLocation = surface.locations.matrix;
        var matrix = surface.getMatrix();
        gl.enableVertexAttribArray(vertexTexture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        var x = this.gameObject.transform.position.x;
        var y = this.gameObject.transform.position.y;
        var x1 = x;
        var x2 = x + this.size.x;
        var y1 = y;
        var y2 = y + this.size.y;
        //creating a new array on every draw call is gonna be really slow...
        var verticies = new Float32Array([
            x1, y1, x2, y1,
            x1, y2, x1, y2,
            x2, y1, x2, y2
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);
        //vertex buffer -> shader position attribute
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        //set shader buffer to current buffer and add texture data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureCoords, gl.STATIC_DRAW);
        //texture buffer -> shader texture attribute
        gl.vertexAttribPointer(vertexTexture, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[frame]);
        var n_matrix = new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(matrix));
        //apply matrix transformations
        gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    return AnimatedSprite;
}(SpriteRenderer));
exports.AnimatedSprite = AnimatedSprite;
function setMatrixUniforms(gl, shaderProgram, perspectiveMatrix, mvMatrixStack) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(perspectiveMatrix)));
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(mvMatrixStack)));
}
