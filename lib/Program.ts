declare function require(name:string);
import {Vector2, Vector3} from "./EngineUtility"
import {GameObject} from "./Components/Component"
import {LineRenderer} from "./Components/Renderer2D"
import {UIImage} from "./Components/UIImage"
import {CubeRenderer, SpriteRenderer} from "./Components/Renderer3D"
import {EditorControl, ObjectManager, SurfaceManager} from "./Managers"
import {Camera} from "./Components/CameraUtility"
import {DraggableUI} from "./Components/EditorObject"
import {GLUtility} from "./GLUtility"
import {DirectionalLight} from "./Components/Lighting"

class MouseData{
	public static offset : Vector2;
	public static position : Vector2;

	static getMouseCoords(ev) : Vector2 {
		if(ev.pageX || ev.pageY)
			return new Vector2(ev.pageX, ev.pageY);
		return new Vector2(ev.clientX + document.body.scrollLeft - document.body.clientLeft, ev.clientY + document.body.scrollTop - document.body.clientTop);
	}
}

export class Program{
	gl : WebGLRenderingContext;
	canvas : HTMLCanvasElement;

	lastUpdateTime : number;

	uiCamera : Camera;
	worldCamera : Camera;

	positionDelta : Vector3;

	storedObject : GameObject;


	constructor(){
		this.canvas = <HTMLCanvasElement>document.getElementById('glCanvas');
		this.gl = GLUtility.getGLContext(this.canvas, {alpha: false, premultipliedAlpha: false});
		this.assignPageEvents();

		console.log("Initializing...");
		console.log('CANVAS ' + this.canvas);

		let offset = new Vector2(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
		MouseData.offset = offset;

		//init surface manager
		SurfaceManager.SetCanvas(this.canvas);

		this.createGameObjects();

		this.positionDelta = new Vector3(0,0,0); 

		ObjectManager.populateInspector();

		this.drawScene();
	}

	createCameras(){
		let worldCamera_gameObject = new GameObject();
		this.worldCamera = worldCamera_gameObject.AddComponent(Camera);
		this.worldCamera.init(this.gl);
		this.worldCamera.AddComponent(GameObject);

		worldCamera_gameObject.transform.position = new Vector3(0,0,5);

		let uiCamera_gameObject = new GameObject();
		this.uiCamera = uiCamera_gameObject.AddComponent(Camera);
		this.uiCamera.init(this.gl);
		this.uiCamera.AddComponent(GameObject);

		ObjectManager.editorCamera = this.worldCamera;
	}

	createGameObjects() : void{
		this.createCameras();

		/*let uiBox1 = new GameObject();
		let uiBox1_sprite : UIImage = <UIImage>uiBox1.AddComponent(UIImage);
		uiBox1_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
		uiBox1.transform.position = new Vector3(0,0,0);

		let uiBox2 = new GameObject();
		let uiBox2_sprite : UIImage = <UIImage>uiBox2.AddComponent(UIImage);
		uiBox2_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
		uiBox1.transform.position = new Vector3(256,0,0);*/

		let worldCube1 = new GameObject();
		let worldCube1_renderer : CubeRenderer = <CubeRenderer>worldCube1.AddComponent(CubeRenderer);
		worldCube1_renderer.create();
		worldCube1.transform.position = new Vector3(-1, 0, -6);
		worldCube1.transform.rotation = new Vector3(60,20,0);

		let worldCube2 = new GameObject();
		let worldCube2_renderer : CubeRenderer = <CubeRenderer>worldCube2.AddComponent(CubeRenderer);
		worldCube2_renderer.create();
		worldCube2.transform.position = new Vector3(3,0,-12);
		worldCube2.transform.rotation = new Vector3(10,80,0);

		let worldSprite = new GameObject();
		let worldSprite_renderer : SpriteRenderer = <SpriteRenderer>worldSprite.AddComponent(SpriteRenderer);
		worldSprite_renderer.create();
		worldSprite_renderer.changeSprite('../img/tile.png', 256, 256);
		worldSprite.transform.position = new Vector3(-6,0, -6);
		worldSprite.transform.rotation = new Vector3(0,0,0);

		this.storedObject = worldSprite;

		let editorBox = new GameObject();
		let editorBox_draggableObject : DraggableUI = <DraggableUI>editorBox.AddComponent(DraggableUI);
		editorBox_draggableObject.init(this.uiCamera, '../img/tile.png', SurfaceManager.GetUISurface(), 256, 256);

		ObjectManager.gameObjects = [worldCube1, worldCube2, worldSprite, editorBox];
		//EditorControl.clickables = [];
		EditorControl.clickables = [editorBox_draggableObject];

		let dirLight = new DirectionalLight(SurfaceManager.GetWorldSurface(), new Vector3(100,20,30));
		let dirLight2 = new DirectionalLight(SurfaceManager.GetBlankWorldSurface(), new Vector3(100,20,30));
	}

	assignPageEvents() : void{
		document.onmousemove = function(ev){
			ev = ev || <MouseEvent>window.event;
			let mousePosition = MouseData.getMouseCoords(ev);
			if(MouseData.offset != null){
				let offsetMousePosition = new Vector2(mousePosition.x - MouseData.offset.x,mousePosition.y - MouseData.offset.y);
				mousePosition = offsetMousePosition;
			}
			MouseData.position = mousePosition;
			return mousePosition;
		};
		document.onmouseup = function(ev){
			EditorControl.draggingObject = null;
		};

		document.onmousedown = function(ev){
			let mousePosition = MouseData.getMouseCoords(ev);
			if(MouseData.offset != null){
				let offsetMousePosition = new Vector2(mousePosition.x - MouseData.offset.x,mousePosition.y - MouseData.offset.y);
				mousePosition = offsetMousePosition;
			}
			EditorControl.checkForClick(EditorControl.clickables, mousePosition.x, mousePosition.y);
		};

		document.onkeydown = function(evt){
			evt = evt || <KeyboardEvent>window.event;
			var charCode = evt.keyCode || evt.which;

			var down = 40;
			var up = 38;
			var left = 37;
			var right = 39;
			var z = 90;
			var x = 88;

			console.log(charCode);

			if(charCode == down)
				this.positionDelta = this.positionDelta.add(new Vector3(0,-1,0));
			if(charCode == up)
				this.positionDelta = this.positionDelta.add(new Vector3(0,1,0));
			if(charCode == right)
				this.positionDelta = this.positionDelta.add(new Vector3(1,0,0));
			if(charCode == left)
				this.positionDelta = this.positionDelta.add(new Vector3(-1,0,0));
		}.bind(this);

		document.onkeyup = function(evt){
			this.positionDelta = new Vector3(0,0,0);
		}.bind(this);
	}

	updateLoop() : void{
		let currentTime = (new Date).getTime();
		if(this.lastUpdateTime){
			let deltaTime = currentTime - this.lastUpdateTime;
			this.update(deltaTime);
		}
		this.lastUpdateTime = currentTime;
	}

	update(dt : number) : void{
		let normalizedUpdateValue = (30 * dt) / 1000.0;
		ObjectManager.update(normalizedUpdateValue);
		EditorControl.update(MouseData.position);
		//this.worldCamera.updatePosition(this.positionDelta);
		let v = new Vector3(this.positionDelta.x * normalizedUpdateValue, this.positionDelta.y * normalizedUpdateValue, this.positionDelta.z * normalizedUpdateValue);
		this.storedObject.transform.position = this.storedObject.transform.position.add(v);

	}

	render() : void{
		ObjectManager.render();
	}

	setCameraValue(value : number){
		this.worldCamera.update(value);
	}

	drawScene() : void{
		setInterval(function(){
			//define update loop
			SurfaceManager.clear();

			SurfaceManager.push();

			this.updateLoop();
			this.render();

			SurfaceManager.pop();

		}.bind(this), 15);
	}

	addGameObject(){
		ObjectManager.addObject();
	}
}





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



