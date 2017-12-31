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
var gl_matrix_1 = require("gl-matrix");
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (n) {
            this.x = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (n) {
            this.y = n;
        },
        enumerable: true,
        configurable: true
    });
    Vector2.zero = function () {
        return new Vector2(0, 0);
    };
    Vector2.prototype.checkZero = function () {
        return this._x == 0 && this._y == 0;
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
var Vector3 = /** @class */ (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        var _this = _super.call(this, x, y) || this;
        _this._z = z;
        return _this;
    }
    Object.defineProperty(Vector3.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (n) {
            this.z = n;
        },
        enumerable: true,
        configurable: true
    });
    Vector3.zero = function () {
        return new Vector3(0, 0, 0);
    };
    Vector3.zAxis = function () {
        return new Vector3(0, 0, 1);
    };
    Vector3.yAxis = function () {
        return new Vector3(0, 1, 0);
    };
    Vector3.xAxis = function () {
        return new Vector3(1, 0, 0);
    };
    Vector3.prototype.checkZero = function () {
        return _super.prototype.checkZero.call(this) && this._z == 0;
    };
    Vector3.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    };
    return Vector3;
}(Vector2));
exports.Vector3 = Vector3;
var Vector4 = /** @class */ (function (_super) {
    __extends(Vector4, _super);
    function Vector4(x, y, z, w) {
        var _this = _super.call(this, x, y, z) || this;
        _this._w = w;
        return _this;
    }
    Object.defineProperty(Vector4.prototype, "w", {
        get: function () {
            return this._w;
        },
        set: function (n) {
            this.w = n;
        },
        enumerable: true,
        configurable: true
    });
    return Vector4;
}(Vector3));
exports.Vector4 = Vector4;
function inBounds2D(topLeft, bottomRight, boundSize) {
    if (boundSize.x > topLeft.x && boundSize.x < bottomRight.x) {
        if (boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
            return true;
    }
    return false;
}
exports.inBounds2D = inBounds2D;
function computeMatrix(relativeToMatrix, outputMatrix, position, rotation) {
    //setup projection stuff later (camera??)
    var xAxis = new Vector3(1, 0, 0);
    var yAxis = new Vector3(0, 1, 0);
    var zAxis = new Vector3(0, 0, 1);
    gl_matrix_1.mat4.translate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to translate (usually origin)
    position.toArray()); // amount to translate
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.x, // amount to rotate in radians
    xAxis.toArray()); // axis to rotate around (x)
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.y, // amount to rotate in radians
    yAxis.toArray()); // axis to rotate around (y)
    gl_matrix_1.mat4.rotate(outputMatrix, // destination matrix
    relativeToMatrix, // matrix to rotate
    rotation.z, // amount to rotate in radians
    zAxis.toArray()); // axis to rotate around (z)
}
exports.computeMatrix = computeMatrix;
