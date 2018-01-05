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
//Colliders
//help with Seperating Axis Theorem for oriented box collision found here: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
var Component_1 = require("./Component");
var EngineUtility_1 = require("../EngineUtility");
var Collider = /** @class */ (function (_super) {
    __extends(Collider, _super);
    function Collider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Collider;
}(Component_1.Component));
exports.Collider = Collider;
var Collider2D = /** @class */ (function (_super) {
    __extends(Collider2D, _super);
    function Collider2D() {
        var _this = _super.call(this) || this;
        _this._dots = [];
        return _this;
    }
    Object.defineProperty(Collider2D.prototype, "dots", {
        get: function () {
            return this._dots;
        },
        enumerable: true,
        configurable: true
    });
    return Collider2D;
}(Collider));
exports.Collider2D = Collider2D;
var RectCollider = /** @class */ (function (_super) {
    __extends(RectCollider, _super);
    function RectCollider() {
        return _super.call(this) || this;
    }
    RectCollider.prototype.init = function (topLeft, size) {
        this._size = new EngineUtility_1.Vector2(size.x, size.y);
        this._dots[0] = new EngineUtility_1.Vector2(topLeft.x + size.x, topLeft.y - size.y);
        this._dots[1] = new EngineUtility_1.Vector2(topLeft.x, topLeft.y);
        this._dots[2] = new EngineUtility_1.Vector2(topLeft.x + this._size.x, topLeft.y);
        this._dots[3] = new EngineUtility_1.Vector2(topLeft.x, topLeft.y + this._size.y);
        this._dots[4] = new EngineUtility_1.Vector2(topLeft.x + this._size.x, topLeft.y + this._size.y);
        this._rotation = new EngineUtility_1.Vector3(this.gameObject.transform.rotation.x, this.gameObject.transform.rotation.y, this.gameObject.transform.rotation.z);
    };
    RectCollider.prototype.update = function (dt) {
        this.updateRotation();
        this.updatePosition();
    };
    RectCollider.prototype.updatePosition = function () {
        //update positions 
        var newPos = new EngineUtility_1.Vector2(this.gameObject.transform.position.x, this.gameObject.transform.position.x);
        var oldPos = this._dots[0];
        var deltaPosition = newPos.sub(oldPos);
        if (deltaPosition.checkZero())
            return;
        //update dots
        for (var i = 0; i < this._dots.length; i++) {
            this._dots[i].add(deltaPosition);
        }
    };
    RectCollider.prototype.updateRotation = function () {
        var deltaRotation = this._rotation.z - this.gameObject.transform.rotation.z;
        if (deltaRotation == 0)
            return;
        for (var i = 1; i < this._dots.length; i++) {
            var xlength = this._dots[i].x - this._dots[0].x;
            var ylength = this._dots[i].y - this._dots[0].y;
            var newX = xlength * Math.cos(deltaRotation) - ylength * Math.sin(deltaRotation);
            var newY = xlength * Math.sin(deltaRotation) + ylength * Math.cos(deltaRotation);
            newX += this._dots[0].x;
            newY += this._dots[0].y;
            this._dots[i] = new EngineUtility_1.Vector2(newX, newY);
        }
    };
    RectCollider.prototype.detectCollision = function (other) {
        if (other instanceof RectCollider) {
            var nrmls1 = this.getNormals();
            var nrmls2 = other.getNormals();
            var corners1 = this.dots;
            var corners2 = other.dots;
            var resP = this.getProjectionResult(corners1, corners2, nrmls1[1]);
            var resQ = this.getProjectionResult(corners1, corners2, nrmls1[0]);
            var resR = this.getProjectionResult(corners1, corners2, nrmls2[1]);
            var resS = this.getProjectionResult(corners1, corners2, nrmls2[0]);
            var isSeperated = resP || resQ || resR || resS;
            return !isSeperated;
        }
        else if (other instanceof CircleCollider) {
            var boxCenter = this.dots[0];
            var max = Number.NEGATIVE_INFINITY;
            var box2circleVector = new EngineUtility_1.Vector2(other.pos.x - this.dots[0].x, other.pos.y - this.dots[0].y);
            var box2circleNormalized = box2circleVector.normalize();
            //get maximum projection onto the circle
            for (var i = 1; i < this.dots.length; i++) {
                var corner = this.dots[i];
                var vector = new EngineUtility_1.Vector2(corner.x - boxCenter.x, corner.y - boxCenter.y);
                var proj = vector.dot(box2circleNormalized);
                if (max < proj)
                    max = proj;
            }
            //is there a circle?
            var circle = box2circleVector.magnitude() > 0;
            //is there a seperation
            var seperation = (box2circleVector.magnitude() - max - other.radius) > 0;
            return !(seperation && circle);
        }
    };
    RectCollider.prototype.getProjectionResult = function (corners_box1, corners_box2, normals) {
        var obj = { P1: EngineUtility_1.Vector2.getMinMaxProjections(corners_box1, normals), P2: EngineUtility_1.Vector2.getMinMaxProjections(corners_box2, normals) };
        var seperated = obj.P1.maxProj < obj.P2.minProj || obj.P2.maxProj < obj.P1.minProj;
        return seperated;
    };
    RectCollider.prototype.detectPoint = function (other) {
        var bottomRight = this.dots[4];
        return EngineUtility_1.inBounds2D(this.dots[1], bottomRight, other);
    };
    RectCollider.prototype.getNormals = function () {
        var normals = [];
        for (var i = 0; i < this._dots.length - 1; i++) {
            var nrmlX = this._dots[i + 1].x - this._dots[i].x;
            var nrmlY = this._dots[i + 1].y - this._dots[i].y;
            var currentNrml = new EngineUtility_1.Vector2(nrmlX, nrmlY);
            normals.push(currentNrml);
        }
        var f_nrmlX = this._dots[1].x - this._dots[this._dots.length - 1].x;
        var f_nrmlY = this._dots[1].y - this._dots[this._dots.length - 1].y;
        var finalNrml = new EngineUtility_1.Vector2(f_nrmlX, f_nrmlY);
        normals.push(finalNrml);
        return normals;
    };
    return RectCollider;
}(Collider2D));
exports.RectCollider = RectCollider;
var CircleCollider = /** @class */ (function (_super) {
    __extends(CircleCollider, _super);
    function CircleCollider() {
        return _super.call(this) || this;
    }
    CircleCollider.prototype.init = function (radius) {
        this.radius = radius;
        this._initialized = true;
    };
    CircleCollider.prototype.update = function (dt) { };
    CircleCollider.prototype.detectCollision = function (other) {
        if (other instanceof CircleCollider) {
            var dx = other.gameObject.transform.position.x - this.gameObject.transform.position.x;
            var dy = other.gameObject.transform.position.y - this.gameObject.transform.position.y;
            var dx2 = dx * dx;
            var dy2 = dy * dy;
            var radii = this.radius + other.radius;
            var radii2 = radii * radii;
            return ((dx2 + dy2) < radii2);
        }
        else if (other instanceof RectCollider) {
            return other.detectCollision(this);
        }
    };
    return CircleCollider;
}(Collider2D));
exports.CircleCollider = CircleCollider;
