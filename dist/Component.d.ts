import { Vector3 } from "./EngineUtility";
export declare class ComponentFactory {
    static CreateComponent<IComponent extends Component>(type: {
        new (): Component;
    }): Component;
}
export declare class Component {
    gameObject: GameObject;
    protected _baseComponent: Component;
    protected _initialized: boolean;
    components: {};
    id: string;
    setBase(base: Component): void;
    new(): void;
    constructor();
    protected setComponents(components: {}): void;
    GetID(): string;
    GetComponent<T extends Component>(type: {
        new (): T;
    }): Component;
    AddComponent<T extends Component>(type: {
        new (): T;
    }): T;
    RemoveComponent<T extends Component>(type: {
        new (): T;
    }): boolean;
}
export declare class GameObject extends Component {
    transform: Transform;
    active: boolean;
    renderer: Renderer;
    constructor();
}
export declare class Transform extends Component {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    constructor();
}
export declare class Renderer extends Component {
    constructor();
}
export declare function testFunction(): void;
