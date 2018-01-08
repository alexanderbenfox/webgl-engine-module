declare function require(name:string);
import {EditorProperty, Vector2} from "./EngineUtility"
import {LineRenderer} from "./Components/Renderer2D"
import {DraggableUI, Draggable} from "./Components/EditorObject"
import {GameObject, Component, Transform} from "./Components/Component"

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
	public static gameObjectHierarchy : HTMLElement[] = [];
	public static selectedObject : GameObject;
	public static inspectorItems : HTMLElement[] = [];

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

	static addComponent(){
		
	}

	static addObject(){
		let newObject = new GameObject();
		newObject.AddComponent(Transform);

		ObjectManager.gameObjects.push(newObject);

		let table = document.getElementById('gameObjectTable');
		let row = document.createElement("tr");

		row.addEventListener("click", function(){
			ObjectManager.hideSelectedObject();
			ObjectManager.selectedObject = newObject;
			ObjectManager.showInInspector();
		});
		row.innerHTML = newObject.name.string;
		table.appendChild(row);
		ObjectManager.gameObjectHierarchy.push(row);
	}

	static removeObject(rowIndex : number){
		ObjectManager.gameObjects = ObjectManager.gameObjects.splice(rowIndex - 1, 1);
		let row = ObjectManager.gameObjectHierarchy[rowIndex-1];
		row.parentNode.removeChild(row);
		ObjectManager.gameObjectHierarchy = ObjectManager.gameObjectHierarchy.splice(rowIndex - 1,1); 
	}

	static populateInspector() : void{
		let table = document.getElementById('gameObjectTable');
		for(let i = 0; i < ObjectManager.gameObjects.length; i++){
			let row = document.createElement("tr");
			row.addEventListener("click", function(){
				ObjectManager.hideSelectedObject();
				ObjectManager.selectedObject = ObjectManager.gameObjects[i];
				ObjectManager.showInInspector();
			});
			row.innerHTML = ObjectManager.gameObjects[i].name.string;
			table.appendChild(row);
			ObjectManager.gameObjectHierarchy.push(row);
		}
	}

	static updateInspector() : void{
		for(let i = 0; i < ObjectManager.gameObjectHierarchy.length; i++){
			ObjectManager.gameObjectHierarchy[i].innerHTML = ObjectManager.gameObjects[i].name.string;
		}
	}

	static showInInspector() : void{
		if(ObjectManager.selectedObject != null){
			let components = ObjectManager.selectedObject.getAttachedComponents();
			for(let i = 0; i < components.length; i++){

				let componentDiv = document.createElement('div');
				let componentTitle = document.createElement('p');
				componentTitle.innerHTML = components[i].GetID();
				componentDiv.appendChild(componentTitle);

				for(let property in components[i]){
					ObjectManager.showSelectedObject(components[i], property, componentDiv);
				}

				ObjectManager.inspectorItems.push(componentDiv);
			}
			let inspectorWindow = document.getElementById('inspectorWindow');
			for(let i = 0 ; i < ObjectManager.inspectorItems.length; i++){
				let componentInspector = ObjectManager.inspectorItems[i];
				inspectorWindow.appendChild(componentInspector);
			}
			ObjectManager.updateInspector();
		}
	}

	static showSelectedObject(component : Component, property, componentDiv : HTMLElement) : void{
		if(component.hasOwnProperty(property)){
			if(component[property] != null && typeof component[property] === 'object' && 'elements' in component[property]){
				
				
				let propertyDiv = document.createElement('div');
				let propertyLabel = document.createElement('p');
				propertyLabel.innerHTML = property;
				propertyDiv.appendChild(propertyLabel);

				let p : EditorProperty = <EditorProperty>component[property];
				p.showEditorProperty();
				for(let i = 0; i < p.elements.length; i++){
					let element = p.elements[i];
					propertyDiv.appendChild(element);
				}

				componentDiv.appendChild(propertyDiv);
				
			}
		}
	}

	static hideSelectedObject() : void{
		if(ObjectManager.selectedObject != null){
			for(let i = 0; i < ObjectManager.inspectorItems.length; i++){
				let o = ObjectManager.inspectorItems[i];
				o.parentNode.removeChild(o);
			}
			ObjectManager.inspectorItems = [];
		}
	}
}
