export class ComponentFactory{
	static CreateComponent<IComponent extends Component>(type:{new():Component;}) : Component{
        return new type();
    }
}

export abstract class Component{
	private _components : {id : number, value : Component;} ;
	id : number;

	new(){
		this._components[this.id] = this;
	}

	get components(){
		return this._components;
	}

	setComponents(components : {id : number, value : Component;}){
		this._components = components;
	}

	constructor(){
		this.id = -1;
		this._components = {id: 0, value:this};
	}

	GetID() : number{
		return this.id;
	}

	GetComponent<T extends Component>(type : {new() : Component;}) : Component{
		var generic = ComponentFactory.CreateComponent(type);

		var id = generic.GetID()
		if (typeof this._components[id] === "undefined") {
            return null;
        }
        else return this._components[generic.GetID()];
	}

	AddComponent<T extends Component>(type : {new() : Component;}){
		if(this.GetComponent(type) != null){
			var generic = ComponentFactory.CreateComponent(type);
			this._components = Object.assign({}, generic.components, this.components);
			generic.setComponents(this._components);
		}
	}
}

export class GameObject extends Component{
	constructor(){
		super();
		this.id = 0;
	}

}


//how to use
var gameObject = new GameObject();
gameObject.GetComponent(GameObject);


