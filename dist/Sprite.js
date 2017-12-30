"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var GLUtility_1 = require("./GLUtility");
var Matrix_1 = require("./Matrix");
var Sprite = /** @class */ (function () {
    function Sprite(surface, width, height, url) {
        if (url === void 0) { url = false; }
        this.textures = [];
        this.surface = surface;
        this.textures = [];
        this.size = new EngineUtility_1.Vector2(width, height);
        this.image = new Image();
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
    }
    Sprite.prototype.onLoad = function () {
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
    Sprite.prototype.createTexture = function (canvas, index) {
        if (index === void 0) { index = false; }
        var texture = this.surface.gl.createTexture();
        index = index || this.textures.length;
        var gl = this.surface.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        // Setup scaling properties (only works with power-of-2 textures)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.generateMipmap(gl.TEXTURE_2D);
        // Makes non-power-of-2 textures ok:
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
        // Unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        // Store the texture
        this.textures[index] = texture;
    };
    Sprite.prototype.canvasFrame = function (frame, drawFunction) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var size = GLUtility_1.GLUtility.nextPowerOfTwo(Math.max(this.size.x, this.size.y));
        canvas.width = size;
        canvas.height = size;
        drawFunction(context, canvas.width, canvas.height);
        this.createTexture(canvas, frame);
    };
    Sprite.prototype.getFrameCount = function () {
        return this.textures.length;
    };
    Sprite.prototype.loadUrl = function (url) {
        this.image.src = '../img/' + url;
    };
    Sprite.prototype.blit = function (x, y, frame) {
        if (frame === void 0) { frame = false; }
        frame = frame || 0;
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
        var x1 = x;
        var x2 = x + this.size.x;
        var y1 = y;
        var y2 = y + this.size.y;
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
    return Sprite;
}());
exports.Sprite = Sprite;
function setMatrixUniforms(gl, shaderProgram, perspectiveMatrix, mvMatrixStack) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(perspectiveMatrix)));
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(Matrix_1.MatrixUtil.matrix_flatten(mvMatrixStack)));
}
