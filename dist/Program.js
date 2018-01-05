"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var Surface_1 = require("./Surface");
var Component_1 = require("./Components/Component");
var Sprite_1 = require("./Components/Sprite");
var Renderer3D_1 = require("./Components/Renderer3D");
var Managers_1 = require("./Managers");
var GLUtility_1 = require("./GLUtility");
var CameraUtility_1 = require("./Components/CameraUtility");
var EditorObject_1 = require("./Components/EditorObject");
var GLUtility_2 = require("./GLUtility");
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
        this.gl = GLUtility_2.GLUtility.getGLContext(this.canvas, { alpha: false, premultipliedAlpha: false });
        this.assignPageEvents();
        console.log("Initializing...");
        console.log('CANVAS ' + this.canvas);
        var offset = new EngineUtility_1.Vector2(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
        MouseData.offset = offset;
        this.surface_texobjects_2d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.texture_2d);
        this.surface_shapes_2d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.no_texture_2d);
        this.surface_shapes_3d = new Surface_1.DrawSurface(this.canvas, GLUtility_1.ShaderType.no_texture3d);
        this.createGameObjects();
        //this.setupGrid();
        //line = new Line(surface_lines, 100,256,100,256,2);
        //obj_1.move(5,5);
        //obj_2.move(-5,5);
        //camera.move(5,3);
        this.positionDelta = new EngineUtility_1.Vector3(0, 0, 0);
        this.drawScene();
    }
    Program.prototype.createCameras = function () {
        var worldCamera_gameObject = new Component_1.GameObject();
        this.worldCamera = worldCamera_gameObject.AddComponent(CameraUtility_1.Camera);
        this.worldCamera.init(this.gl);
        this.worldCamera.AddComponent(Component_1.GameObject);
        worldCamera_gameObject.transform.position = new EngineUtility_1.Vector3(0, 0, 5);
        var uiCamera_gameObject = new Component_1.GameObject();
        this.uiCamera = uiCamera_gameObject.AddComponent(CameraUtility_1.Camera);
        this.uiCamera.init(this.gl);
        this.uiCamera.AddComponent(Component_1.GameObject);
    };
    Program.prototype.createGameObjects = function () {
        this.createCameras();
        var uiBox1 = new Component_1.GameObject();
        var uiBox1_sprite = uiBox1.AddComponent(Sprite_1.SpriteRenderer);
        uiBox1_sprite.init_renderer(this.uiCamera, this.surface_texobjects_2d, 'box.png');
        uiBox1.transform.position = new EngineUtility_1.Vector3(0, 0, 0);
        var uiBox2 = new Component_1.GameObject();
        var uiBox2_sprite = uiBox2.AddComponent(Sprite_1.SpriteRenderer);
        uiBox2_sprite.init_renderer(this.uiCamera, this.surface_texobjects_2d, 'box.png');
        uiBox1.transform.position = new EngineUtility_1.Vector3(256, 0, 0);
        var worldCube1 = new Component_1.GameObject();
        var worldCube1_renderer = worldCube1.AddComponent(Renderer3D_1.CubeRenderer);
        worldCube1_renderer.init(this.surface_shapes_3d, this.worldCamera);
        worldCube1.transform.position = new EngineUtility_1.Vector3(-1, 0, -6);
        worldCube1.transform.rotation = new EngineUtility_1.Vector3(60, 20, 0);
        var worldCube2 = new Component_1.GameObject();
        var worldCube2_renderer = worldCube2.AddComponent(Renderer3D_1.CubeRenderer);
        worldCube2_renderer.init(this.surface_shapes_3d, this.worldCamera);
        worldCube2.transform.position = new EngineUtility_1.Vector3(3, 0, -12);
        worldCube2.transform.rotation = new EngineUtility_1.Vector3(10, 80, 0);
        var editorBox = new Component_1.GameObject();
        var editorBox_draggableObject = editorBox.AddComponent(EditorObject_1.DraggableUI);
        editorBox_draggableObject.init(this.uiCamera, '../img/tile.png', this.surface_texobjects_2d, 256, 256);
        Managers_1.ObjectManager.gameObjects = [uiBox1, uiBox2, worldCube1, worldCube2, editorBox];
        Managers_1.EditorControl.clickables = [editorBox_draggableObject];
    };
    /*setupGrid() : void{
        let lines : Stroke[] = [];
        let screen_width = this.surface_shapes_2d.size.x;
        let screen_height = this.surface_shapes_2d.size.y;

        let square = new Square(this.surface_shapes_2d, new Vector2(screen_width-3*32, 0), new Vector2(screen_width, screen_height), 0);
        EditorControl.editorShapes = [square];

        for(var x = 0; x < screen_width; x+=32){
            var line = new Stroke(this.surface_shapes_2d, new Vector2(x,0), new Vector2(x,screen_height), 2);
            lines.push(line);
        }

        for(var y = 0; y < screen_height; y+=32){
            var line = new Stroke(this.surface_shapes_2d, new Vector2(0, y), new Vector2(screen_width,y),2);
            lines.push(line);
        }
        EditorControl.grid = lines;
    }*/
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
            Managers_1.EditorControl.draggingObject = null;
        };
        document.onmousedown = function (ev) {
            var mousePosition = MouseData.getMouseCoords(ev);
            if (MouseData.offset != null) {
                var offsetMousePosition = new EngineUtility_1.Vector2(mousePosition.x - MouseData.offset.x, mousePosition.y - MouseData.offset.y);
                mousePosition = offsetMousePosition;
            }
            Managers_1.EditorControl.checkForClick(Managers_1.EditorControl.clickables, mousePosition.x, mousePosition.y);
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
        Managers_1.ObjectManager.update(normalizedUpdateValue);
        Managers_1.EditorControl.update(MouseData.position);
        this.worldCamera.updatePosition(this.positionDelta);
    };
    Program.prototype.render = function () {
        Managers_1.ObjectManager.render();
    };
    Program.prototype.setCameraValue = function (value) {
        this.worldCamera.update(value);
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
            this.render();
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
