declare function require(name:string);
import {Vector2} from "./EngineUtility"
import {LineRenderer} from "./Components/Renderer2D"
import {DraggableUI, Draggable} from "./Components/EditorObject"
import {GameObject} from "./Components/Component"

export class EditorControl{
	public static draggingObject : Draggable = null;
	public static lastMouseCoords : Vector2 = null;
	public static clickables : DraggableUI[];

	static clickObject(object : Draggable) : void {
		EditorControl.draggingObject = object;
		console.log(object);
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

	static checkForClick(clickableObjects : any[], x : number, y : number) : void{
		for(let i = 0; i < clickableObjects.length; i++){
			if(clickableObjects[i].isClicked(new Vector2(x,y))){
				this.clickObject(clickableObjects[i]);
			}
		}
	}
}

export class ObjectManager{
	public static gameObjects : GameObject[] = [];

	static update(dt : number){
		for(let i = 0; i < ObjectManager.gameObjects.length; i++){
			ObjectManager.gameObjects[i].update(dt);
		}
	}

	static render(){
		for(let i = 0; i < ObjectManager.gameObjects.length; i++){
			ObjectManager.gameObjects[i].render();
		}
	}
}
