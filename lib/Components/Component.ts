import {Vector3, EditorString} from "../EngineUtility"
import {Collider} from "./Collider"
import {Camera} from "./CameraUtility"
import {Texture2D} from "./Texture"

export class ComponentFactory{
	static CreateComponent<IComponent extends Component>(type:{new():Component;}) : Component{
        return new type();
    }
}

export class ComponentDictionary{
	private _ids : string[];
	private _components : Component[];

	constructor(init?: {key : string, value: Component}[]){
		this._ids = [];
		this._components = [];

		if(init){
			for(let i = 0; i < init.length; i++){
				this[init[i].key] = init[i].value;
				this._ids.push(init[i].key);
				this._components.push(init[i].value);
			}
		}
	}

	add(id : string, component : Component){
		this[id] = component;
		this._ids.push(id);
		this._components.push(component);
	}

	remove(id : string){
		let index = this._ids.indexOf(id, 0);
		this._ids.splice(index, 1);
		this._components.splice(index, 1);
		this[id] = null;
	}

	lookUp(id : string) : Component{
		let index = this._ids.indexOf(id,0);
		return this._components[index];
	}

	get ids() : string[]{
		return this._ids;
	}

	get comp() : Component[]{
		return this._components;
	}

	containsId(id : string){

		if(typeof this[id] === "undefined")
			return false;
		return true;
	}



}

export class Component{

	public gameObject : GameObject;
	protected _baseComponent : Component;
	protected _initialized : boolean = false;
	public components : ComponentDictionary;
	public id : string;

	get pos() : Vector3{
		return this.gameObject.transform.position;
	}

	get rot() : Vector3{
		return this.gameObject.transform.rotation;
	}

	setBase(base : Component){
		this._baseComponent = base;
		this.components = this._baseComponent.components;
		this.gameObject = base.gameObject;
	}

	new(){
		this.id = this.constructor.name;
		this._baseComponent = this;
		this._baseComponent.components = new ComponentDictionary();
		this._baseComponent.components.add(this.id, this);
	}

	constructor(){
		this.id = this.constructor.name;
		this._baseComponent = this;
		this._baseComponent.components = new ComponentDictionary();
		this._baseComponent.components.add(this.id, this);
	}

	protected combineComponents(components : {key : string, value: Component}[]){
		this.components = new ComponentDictionary(components);
	}

	GetID() : string{
		return this.id;
	}

	GetComponent<T extends Component>(type : {new() : T;}) : Component{
		var generic = ComponentFactory.CreateComponent(type);
		var id = generic.GetID();

		if (this._baseComponent.components.containsId(id)) {
            return this._baseComponent.components.lookUp(id);
        }
        else return null;
	}

	AddComponent<T extends Component>(type : {new() : T;}) : T{
		if(this.GetComponent(type) == null){
			var generic = ComponentFactory.CreateComponent(type);
			if(generic instanceof GameObject){
				this.assignGameObject(generic);
			}
			this._baseComponent.components.add(generic.GetID(), generic);
			generic.setBase(this._baseComponent.gameObject);

			return <T>generic;

		}else
		{

			return <T>this.GetComponent(type);
		}
	}

	protected assignGameObject(gameObject : GameObject){
		this._baseComponent.gameObject = gameObject;
		this.gameObject = gameObject;
		gameObject.gameObject = gameObject;
		let attachedComponents = this._baseComponent.components.comp;
		for(let i = 0; i < attachedComponents.length; i++){
			attachedComponents[i].gameObject = gameObject;
		}
	}

	RemoveComponent<T extends Component>(type : {new() : T}) : boolean {
		if(this.GetComponent(type) != null && Object.keys(this._baseComponent.components).length > 1){
			var generic = ComponentFactory.CreateComponent(type);
			var id = generic.GetID();
			this._baseComponent.components.remove(id);
			return true;
		}
		return false;
	}

	public getAttachedComponents() : Component[]{
		return this._baseComponent.components.comp;
	}

	update(dt : number){}
	create(){}
}

export class GameObject extends Component{
	public name : EditorString;
	public transform : Transform;
	public active : boolean;
	public renderer : Renderer;
	public collider : Collider;

	constructor(){
		super();
		this.gameObject = this;
		this.transform = this.AddComponent(Transform);
		this.assignGameObject(this);
		this.name = new EditorString("Object Name", "GameObject");
		//this.renderer = this.AddComponent(Renderer);
	}

	update(dt : number){
		let components = this.getAttachedComponents();

		for(let i = 0; i < components.length; i++){
			if(components[i] != this)
				components[i].update(dt);
		}
	}

	render(){
		if(this.renderer != null){
			this.renderer.blit();
		}
	}


}

export class Transform extends Component{
	//public parent : Transform;
	//private _children : Transform[];

	public position : Vector3;
	public rotation : Vector3;
	public scale : Vector3;

	//get childCount() : number {
	//	return this._children.length;
	//}

	constructor(){
		super();
		this.position = new Vector3(0,0,0);
		this.rotation = new Vector3(0,0,0);
		this.scale = new Vector3(1,1,1);
	}
}

export class Renderer extends Component{
	public camera : Camera;
	public renderPoint : Vector3;
	public size : Vector3;
	public texture : Texture2D;
	constructor(){
		super();
		this.renderPoint = new Vector3(0,0,0);
	}
	init(surface){
		this.texture = null;
	}
	blit(){}
}

export function testFunction(){
	var gameObject = new GameObject();
	var transform = gameObject.AddComponent(Transform);
	var transform2 = gameObject.GetComponent(Transform);

	console.log(transform2.gameObject);
	console.log(gameObject.gameObject);
	console.log(transform.gameObject);
	console.log(gameObject.gameObject === transform.gameObject);
}



