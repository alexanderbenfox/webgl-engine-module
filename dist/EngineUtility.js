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
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this._y;
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
        enumerable: true,
        configurable: true
    });
    Vector3.zero = function () {
        return new Vector3(0, 0, 0);
    };
    Vector3.prototype.checkZero = function () {
        return _super.prototype.checkZero.call(this) && this._z == 0;
    };
    return Vector3;
}(Vector2));
exports.Vector3 = Vector3;
function inBounds2D(topLeft, bottomRight, boundSize) {
    if (boundSize.x > topLeft.x && boundSize.x < bottomRight.x) {
        if (boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
            return true;
    }
    return false;
}
exports.inBounds2D = inBounds2D;
