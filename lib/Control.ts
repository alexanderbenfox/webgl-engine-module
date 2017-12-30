declare function require(name:string);
import {Vector2} from "./EngineUtility"
import {Draggable, Clickable, EditorObject, GameObject} from "./GameObject"
import {Stroke, Shape} from "./DrawShapes"

export class EditorControl{
	public static draggingObject : Draggable = null;
	public static lastMouseCoords : Vector2 = null;
	public static editorObjects : EditorObject[] = [];
	public static grid : Stroke[] = [];
	public static editorShapes : Shape[] = [];

	static clickObject(object : Draggable) : void {
		EditorControl.draggingObject = object;
	}

	static update(mouseCoords : Vector2) : void {
		let currentMouseCoordinates = mouseCoords;
		if(EditorControl.lastMouseCoords){
			let dx = currentMouseCoordinates.x - EditorControl.lastMouseCoords.x;
			let dy = currentMouseCoordinates.y - EditorControl.lastMouseCoords.y;

			if(EditorControl.draggingObject != null){
				EditorControl.draggingObject.onDrag(new Vector2(dx,dy));
			}
		}
		EditorControl.lastMouseCoords = currentMouseCoordinates;
	}

	static updateObjects(dt : number) : void{
		for(let i = 0; i < EditorControl.editorObjects.length; i++){
			EditorControl.editorObjects[i].update(dt);
		}
	}

	static drawObjects() : void {
		//draw objects
		for(let i = 0; i < EditorControl.editorObjects.length; i++){
			EditorControl.editorObjects[i].draw();
		}

		for(let j = 0; j < EditorControl.editorShapes.length; j++){
			EditorControl.editorShapes[j].blit();
		}

		//blit lines
		for(let j = 0; j < EditorControl.grid.length; j++){
			EditorControl.grid[j].blit();
		}

	}

	static checkForClick(clickableObjects : any[], x : number, y : number) : void{
		for(let i = 0; i < clickableObjects.length; i++){
			if(clickableObjects[i] instanceof Clickable && clickableObjects[i].getClick(x,y)){
				this.clickObject(clickableObjects[i]);
			}
		}
	}
}

export class GameManager{
	public static gameObjects : GameObject[] = [];
	public static camera : GameObject = null;

	static updateObjects(dt : number){
		for(let i = 0; i < GameManager.gameObjects.length; i++){
			GameManager.gameObjects[i].update(dt);
		}
	}

	static drawObjects(){
		for(let i = 0; i < GameManager.gameObjects.length; i++){
			GameManager.gameObjects[i].draw();
		}
	}
}
