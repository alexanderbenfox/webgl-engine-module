"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var Surface_1 = require("./Surface");
var GameObject_1 = require("./GameObject");
var DrawShapes_1 = require("./DrawShapes");
var Control_1 = require("./Control");
var GLUtility_1 = require("./GLUtility");
var CameraUtility_1 = require("./CameraUtility");
var MouseData = /** @class */ (function () {
    function MouseData() {
    }
    MouseData.getMouseCoords = function (ev) {
        if (ev.pageX || ev.pageY)
            return new EngineUtility_1.Vector2(ev.pageX, ev.pageY);
        return new EngineUtility_1.Vector2(ev.clientX + document.body.scrollLeft - document.body.clientLeft, ev.clientY + document.body.scrollTop - document.body.clientTop);
    };
    return MouseData;
}());
var Program = /** @class */ (function () {
    function Program() {
        this.canvas = document.getElementById('glCanvas');
        this.assignPageEvents();
        console.log("Initializing...");
        console.log('CANVAS ' + this.canvas);
        var offset = new EngineUtility_1.Vector2(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
        MouseData.offset = offset;
        this.surface_texobjects_2d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.texture_2d);
        this.surface_shapes_2d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.no_texture_2d);
        this.surface_shapes_3d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.no_texture3d);
        this.createGameObjects();
        this.createEditorObjects();
        this.setupGrid();
        //line = new Line(surface_lines, 100,256,100,256,2);
        //obj_1.move(5,5);
        //obj_2.move(-5,5);
        //camera.move(5,3);
        this.positionDelta = new EngineUtility_1.Vector3(0, 0, 0);
        this.drawScene();
    }
    Program.prototype.createGameObjects = function () {
        var camera3d = new CameraUtility_1.Camera(this.surface_shapes_3d.gl);
        this.camera = camera3d;
        var obj_1 = new GameObject_1.GameObject('box.png', 256, 256, this.surface_texobjects_2d, 0, 0);
        var obj_2 = new GameObject_1.GameObject('box.png', 256, 256, this.surface_texobjects_2d, 256, 0);
        var camera = new GameObject_1.GameObject(null, null, null, null, 0, 0);
        var cube = new DrawShapes_1.Cube(this.surface_shapes_3d, new EngineUtility_1.Vector3(60, 20, 0), new EngineUtility_1.Vector3(-1, 0, -6), camera3d);
        var cube2 = new DrawShapes_1.Cube(this.surface_shapes_3d, new EngineUtility_1.Vector3(10, 80, 0), new EngineUtility_1.Vector3(3, 0, -12), camera3d);
        Control_1.GameManager.camera = camera;
        Control_1.GameManager.gameObjects = [obj_1, obj_2, camera];
        Control_1.GameManager.objects3D = [cube, cube2];
    };
    Program.prototype.createEditorObjects = function () {
        var editorBox = new GameObject_1.EditorObject('../img/tile.png', 32, 32, this.surface_texobjects_2d, 256, 256);
        Control_1.EditorControl.editorObjects.push(editorBox);
    };
    Program.prototype.setupGrid = function () {
        var lines = [];
        var screen_width = this.surface_shapes_2d.size.x;
        var screen_height = this.surface_shapes_2d.size.y;
        var square = new DrawShapes_1.Square(this.surface_shapes_2d, new EngineUtility_1.Vector2(screen_width - 3 * 32, 0), new EngineUtility_1.Vector2(screen_width, screen_height), 0);
        Control_1.EditorControl.editorShapes = [square];
        for (var x = 0; x < screen_width; x += 32) {
            var line = new DrawShapes_1.Stroke(this.surface_shapes_2d, new EngineUtility_1.Vector2(x, 0), new EngineUtility_1.Vector2(x, screen_height), 2);
            lines.push(line);
        }
        for (var y = 0; y < screen_height; y += 32) {
            var line = new DrawShapes_1.Stroke(this.surface_shapes_2d, new EngineUtility_1.Vector2(0, y), new EngineUtility_1.Vector2(screen_width, y), 2);
            lines.push(line);
        }
        Control_1.EditorControl.grid = lines;
    };
    Program.prototype.assignPageEvents = function () {
        document.onmousemove = function (ev) {
            ev = ev || window.event;
            var mousePosition = MouseData.getMouseCoords(ev);
            if (MouseData.offset != null) {
                var offsetMousePosition = new EngineUtility_1.Vector2(mousePosition.x - MouseData.offset.x, mousePosition.y - MouseData.offset.y);
                mousePosition = offsetMousePosition;
            }
            MouseData.position = mousePosition;
            return mousePosition;
        };
        document.onmouseup = function (ev) {
            Control_1.EditorControl.draggingObject = null;
        };
        document.onmousedown = function (ev) {
            var mousePosition = MouseData.getMouseCoords(ev);
            if (MouseData.offset != null) {
                var offsetMousePosition = new EngineUtility_1.Vector2(mousePosition.x - MouseData.offset.x, mousePosition.y - MouseData.offset.y);
                mousePosition = offsetMousePosition;
            }
            Control_1.EditorControl.checkForClick(Control_1.EditorControl.editorObjects, mousePosition.x, mousePosition.y);
        };
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            var charCode = evt.keyCode || evt.which;
            var down = 40;
            var up = 38;
            var left = 37;
            var right = 39;
            var z = 90;
            var x = 88;
            console.log(charCode);
            if (charCode == down)
                this.positionDelta = this.positionDelta.add(new EngineUtility_1.Vector3(0, -1, 0));
            if (charCode == up)
                this.positionDelta = this.positionDelta.add(new EngineUtility_1.Vector3(0, 1, 0));
            if (charCode == right)
                this.positionDelta = this.positionDelta.add(new EngineUtility_1.Vector3(1, 0, 0));
            if (charCode == left)
                this.positionDelta = this.positionDelta.add(new EngineUtility_1.Vector3(-1, 0, 0));
        }.bind(this);
        document.onkeyup = function (evt) {
            this.positionDelta = new EngineUtility_1.Vector3(0, 0, 0);
        }.bind(this);
    };
    Program.prototype.updateLoop = function () {
        var currentTime = (new Date).getTime();
        if (this.lastUpdateTime) {
            var deltaTime = currentTime - this.lastUpdateTime;
            this.update(deltaTime);
        }
        this.lastUpdateTime = currentTime;
    };
    Program.prototype.update = function (dt) {
        var normalizedUpdateValue = (30 * dt) / 1000.0;
        Control_1.GameManager.updateObjects(normalizedUpdateValue);
        Control_1.EditorControl.updateObjects(normalizedUpdateValue);
        Control_1.EditorControl.update(MouseData.position);
        this.camera.updatePosition(this.positionDelta);
    };
    Program.prototype.draw = function () {
        Control_1.GameManager.drawObjects();
        Control_1.EditorControl.drawObjects();
    };
    Program.prototype.setCameraValue = function (value) {
        this.camera.update(value);
    };
    Program.prototype.drawScene = function () {
        setInterval(function () {
            //define update loop
            this.surface_texobjects_2d.clear();
            this.surface_shapes_2d.clear();
            this.surface_shapes_3d.clear();
            this.surface_texobjects_2d.push();
            this.surface_shapes_2d.push();
            this.surface_shapes_3d.push();
            //this.surface_sprites.translate(this.surface_sprites.size.x/2, this.surface_sprites.size.y/2);
            //this.surface_lines.translate(this.surface_lines.size.x/2, this.surface_lines.size.y/2);
            //this.surface_sprites.rotate(Date.now()/1000 * Math.PI * .1);
            //this.surface_lines.rotate(Date.now()/1000 * Math.PI * .1);
            this.updateLoop();
            this.draw();
            this.surface_texobjects_2d.pop();
            this.surface_shapes_2d.pop();
            this.surface_shapes_3d.pop();
        }.bind(this), 15);
    };
    return Program;
}());
exports.Program = Program;
/*ScriptEventEnum = {
    OnStart : 0,
    OnPlayerTouch : 1,
    OnDestroy : 2
};

function executeJSInContext(script, context){
    return function() {return eval(script);}.call(context);
}

function ScriptableEvent(){
    this.eventList = [];
};

ScriptableEvent.prototype.setNewScript = function(s, t){
    var event = {script : s, type : t};
    this.eventList.push(event);
};

ScriptableEvent.prototype.execute = function(eventType, object){
    if(inGame){
        for (var i = 0; i < this.eventList.length; i++) {
            if(this.eventList[i].type == eventType){
                executeJSInContext(eventList[i].script, object);
            }
        }
    }
};*/
