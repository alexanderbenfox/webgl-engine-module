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
var EngineUtility_1 = require("./EngineUtility");
var Sprite_1 = require("./Sprite");
var Control_1 = require("./Control");
var Draggable = /** @class */ (function () {
    function Draggable() {
    }
    Draggable.prototype.onDrag = function (delta) { };
    return Draggable;
}());
exports.Draggable = Draggable;
var Clickable = /** @class */ (function () {
    function Clickable() {
    }
    Clickable.prototype.isClicked = function (mousePos) {
        return false;
    };
    return Clickable;
}());
exports.Clickable = Clickable;
var AABBRect = /** @class */ (function () {
    function AABBRect(topLeft, size) {
        this._topLeft = new EngineUtility_1.Vector2(topLeft.x, topLeft.y);
        this._size = new EngineUtility_1.Vector2(size.x, size.y);
    }
    AABBRect.prototype.detectCollision = function (other) {
        return this._topLeft.x < other._topLeft.x + other._size.x &&
            this._topLeft.x + this._size.x > other._topLeft.x &&
            this._topLeft.y < other._topLeft.y + other._size.y &&
            this._size.y + this._topLeft.y > other._topLeft.y;
    };
    return AABBRect;
}());
var Object2D = /** @class */ (function () {
    function Object2D(img, width, height, surf, startX, startY) {
        if (img)
            this.sprite = new Sprite_1.Sprite(surf, width, height, img);
        else
            this.sprite = null;
        this.pos = new EngineUtility_1.Vector2(startX, startY);
        this._delta = EngineUtility_1.Vector2.zero();
        this._size = new EngineUtility_1.Vector2(width, height);
        this._topLeft = new EngineUtility_1.Vector2(startX, startY);
        this._bottomRight = new EngineUtility_1.Vector2((startX + width), (startY + height));
    }
    Object2D.prototype.move = function (dx, dy) {
        this._delta = new EngineUtility_1.Vector2(dx, dy);
    };
    Object2D.prototype.update = function (dt) {
        this.updateBounds();
    };
    Object2D.prototype.draw = function () {
        if (this.sprite)
            this.sprite.blit(this.pos.x - Control_1.GameManager.camera.pos.x, this.pos.y - Control_1.GameManager.camera.pos.y);
    };
    Object2D.prototype.bounds = function (vec2) {
        return EngineUtility_1.inBounds2D(this._topLeft, this._bottomRight, vec2);
    };
    Object2D.prototype.updateBounds = function () {
        this._topLeft = new EngineUtility_1.Vector2(this.pos.x, this.pos.y);
        this._bottomRight = new EngineUtility_1.Vector2(this.pos.x + this._size.x, this.pos.y + this._size.y);
    };
    return Object2D;
}());
exports.Object2D = Object2D;
var EditorObject = /** @class */ (function (_super) {
    __extends(EditorObject, _super);
    function EditorObject(img, width, height, surf, startX, startY) {
        return _super.call(this, img, width, height, surf, startX, startY) || this;
    }
    EditorObject.prototype.isClicked = function (mousePos) {
        return _super.prototype.bounds.call(this, new EngineUtility_1.Vector2(mousePos.x, mousePos.y));
    };
    EditorObject.prototype.onDrag = function (delta) {
        var newX = this.pos.x + delta.x;
        var newY = this.pos.y + delta.y;
        this.pos = new EngineUtility_1.Vector2(newX, newY);
    };
    return EditorObject;
}(Object2D));
exports.EditorObject = EditorObject;
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    function GameObject(img, width, height, surf, startX, startY) {
        return _super.call(this, img, width, height, surf, startX, startY) || this;
    }
    GameObject.prototype.update = function (dt) {
        var newX = this.pos.x + (this._delta.x * dt);
        var newY = this.pos.y + (this._delta.y * dt);
        this.pos = new EngineUtility_1.Vector2(newX, newY);
        _super.prototype.update.call(this, dt);
    };
    return GameObject;
}(Object2D));
exports.GameObject = GameObject;
