import { Vector2 } from "./EngineUtility";
import { DraggableUI, Draggable } from "./Components/EditorObject";
import { GameObject } from "./Components/Component";
export declare class EditorControl {
    static draggingObject: Draggable;
    static lastMouseCoords: Vector2;
    static clickables: DraggableUI[];
    static clickObject(object: Draggable): void;
    static update(mouseCoords: Vector2): void;
    static checkForClick(clickableObjects: any[], x: number, y: number): void;
}
export declare class ObjectManager {
    static gameObjects: GameObject[];
    static update(dt: number): void;
    static render(): void;
    static populateInspector(): void;
}
