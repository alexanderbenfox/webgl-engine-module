"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var Component_1 = require("./Components/Component");
var EditorControl = /** @class */ (function () {
    function EditorControl() {
    }
    EditorControl.clickObject = function (object) {
        EditorControl.draggingObject = object;
        console.log(object);
    };
    EditorControl.update = function (mouseCoords) {
        var currentMouseCoordinates = mouseCoords;
        if (EditorControl.lastMouseCoords) {
            var dx = currentMouseCoordinates.x - EditorControl.lastMouseCoords.x;
            var dy = currentMouseCoordinates.y - EditorControl.lastMouseCoords.y;
            if (EditorControl.draggingObject != null) {
                EditorControl.draggingObject.onDrag(new EngineUtility_1.Vector2(dx, dy));
            }
        }
        EditorControl.lastMouseCoords = currentMouseCoordinates;
    };
    EditorControl.checkForClick = function (clickableObjects, x, y) {
        for (var i = 0; i < clickableObjects.length; i++) {
            if (clickableObjects[i].isClicked(new EngineUtility_1.Vector2(x, y))) {
                this.clickObject(clickableObjects[i]);
            }
        }
    };
    EditorControl.draggingObject = null;
    EditorControl.lastMouseCoords = null;
    return EditorControl;
}());
exports.EditorControl = EditorControl;
var ObjectManager = /** @class */ (function () {
    function ObjectManager() {
    }
    ObjectManager.update = function (dt) {
        for (var i = 0; i < ObjectManager.gameObjects.length; i++) {
            ObjectManager.gameObjects[i].update(dt);
        }
    };
    ObjectManager.render = function () {
        for (var i = 0; i < ObjectManager.gameObjects.length; i++) {
            ObjectManager.gameObjects[i].render();
        }
    };
    ObjectManager.addObject = function () {
        var newObject = new Component_1.GameObject();
        newObject.AddComponent(Component_1.Transform);
        ObjectManager.gameObjects.push(newObject);
        var table = document.getElementById('gameObjectTable');
        var row = document.createElement("tr");
        row.addEventListener("click", function () {
            ObjectManager.hideSelectedObject();
            ObjectManager.selectedObject = newObject;
            ObjectManager.showInInspector();
        });
        row.innerHTML = newObject.name.string;
        table.appendChild(row);
        ObjectManager.gameObjectHierarchy.push(row);
    };
    ObjectManager.removeObject = function (rowIndex) {
        ObjectManager.gameObjects = ObjectManager.gameObjects.splice(rowIndex - 1, 1);
        var row = ObjectManager.gameObjectHierarchy[rowIndex - 1];
        row.parentNode.removeChild(row);
        ObjectManager.gameObjectHierarchy = ObjectManager.gameObjectHierarchy.splice(rowIndex - 1, 1);
    };
    ObjectManager.populateInspector = function () {
        var table = document.getElementById('gameObjectTable');
        var _loop_1 = function (i) {
            var row = document.createElement("tr");
            row.addEventListener("click", function () {
                ObjectManager.hideSelectedObject();
                ObjectManager.selectedObject = ObjectManager.gameObjects[i];
                ObjectManager.showInInspector();
            });
            row.innerHTML = ObjectManager.gameObjects[i].name.string;
            table.appendChild(row);
            ObjectManager.gameObjectHierarchy.push(row);
        };
        for (var i = 0; i < ObjectManager.gameObjects.length; i++) {
            _loop_1(i);
        }
    };
    ObjectManager.updateInspector = function () {
        for (var i = 0; i < ObjectManager.gameObjectHierarchy.length; i++) {
            ObjectManager.gameObjectHierarchy[i].innerHTML = ObjectManager.gameObjects[i].name.string;
        }
    };
    ObjectManager.showInInspector = function () {
        if (ObjectManager.selectedObject != null) {
            var components = ObjectManager.selectedObject.getAttachedComponents();
            for (var i = 0; i < components.length; i++) {
                var componentDiv = document.createElement('div');
                var componentTitle = document.createElement('p');
                componentTitle.innerHTML = components[i].GetID();
                componentDiv.appendChild(componentTitle);
                for (var property in components[i]) {
                    ObjectManager.showSelectedObject(components[i], property, componentDiv);
                }
                ObjectManager.inspectorItems.push(componentDiv);
            }
            var inspectorWindow = document.getElementById('inspectorWindow');
            for (var i = 0; i < ObjectManager.inspectorItems.length; i++) {
                var componentInspector = ObjectManager.inspectorItems[i];
                inspectorWindow.appendChild(componentInspector);
            }
            ObjectManager.updateInspector();
        }
    };
    ObjectManager.showSelectedObject = function (component, property, componentDiv) {
        if (component.hasOwnProperty(property)) {
            if (component[property] != null && typeof component[property] === 'object' && 'elements' in component[property]) {
                var propertyDiv = document.createElement('div');
                var propertyLabel = document.createElement('p');
                propertyLabel.innerHTML = property;
                propertyDiv.appendChild(propertyLabel);
                var p = component[property];
                p.showEditorProperty();
                for (var i = 0; i < p.elements.length; i++) {
                    var element = p.elements[i];
                    propertyDiv.appendChild(element);
                }
                componentDiv.appendChild(propertyDiv);
            }
        }
    };
    ObjectManager.hideSelectedObject = function () {
        if (ObjectManager.selectedObject != null) {
            for (var i = 0; i < ObjectManager.inspectorItems.length; i++) {
                var o = ObjectManager.inspectorItems[i];
                o.parentNode.removeChild(o);
            }
            ObjectManager.inspectorItems = [];
        }
    };
    ObjectManager.gameObjects = [];
    ObjectManager.gameObjectHierarchy = [];
    ObjectManager.inspectorItems = [];
    return ObjectManager;
}());
exports.ObjectManager = ObjectManager;
