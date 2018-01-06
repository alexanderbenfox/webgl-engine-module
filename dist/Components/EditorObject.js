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
var UIImage_1 = require("./UIImage");
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
            this.gameObject.renderer = this.AddComponent(UIImage_1.UIImage);
            var spriteRenderer = this.GetComponent(UIImage_1.UIImage);
            spriteRenderer.init_renderer(camera, surf, img, width, height);
            width = spriteRenderer.size.x;
            height = spriteRenderer.size.y;
        }
        else {
            //this.gameObject.renderer = this.AddComponent(SquareRenderer);
            //let squareRenderer : SquareRenderer = <SquareRenderer>this.GetComponent(SquareRenderer);
            //squareRenderer.init_renderer(surface, )
        }
        this.gameObject.transform.position = new EngineUtility_1.Vector3(startX + width / 2, startY + height / 2, 0);
        this.gameObject.transform.scale = new EngineUtility_1.Vector3(width, height, 0);
        this.gameObject.collider = this.AddComponent(Collider_1.RectCollider);
        this.rect = this.GetComponent(Collider_1.RectCollider);
        this.rect.init(new EngineUtility_1.Vector2(startX, startY), new EngineUtility_1.Vector2(width, height));
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
