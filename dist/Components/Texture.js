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
var GLUtility_1 = require("../GLUtility");
var EngineUtility_1 = require("../EngineUtility");
var Texture2D = /** @class */ (function () {
    function Texture2D(surface, url, width, height) {
        this.image = new Image();
        this.surface = surface;
        this.buffer = this.surface.gl.createBuffer();
        this.size = new EngineUtility_1.Vector2(width, height);
        this.coords = new Float32Array([
            0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 0.0, 1.0, 1.0
        ]);
        this.image.onload = this.onLoad.bind(this);
        if (url) {
            this.loadUrl(url);
        }
    }
    Texture2D.prototype.createPlaceholderTex = function () {
        this.texture = this.surface.gl.createTexture();
        ;
    };
    Texture2D.prototype.onLoad = function () {
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
    Texture2D.prototype.createTexture = function (canvas, index) {
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
    Texture2D.prototype.canvasFrame = function (frame, drawFunction) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = GLUtility_1.GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
        canvas.width = size;
        canvas.height = size;
        drawFunction(context, canvas.width, canvas.height);
        this.createTexture(canvas, frame);
    };
    Texture2D.prototype.loadUrl = function (url) {
        this.image.src = '../img/' + url;
    };
    Texture2D.prototype.update = function (dt) { };
    Texture2D.prototype.bindTexture = function () {
        var gl = this.surface.gl;
        gl.enableVertexAttribArray(this.surface.locations.attributes.texture);
        //set shader buffer to current buffer and add texture data
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.coords, gl.STATIC_DRAW);
        //texture buffer -> shader texture attribute
        gl.vertexAttribPointer(this.surface.locations.attributes.texture, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    };
    return Texture2D;
}());
exports.Texture2D = Texture2D;
var AnimatedTexture2D = /** @class */ (function (_super) {
    __extends(AnimatedTexture2D, _super);
    function AnimatedTexture2D(surface, url, width, height) {
        var _this = _super.call(this, surface, url, width, height) || this;
        _this._currentFrameTime = 0;
        _this.currentFrame = 0;
        _this.textures = [];
        _this.size = new EngineUtility_1.Vector2(width, height);
        _this._currentFrameTime = 0;
        return _this;
    }
    AnimatedTexture2D.prototype.createTexture = function (canvas, index) {
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
    AnimatedTexture2D.prototype.onLoad = function () {
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
    AnimatedTexture2D.prototype.update = function (dt) {
        this._currentFrameTime += dt;
        if (this._currentFrameTime >= this.textures[this.currentFrame].frameTime) {
            this.currentFrame++;
            //default to looping
            if (this.currentFrame >= this.textures.length)
                this.currentFrame = 0;
        }
    };
    AnimatedTexture2D.prototype.bindTexture = function () {
        var frame = this.currentFrame;
        if (!this.textures[frame])
            return;
        this.texture = this.textures[frame];
        _super.prototype.bindTexture.call(this);
    };
    return AnimatedTexture2D;
}(Texture2D));
exports.AnimatedTexture2D = AnimatedTexture2D;
