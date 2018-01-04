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
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory() {
    }
    ComponentFactory.CreateComponent = function (type) {
        return new type();
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
var Component = /** @class */ (function () {
    function Component() {
        this._initialized = false;
        this.id = this.constructor.name;
        this._baseComponent = this;
        this._baseComponent.components = {};
        this._baseComponent.components[this.id] = this;
    }
    Component.prototype.setBase = function (base) {
        this._baseComponent = base;
    };
    Component.prototype.new = function () {
        this.id = this.constructor.name;
        this._baseComponent = this;
        this._baseComponent.components = {};
        this._baseComponent.components[this.id] = this;
    };
    Component.prototype.setComponents = function (components) {
        this.components = components;
    };
    Component.prototype.GetID = function () {
        return this.id;
    };
    Component.prototype.GetComponent = function (type) {
        var generic = ComponentFactory.CreateComponent(type);
        var id = generic.GetID();
        if (typeof this._baseComponent.components[id] === "undefined") {
            return null;
        }
        else
            return this._baseComponent.components[generic.GetID()];
    };
    Component.prototype.AddComponent = function (type) {
        if (this.GetComponent(type) == null) {
            var generic = ComponentFactory.CreateComponent(type);
            this._baseComponent.setComponents(Object.assign({}, generic.components, this.components));
            generic.setBase(this._baseComponent);
            if (this.gameObject != null) {
                generic.gameObject = this.gameObject;
            }
            return generic;
        }
        else {
            return this.GetComponent(type);
        }
    };
    Component.prototype.RemoveComponent = function (type) {
        if (this.GetComponent(type) != null && Object.keys(this._baseComponent.components).length > 1) {
            var generic = ComponentFactory.CreateComponent(type);
            var id = generic.GetID();
            this._baseComponent.components[id] = null;
            return true;
        }
        return false;
    };
    return Component;
}());
exports.Component = Component;
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    function GameObject() {
        var _this = _super.call(this) || this;
        _this.gameObject = _this;
        _this.transform = _this.AddComponent(Transform);
        _this.renderer = _this.AddComponent(Renderer);
        return _this;
    }
    return GameObject;
}(Component));
exports.GameObject = GameObject;
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    //get childCount() : number {
    //	return this._children.length;
    //}
    function Transform() {
        return _super.call(this) || this;
    }
    return Transform;
}(Component));
exports.Transform = Transform;
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        return _super.call(this) || this;
    }
    return Renderer;
}(Component));
exports.Renderer = Renderer;
function testFunction() {
    var gameObject = new GameObject();
    var transform = gameObject.AddComponent(Transform);
    var transform2 = new Transform();
    console.log(transform2.gameObject);
    console.log(gameObject.gameObject);
    console.log(transform.gameObject);
    console.log(gameObject.gameObject === transform.gameObject);
}
exports.testFunction = testFunction;
