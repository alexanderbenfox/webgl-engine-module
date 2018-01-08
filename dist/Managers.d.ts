import { Vector2 } from "./EngineUtility";
import { DraggableUI, Draggable } from "./Components/EditorObject";
import { GameObject, Component } from "./Components/Component";
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
    static selectedObject: GameObject;
    static inspectorItems: HTMLElement[];
    static update(dt: number): void;
    static render(): void;
    static populateInspector(): void;
    static updateInspector(): void;
    static showInInspector(): void;
    static showSelectedObject(component: Component, property: any, componentDiv: HTMLElement): void;
    static hideSelectedObject(): void;
}
