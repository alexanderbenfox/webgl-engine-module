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
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory() {
    }
    ComponentFactory.CreateComponent = function (type) {
        return new type();
    };
    return ComponentFactory;
}());
exports.ComponentFactory = ComponentFactory;
var ComponentDictionary = /** @class */ (function () {
    function ComponentDictionary(init) {
        this._ids = [];
        this._components = [];
        if (init) {
            for (var i = 0; i < init.length; i++) {
                this[init[i].key] = init[i].value;
                this._ids.push(init[i].key);
                this._components.push(init[i].value);
            }
        }
    }
    ComponentDictionary.prototype.add = function (id, component) {
        this[id] = component;
        this._ids.push(id);
        this._components.push(component);
    };
    ComponentDictionary.prototype.remove = function (id) {
        var index = this._ids.indexOf(id, 0);
        this._ids.splice(index, 1);
        this._components.splice(index, 1);
        this[id] = null;
    };
    ComponentDictionary.prototype.lookUp = function (id) {
        var index = this._ids.indexOf(id, 0);
        return this._components[index];
    };
    Object.defineProperty(ComponentDictionary.prototype, "ids", {
        get: function () {
            return this._ids;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentDictionary.prototype, "comp", {
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    ComponentDictionary.prototype.containsId = function (id) {
        if (typeof this[id] === "undefined")
            return false;
        return true;
    };
    return ComponentDictionary;
}());
exports.ComponentDictionary = ComponentDictionary;
var Component = /** @class */ (function () {
    function Component() {
        this._initialized = false;
        this.id = this.constructor.name;
        this._baseComponent = this;
        this._baseComponent.components = new ComponentDictionary();
        this._baseComponent.components.add(this.id, this);
    }
    Object.defineProperty(Component.prototype, "pos", {
        get: function () {
            return this.gameObject.transform.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "rot", {
        get: function () {
            return this.gameObject.transform.rotation;
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.setBase = function (base) {
        this._baseComponent = base;
        this.components = this._baseComponent.components;
        this.gameObject = base.gameObject;
    };
    Component.prototype.new = function () {
        this.id = this.constructor.name;
        this._baseComponent = this;
        this._baseComponent.components = new ComponentDictionary();
        this._baseComponent.components.add(this.id, this);
    };
    Component.prototype.combineComponents = function (components) {
        this.components = new ComponentDictionary(components);
    };
    Component.prototype.GetID = function () {
        return this.id;
    };
    Component.prototype.GetComponent = function (type) {
        var generic = ComponentFactory.CreateComponent(type);
        var id = generic.GetID();
        if (this._baseComponent.components.containsId(id)) {
            return this._baseComponent.components.lookUp(id);
        }
        else
            return null;
    };
    Component.prototype.AddComponent = function (type) {
        if (this.GetComponent(type) == null) {
            var generic = ComponentFactory.CreateComponent(type);
            if (generic instanceof GameObject) {
                this.assignGameObject(generic);
            }
            this._baseComponent.components.add(generic.GetID(), generic);
            generic.setBase(this._baseComponent.gameObject);
            return generic;
        }
        else {
            return this.GetComponent(type);
        }
    };
    Component.prototype.assignGameObject = function (gameObject) {
        this._baseComponent.gameObject = gameObject;
        this.gameObject = gameObject;
        gameObject.gameObject = gameObject;
        var attachedComponents = this._baseComponent.components.comp;
        for (var i = 0; i < attachedComponents.length; i++) {
            attachedComponents[i].gameObject = gameObject;
        }
    };
    Component.prototype.RemoveComponent = function (type) {
        if (this.GetComponent(type) != null && Object.keys(this._baseComponent.components).length > 1) {
            var generic = ComponentFactory.CreateComponent(type);
            var id = generic.GetID();
            this._baseComponent.components.remove(id);
            return true;
        }
        return false;
    };
    Component.prototype.getAttachedComponents = function () {
        return this._baseComponent.components.comp;
    };
    Component.prototype.update = function (dt) { };
    Component.prototype.create = function () { };
    return Component;
}());
exports.Component = Component;
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    function GameObject() {
        var _this = _super.call(this) || this;
        _this.gameObject = _this;
        _this.transform = _this.AddComponent(Transform);
        _this.assignGameObject(_this);
        _this.name = new EngineUtility_1.EditorString("Object Name", "GameObject");
        return _this;
        //this.renderer = this.AddComponent(Renderer);
    }
    GameObject.prototype.update = function (dt) {
        var components = this.getAttachedComponents();
        for (var i = 0; i < components.length; i++) {
            if (components[i] != this)
                components[i].update(dt);
        }
    };
    GameObject.prototype.render = function () {
        if (this.renderer != null) {
            this.renderer.blit();
        }
    };
    return GameObject;
}(Component));
exports.GameObject = GameObject;
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    //get childCount() : number {
    //	return this._children.length;
    //}
    function Transform() {
        var _this = _super.call(this) || this;
        _this.position = new EngineUtility_1.Vector3(0, 0, 0);
        _this.rotation = new EngineUtility_1.Vector3(0, 0, 0);
        _this.scale = new EngineUtility_1.Vector3(1, 1, 1);
        return _this;
    }
    return Transform;
}(Component));
exports.Transform = Transform;
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer() {
        var _this = _super.call(this) || this;
        _this.renderPoint = new EngineUtility_1.Vector3(0, 0, 0);
        return _this;
    }
    Renderer.prototype.init = function (surface) {
        this.texture = null;
    };
    Renderer.prototype.blit = function () { };
    return Renderer;
}(Component));
exports.Renderer = Renderer;
function testFunction() {
    var gameObject = new GameObject();
    var transform = gameObject.AddComponent(Transform);
    var transform2 = gameObject.GetComponent(Transform);
    console.log(transform2.gameObject);
    console.log(gameObject.gameObject);
    console.log(transform.gameObject);
    console.log(gameObject.gameObject === transform.gameObject);
}
exports.testFunction = testFunction;
