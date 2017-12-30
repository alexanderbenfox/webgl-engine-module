import { Vector2 } from "./EngineUtility";
import { Draggable, EditorObject, GameObject } from "./GameObject";
import { Stroke, Shape } from "./DrawShapes";
export declare class EditorControl {
    static draggingObject: Draggable;
    static lastMouseCoords: Vector2;
    static editorObjects: EditorObject[];
    static grid: Stroke[];
    static editorShapes: Shape[];
    static clickObject(object: Draggable): void;
    static update(mouseCoords: Vector2): void;
    static updateObjects(dt: number): void;
    static drawObjects(): void;
    static checkForClick(clickableObjects: any[], x: number, y: number): void;
}
export declare class GameManager {
    static gameObjects: GameObject[];
    static camera: GameObject;
    static updateObjects(dt: number): void;
    static drawObjects(): void;
}
