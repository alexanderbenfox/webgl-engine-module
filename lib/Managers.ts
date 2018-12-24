declare function require(name:string);
import {EditorProperty, Vector2} from "./EngineUtility"
import {LineRenderer} from "./Components/Renderer2D"
import {DraggableUI, Draggable} from "./Components/EditorObject"
import {GameObject, Component, Transform} from "./Components/Component"
import {CubeRenderer, SpriteRenderer} from "./Components/Renderer3D";
import {UIImage} from "./Components/UIImage";
import {DrawSurface} from "./Surface"
import {ShaderType} from "./GLUtility"
import {Camera} from "./Components/CameraUtility"
import {Vector3} from "./EngineUtility"
import {PrimitiveRenderer, Primitive} from "./Components/PrimitiveRenderer"

export class SurfaceManager{
	private static surface_ui : DrawSurface;
	private static surface_world : DrawSurface;
	private static surface_world_notex : DrawSurface;
	private static canvas : HTMLCanvasElement;

	public static SetCanvas(canvas : HTMLCanvasElement){
		this.canvas = canvas;
	}

	public static GetUISurface() : DrawSurface{
		if(typeof this.surface_ui === 'undefined'){
			this.surface_ui = new DrawSurface(this.canvas, ShaderType.shader2d);
		}
		return this.surface_ui;
	}

	public static GetWorldSurface() : DrawSurface{
		if(typeof this.surface_world === 'undefined'){
			this.surface_world = new DrawSurface(this.canvas, ShaderType.shader3d);
		}
		return this.surface_world;
	}

	public static GetBlankWorldSurface() : DrawSurface{
		if(typeof this.surface_world_notex === 'undefined'){
			this.surface_world_notex = new DrawSurface(this.canvas, ShaderType.shader3d_notexture);
		}
		return this.surface_world_notex;
	}

	public static pop(){
		this.surface_ui.pop();
		this.surface_world.pop();
		this.surface_world_notex.pop();
	}

	public static push(){
		this.surface_ui.push();
		this.surface_world.push();
		this.surface_world_notex.push();
	}

	public static clear(){
		this.surface_ui.push();
		this.surface_world.push();
		this.surface_world_notex.push();
	}

}

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
	public static editorCamera : Camera;
	public static gameObjects : GameObject[] = [];
	public static gameObjectHierarchy : HTMLElement[] = [];
	public static selectedObject : GameObject;
	public static inspectorItems : HTMLElement[] = [];

	public static componentOptions : {name : string, type : {new():Component;}}[] = [{name : 'SpriteRenderer', type : SpriteRenderer}, {name : 'CubeRenderer', type : CubeRenderer}];

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
			let componentButton = this.addComponentButton(ObjectManager.selectedObject);
			this.inspectorItems.push(componentButton);
			inspectorWindow.appendChild(componentButton);

			ObjectManager.updateInspector();
		}
	}

	static addComponentButton(gameObject : GameObject) : HTMLElement{
		//create add component button
			let addComponentDiv = document.createElement("div");
			let addComponentDropDown = document.createElement("select");
			this.assignAllComponentOptions(addComponentDropDown);
			let addComponentButton = document.createElement("button");

			addComponentButton.addEventListener('click', () =>{
				let selectedOption = addComponentDropDown.value;
				for(let i = 0; i < this.componentOptions.length; i++){
					if(this.componentOptions[i].name == selectedOption){
						this.hideSelectedObject();
						let comp = gameObject.AddComponent(this.componentOptions[i].type);
						comp.create();
						this.showInInspector();
						break;
					}
				}
			});

			addComponentButton.innerHTML = "Add Component";

			addComponentDiv.appendChild(addComponentDropDown);
			addComponentDiv.appendChild(addComponentButton);
			return addComponentDiv;
	}

	static assignAllComponentOptions(select : HTMLSelectElement) : void {
		for(let i = 0; i < this.componentOptions.length; i++){
			let option = document.createElement('option');
			option.innerHTML = this.componentOptions[i].name;
			option.value = this.componentOptions[i].name;
			select.appendChild(option);
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

	static fromPrimitive(name : string, type : Primitive) : GameObject {
		let gameObj = new GameObject();
		gameObj.setName(name);
		let primitiveRenderer : PrimitiveRenderer = <PrimitiveRenderer>gameObj.AddComponent(PrimitiveRenderer);
		primitiveRenderer.createBuffers(type, Vector3.zero(), 1);
		primitiveRenderer.create();
		this.gameObjects.push(gameObj);
		return gameObj;
	}
}
