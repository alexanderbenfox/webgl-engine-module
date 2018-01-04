import {Vector3} from "./EngineUtility"

export class ComponentFactory{
	static CreateComponent<IComponent extends Component>(type:{new():Component;}) : Component{
        return new type();
    }
}

export class Component{

	public gameObject : GameObject;
	protected _baseComponent : Component;
	protected _initialized : boolean = false;
	public components : {} ;
	public id : string;

	setBase(base : Component){
		this._baseComponent = base;
	}

	new(){
		this.id = this.constructor.name;
		this._baseComponent = this;
		this._baseComponent.components = {};
		this._baseComponent.components[this.id] = this;
	}

	constructor(){
		this.id = this.constructor.name;
		this._baseComponent = this;
		this._baseComponent.components = {};
		this._baseComponent.components[this.id] = this;
	}

	protected setComponents(components : {}){
		this.components = components;
	}

	GetID() : string{
		return this.id;
	}

	GetComponent<T extends Component>(type : {new() : T;}) : Component{
		var generic = ComponentFactory.CreateComponent(type);
		var id = generic.GetID();

		if (typeof this._baseComponent.components[id] === "undefined") {
            return null;
        }
        else return this._baseComponent.components[generic.GetID()];
	}

	AddComponent<T extends Component>(type : {new() : T;}) : T{
		if(this.GetComponent(type) == null){
			var generic = ComponentFactory.CreateComponent(type);
			this._baseComponent.setComponents(Object.assign({}, generic.components, this.components));
			generic.setBase(this._baseComponent);
			if(this.gameObject != null){
				generic.gameObject = this.gameObject;
			}
			return <T>generic;

		}else
		{

			return <T>this.GetComponent(type);
		}
	}

	RemoveComponent<T extends Component>(type : {new() : T}) : boolean {
		if(this.GetComponent(type) != null && Object.keys(this._baseComponent.components).length > 1){
			var generic = ComponentFactory.CreateComponent(type);
			var id = generic.GetID();
			this._baseComponent.components[id] = null;
			return true;
		}
		return false;
	}
}

export class GameObject extends Component{
	public transform : Transform;
	public active : boolean;
	public renderer : Renderer;

	constructor(){
		super();
		this.gameObject = this;
		this.transform = this.AddComponent(Transform);
		this.renderer = this.AddComponent(Renderer);
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
	}
}

export class Renderer extends Component{
	constructor(){
		super();		
	}
}

export function testFunction(){
	var gameObject = new GameObject();
	var transform = gameObject.AddComponent(Transform);
	var transform2 = new Transform();

	console.log(transform2.gameObject);
	console.log(gameObject.gameObject);
	console.log(transform.gameObject);
	console.log(gameObject.gameObject === transform.gameObject);
}



