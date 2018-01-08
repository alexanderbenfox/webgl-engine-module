"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineUtility_1 = require("./EngineUtility");
var Component_1 = require("./Components/Component");
var Renderer3D_1 = require("./Components/Renderer3D");
var Managers_1 = require("./Managers");
var CameraUtility_1 = require("./Components/CameraUtility");
var EditorObject_1 = require("./Components/EditorObject");
var GLUtility_1 = require("./GLUtility");
var Lighting_1 = require("./Components/Lighting");
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
        this.gl = GLUtility_1.GLUtility.getGLContext(this.canvas, { alpha: false, premultipliedAlpha: false });
        this.assignPageEvents();
        console.log("Initializing...");
        console.log('CANVAS ' + this.canvas);
        var offset = new EngineUtility_1.Vector2(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
        MouseData.offset = offset;
        //init surface manager
        Managers_1.SurfaceManager.SetCanvas(this.canvas);
        this.createGameObjects();
        this.positionDelta = new EngineUtility_1.Vector3(0, 0, 0);
        Managers_1.ObjectManager.populateInspector();
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
        Managers_1.ObjectManager.editorCamera = this.worldCamera;
    };
    Program.prototype.createGameObjects = function () {
        this.createCameras();
        /*let uiBox1 = new GameObject();
        let uiBox1_sprite : UIImage = <UIImage>uiBox1.AddComponent(UIImage);
        uiBox1_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
        uiBox1.transform.position = new Vector3(0,0,0);

        let uiBox2 = new GameObject();
        let uiBox2_sprite : UIImage = <UIImage>uiBox2.AddComponent(UIImage);
        uiBox2_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
        uiBox1.transform.position = new Vector3(256,0,0);*/
        var worldCube1 = new Component_1.GameObject();
        var worldCube1_renderer = worldCube1.AddComponent(Renderer3D_1.CubeRenderer);
        worldCube1_renderer.create();
        worldCube1.transform.position = new EngineUtility_1.Vector3(-1, 0, -6);
        worldCube1.transform.rotation = new EngineUtility_1.Vector3(60, 20, 0);
        var worldCube2 = new Component_1.GameObject();
        var worldCube2_renderer = worldCube2.AddComponent(Renderer3D_1.CubeRenderer);
        worldCube2_renderer.create();
        worldCube2.transform.position = new EngineUtility_1.Vector3(3, 0, -12);
        worldCube2.transform.rotation = new EngineUtility_1.Vector3(10, 80, 0);
        var worldSprite = new Component_1.GameObject();
        var worldSprite_renderer = worldSprite.AddComponent(Renderer3D_1.SpriteRenderer);
        worldSprite_renderer.create();
        worldSprite_renderer.changeSprite('../img/tile.png', 256, 256);
        worldSprite.transform.position = new EngineUtility_1.Vector3(-6, 0, -6);
        worldSprite.transform.rotation = new EngineUtility_1.Vector3(0, 0, 0);
        this.storedObject = worldSprite;
        var editorBox = new Component_1.GameObject();
        var editorBox_draggableObject = editorBox.AddComponent(EditorObject_1.DraggableUI);
        editorBox_draggableObject.init(this.uiCamera, '../img/tile.png', Managers_1.SurfaceManager.GetUISurface(), 256, 256);
        Managers_1.ObjectManager.gameObjects = [worldCube1, worldCube2, worldSprite, editorBox];
        //EditorControl.clickables = [];
        Managers_1.EditorControl.clickables = [editorBox_draggableObject];
        var dirLight = new Lighting_1.DirectionalLight(Managers_1.SurfaceManager.GetWorldSurface(), new EngineUtility_1.Vector3(100, 20, 30));
        var dirLight2 = new Lighting_1.DirectionalLight(Managers_1.SurfaceManager.GetBlankWorldSurface(), new EngineUtility_1.Vector3(100, 20, 30));
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
        //this.worldCamera.updatePosition(this.positionDelta);
        var v = new EngineUtility_1.Vector3(this.positionDelta.x * normalizedUpdateValue, this.positionDelta.y * normalizedUpdateValue, this.positionDelta.z * normalizedUpdateValue);
        this.storedObject.transform.position = this.storedObject.transform.position.add(v);
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
            Managers_1.SurfaceManager.clear();
            Managers_1.SurfaceManager.push();
            this.updateLoop();
            this.render();
            Managers_1.SurfaceManager.pop();
        }.bind(this), 15);
    };
    Program.prototype.addGameObject = function () {
        Managers_1.ObjectManager.addObject();
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
