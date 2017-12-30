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
    EditorControl.updateObjects = function (dt) {
        for (var i = 0; i < EditorControl.editorObjects.length; i++) {
            EditorControl.editorObjects[i].update(dt);
        }
    };
    EditorControl.drawObjects = function () {
        //draw objects
        for (var i = 0; i < EditorControl.editorObjects.length; i++) {
            EditorControl.editorObjects[i].draw();
        }
        for (var j = 0; j < EditorControl.editorShapes.length; j++) {
            EditorControl.editorShapes[j].blit();
        }
        //blit lines
        for (var j = 0; j < EditorControl.grid.length; j++) {
            EditorControl.grid[j].blit();
        }
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
    EditorControl.editorObjects = [];
    EditorControl.grid = [];
    EditorControl.editorShapes = [];
    return EditorControl;
}());
exports.EditorControl = EditorControl;
var GameManager = /** @class */ (function () {
    function GameManager() {
    }
    GameManager.updateObjects = function (dt) {
        for (var i = 0; i < GameManager.gameObjects.length; i++) {
            GameManager.gameObjects[i].update(dt);
        }
        for (var i = 0; i < GameManager.objects3D.length; i++) {
            GameManager.objects3D[i].update(dt);
        }
    };
    GameManager.drawObjects = function () {
        for (var i = 0; i < GameManager.gameObjects.length; i++) {
            GameManager.gameObjects[i].draw();
        }
        for (var i = 0; i < GameManager.objects3D.length; i++) {
            GameManager.objects3D[i].blit();
        }
    };
    GameManager.gameObjects = [];
    GameManager.camera = null;
    GameManager.objects3D = [];
    return GameManager;
}());
exports.GameManager = GameManager;
