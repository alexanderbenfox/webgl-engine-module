declare function require(name:string);
import {Vector2, Vector3} from "./EngineUtility"
import {DrawSurface} from "./Surface"
import {GameObject} from "./Components/Component"
import {LineRenderer} from "./Components/Renderer2D"
import {UIImage} from "./Components/UIImage"
import {CubeRenderer, SpriteRenderer} from "./Components/Renderer3D"
import {EditorControl, ObjectManager} from "./Managers"
import {ShaderType} from "./GLUtility"
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

	surface_ui : DrawSurface;
	surface_world : DrawSurface;
	surface_world_notex : DrawSurface;

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

		this.surface_ui = new DrawSurface(this.canvas, ShaderType.shader2d);
		this.surface_world = new DrawSurface(this.canvas, ShaderType.shader3d);
		this.surface_world_notex = new DrawSurface(this.canvas, ShaderType.shader3d_notexture);


		this.createGameObjects();
		//this.setupGrid();
		

		//line = new Line(surface_lines, 100,256,100,256,2);

		//obj_1.move(5,5);
		//obj_2.move(-5,5);
		//camera.move(5,3);

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
	}

	createGameObjects() : void{
		this.createCameras();

		let uiBox1 = new GameObject();
		let uiBox1_sprite : UIImage = <UIImage>uiBox1.AddComponent(UIImage);
		uiBox1_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
		uiBox1.transform.position = new Vector3(0,0,0);

		let uiBox2 = new GameObject();
		let uiBox2_sprite : UIImage = <UIImage>uiBox2.AddComponent(UIImage);
		uiBox2_sprite.init_renderer(this.uiCamera, this.surface_ui, 'box.png', 256, 256);
		uiBox1.transform.position = new Vector3(256,0,0);

		let worldCube1 = new GameObject();
		let worldCube1_renderer : CubeRenderer = <CubeRenderer>worldCube1.AddComponent(CubeRenderer);
		worldCube1_renderer.init_cube_renderer(this.surface_world_notex, this.worldCamera);
		worldCube1.transform.position = new Vector3(-1, 0, -6);
		worldCube1.transform.rotation = new Vector3(60,20,0);

		let worldCube2 = new GameObject();
		let worldCube2_renderer : CubeRenderer = <CubeRenderer>worldCube2.AddComponent(CubeRenderer);
		worldCube2_renderer.init_cube_renderer(this.surface_world_notex, this.worldCamera);
		worldCube2.transform.position = new Vector3(3,0,-12);
		worldCube2.transform.rotation = new Vector3(10,80,0);

		let worldSprite = new GameObject();
		let worldSprite_renderer : SpriteRenderer = <SpriteRenderer>worldSprite.AddComponent(SpriteRenderer);
		worldSprite_renderer.init_sprite_renderer(this.surface_world, this.worldCamera, '../img/tile.png', 256,256);
		worldSprite.transform.position = new Vector3(-6,0, -6);
		worldSprite.transform.rotation = new Vector3(0,0,0);

		this.storedObject = worldSprite;

		let editorBox = new GameObject();
		let editorBox_draggableObject : DraggableUI = <DraggableUI>editorBox.AddComponent(DraggableUI);
		editorBox_draggableObject.init(this.uiCamera, '../img/tile.png', this.surface_ui, 256, 256);

		ObjectManager.gameObjects = [uiBox1, uiBox2, worldCube1, worldCube2, worldSprite, editorBox];
		//EditorControl.clickables = [];
		EditorControl.clickables = [editorBox_draggableObject];

		let dirLight = new DirectionalLight(this.surface_world_notex, new Vector3(100,20,30));
		let dirLight2 = new DirectionalLight(this.surface_world, new Vector3(100,20,30));
	}

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
			this.surface_ui.clear();
			this.surface_world.clear();
			this.surface_world_notex.clear();

			this.surface_ui.push();
			this.surface_world.push();
			this.surface_world_notex.push();

			//this.surface_sprites.translate(this.surface_sprites.size.x/2, this.surface_sprites.size.y/2);
			//this.surface_lines.translate(this.surface_lines.size.x/2, this.surface_lines.size.y/2);
			//this.surface_sprites.rotate(Date.now()/1000 * Math.PI * .1);
			//this.surface_lines.rotate(Date.now()/1000 * Math.PI * .1);

			this.updateLoop();
			this.render();

			this.surface_ui.pop();
			this.surface_world.pop();
			this.surface_world_notex.pop();

		}.bind(this), 15);
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



