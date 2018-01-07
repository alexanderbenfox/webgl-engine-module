"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
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
    ObjectManager.populateInspector = function () {
        var table = document.getElementById('gameObjectTable');
        for (var i = 0; i < ObjectManager.gameObjects.length; i++) {
            var tableString = 'gameObject';
            var row = document.createElement("tr");
            row.innerHTML = tableString;
            table.appendChild(row);
        }
    };
    ObjectManager.gameObjects = [];
    return ObjectManager;
}());
exports.ObjectManager = ObjectManager;
