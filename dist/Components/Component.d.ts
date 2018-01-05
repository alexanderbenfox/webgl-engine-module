import { Vector3 } from "../EngineUtility";
import { Collider } from "./Collider";
import { Camera } from "./CameraUtility";
export declare class ComponentFactory {
    static CreateComponent<IComponent extends Component>(type: {
        new (): Component;
    }): Component;
}
export declare class ComponentDictionary {
    private _ids;
    private _components;
    constructor(init?: {
        key: string;
        value: Component;
    }[]);
    add(id: string, component: Component): void;
    remove(id: string): void;
    lookUp(id: string): Component;
    readonly ids: string[];
    readonly comp: Component[];
    containsId(id: string): boolean;
}
export declare class Component {
    gameObject: GameObject;
    protected _baseComponent: Component;
    protected _initialized: boolean;
    components: ComponentDictionary;
    id: string;
    readonly pos: Vector3;
    readonly rot: Vector3;
    setBase(base: Component): void;
    new(): void;
    constructor();
    protected combineComponents(components: {
        key: string;
        value: Component;
    }[]): void;
    GetID(): string;
    GetComponent<T extends Component>(type: {
        new (): T;
    }): Component;
    AddComponent<T extends Component>(type: {
        new (): T;
    }): T;
    protected assignGameObject(gameObject: GameObject): void;
    RemoveComponent<T extends Component>(type: {
        new (): T;
    }): boolean;
    protected getAttachedComponents(): Component[];
    update(dt: number): void;
}
export declare class GameObject extends Component {
    transform: Transform;
    active: boolean;
    renderer: Renderer;
    collider: Collider;
    constructor();
    update(dt: number): void;
    render(): void;
}
export declare class Transform extends Component {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    constructor();
}
export declare class Renderer extends Component {
    camera: Camera;
    constructor();
    blit(): void;
}
export declare function testFunction(): void;