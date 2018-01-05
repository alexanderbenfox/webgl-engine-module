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
var Sprite_1 = require("./Sprite");
var Component_1 = require("./Component");
var Collider_1 = require("./Collider");
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
var DraggableUI = /** @class */ (function (_super) {
    __extends(DraggableUI, _super);
    function DraggableUI() {
        return _super.call(this) || this;
    }
    DraggableUI.prototype.init = function (camera, img, surf, startX, startY, width, height) {
        if (img) {
            this.gameObject.renderer = this.AddComponent(Sprite_1.SpriteRenderer);
            var spriteRenderer = this.GetComponent(Sprite_1.SpriteRenderer);
            spriteRenderer.init_renderer(camera, surf, img);
        }
        else {
            //this.gameObject.renderer = this.AddComponent(SquareRenderer);
            //let squareRenderer : SquareRenderer = <SquareRenderer>this.GetComponent(SquareRenderer);
            //squareRenderer.init_renderer(surface, )
        }
        this.gameObject.transform.position = new EngineUtility_1.Vector3(startX, startY, 0);
        this.gameObject.transform.scale = new EngineUtility_1.Vector3(width, height, 0);
        this.gameObject.collider = this.AddComponent(Collider_1.RectCollider);
        this.rect = this.GetComponent(Collider_1.RectCollider);
        this.rect.init(new EngineUtility_1.Vector2(startX - width / 2, startY + height / 2), new EngineUtility_1.Vector2(width, height));
    };
    DraggableUI.prototype.isClicked = function (mousePos) {
        return this.rect.detectPoint(mousePos);
    };
    DraggableUI.prototype.onDrag = function (delta) {
        var newX = this.gameObject.transform.position.x + delta.x;
        var newY = this.gameObject.transform.position.y + delta.y;
        this.gameObject.transform.position = new EngineUtility_1.Vector3(newX, newY, 0);
    };
    return DraggableUI;
}(Component_1.Component));
exports.DraggableUI = DraggableUI;
