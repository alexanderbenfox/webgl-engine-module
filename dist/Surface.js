"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var GLUtility_1 = require("./GLUtility");
var Matrix_1 = require("./Matrix");
var DrawSurface = /** @class */ (function () {
    function DrawSurface(canvas, line) {
        this.canvas = canvas;
        this.matrixStack = new Matrix_1.MatrixStack();
        this.size = EngineUtility_1.Vector2.zero();
        this.gl = GLUtility_1.GLUtility.getGLContext(canvas, { alpha: false, premultipliedAlpha: false });
        this.locations = GLUtility_1.GLUtility.initGL(this.gl, this.size, line);
        this._program = this.locations.program;
        this.resize(this.size);
    }
    DrawSurface.prototype.getMatrix = function () {
        return this.matrixStack.stack[this.matrixStack.stack.length - 1];
    };
    DrawSurface.prototype.resize = function (size) {
        var density = window.devicePixelRatio || 1;
        if (size.checkZero()) {
            size = new EngineUtility_1.Vector2(this.canvas.clientWidth * density, this.canvas.clientHeight * density);
        }
        var width = this.canvas.width = size.x;
        var height = this.canvas.height = size.y;
        this.size = new EngineUtility_1.Vector2(width, height);
        this.density = density;
        this.gl.viewport(0, 0, width, height);
        this.gl.useProgram(this._program);
        this.gl.uniform2f(this.locations.resolution, width, height);
    };
    DrawSurface.prototype.clear = function () {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    DrawSurface.prototype.push = function () {
        this.matrixStack.push_matrix();
    };
    DrawSurface.prototype.pop = function () {
        this.matrixStack.pop_matrix();
    };
    DrawSurface.prototype.translate = function (tx, ty) {
        return Matrix_1.MatrixUtil.Translate(this.getMatrix(), [tx, ty, 0]);
    };
    DrawSurface.prototype.rotate = function (angle, v) {
        if (v === void 0) { v = false; }
        v = v || [0, 0, 0];
        this.matrixStack.rotate(angle, v);
    };
    DrawSurface.prototype.getRect = function () {
        var matrix = this.matrixStack.matrix.dup();
        var ul = [0, 0];
        var lr = [this.size.x, this.size.y];
        matrix = Matrix_1.MatrixUtil.invert(matrix, matrix);
        ul = Matrix_1.MatrixUtil.transform(ul, ul, matrix);
        lr = Matrix_1.MatrixUtil.transform(lr, lr, matrix);
        var rect = new Matrix_1.MatrixRect();
        rect.left = ul[0];
        rect.top = ul[1];
        rect.right = lr[0];
        rect.bottom = lr[1];
        return rect;
    };
    return DrawSurface;
}());
exports.DrawSurface = DrawSurface;
