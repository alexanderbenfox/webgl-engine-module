declare function require(name:string);
import {Vector2, Vector3} from "./EngineUtility"
import {DrawSurface} from "./Surface"
import {GameObject, EditorObject} from "./GameObject"
import {Stroke, Shape, Square, Cube} from "./DrawShapes"
import {EditorControl, GameManager} from "./Control"
import {ShaderType} from "./GLUtility"
import {Camera} from "./CameraUtility"

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

	surface_texobjects_2d : DrawSurface;
	surface_shapes_2d : DrawSurface;
	surface_shapes_3d : DrawSurface;

	lastUpdateTime : number;

	camera : Camera;


	constructor(){
		this.canvas = <HTMLCanvasElement>document.getElementById('glCanvas');
		this.assignPageEvents();

		console.log("Initializing...");
		console.log('CANVAS ' + this.canvas);

		let offset = new Vector2(this.canvas.getBoundingClientRect().left, this.canvas.getBoundingClientRect().top);
		MouseData.offset = offset;

		this.surface_texobjects_2d = new DrawSurface(this.canvas, ShaderType.texture_2d);
		this.surface_shapes_2d = new DrawSurface(this.canvas, ShaderType.no_texture_2d);
		this.surface_shapes_3d = new DrawSurface(this.canvas, ShaderType.no_texture3d);

		this.createGameObjects();

		this.createEditorObjects();
		this.setupGrid();
		

		//line = new Line(surface_lines, 100,256,100,256,2);

		//obj_1.move(5,5);
		//obj_2.move(-5,5);
		//camera.move(5,3);

		this.drawScene();
	}

	createGameObjects() : void{
		let camera3d = new Camera(this.surface_shapes_3d.gl);
		this.camera = camera3d;

		let obj_1 = new GameObject('box.png', 256, 256, this.surface_texobjects_2d, 0,0);
		let obj_2 = new GameObject('box.png', 256, 256, this.surface_texobjects_2d, 256, 0);
		let camera = new GameObject(null, null, null, null, 0,0);
		let cube = new Cube(this.surface_shapes_3d, new Vector3(60,20,0), new Vector3(-1,0,-6), camera3d);
		let cube2 = new Cube(this.surface_shapes_3d, new Vector3(10,80,0), new Vector3(3,0,-12), camera3d);
		GameManager.camera = camera;
		GameManager.gameObjects = [obj_1, obj_2, camera];
		GameManager.objects3D = [cube, cube2];
	}

	createEditorObjects() : void {
		let editorBox = new EditorObject('../img/tile.png', 32, 32, this.surface_texobjects_2d, 256, 256);
		EditorControl.editorObjects.push(editorBox);
	}

	setupGrid() : void{
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
			EditorControl.checkForClick(EditorControl.editorObjects, mousePosition.x, mousePosition.y);
		};
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
		GameManager.updateObjects(normalizedUpdateValue);
		EditorControl.updateObjects(normalizedUpdateValue);
		EditorControl.update(MouseData.position);
		//this.camera.update(normalizedUpdateValue);
	}

	draw() : void{
		GameManager.drawObjects();
		EditorControl.drawObjects();
	}

	setCameraValue(value : number){
		this.camera.update(value);
	}

	drawScene() : void{
		setInterval(function(){
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



