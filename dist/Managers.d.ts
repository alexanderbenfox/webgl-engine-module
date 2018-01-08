import { Vector2 } from "./EngineUtility";
import { DraggableUI, Draggable } from "./Components/EditorObject";
import { GameObject, Component } from "./Components/Component";
import { DrawSurface } from "./Surface";
import { Camera } from "./Components/CameraUtility";
export declare class SurfaceManager {
    private static surface_ui;
    private static surface_world;
    private static surface_world_notex;
    private static canvas;
    static SetCanvas(canvas: HTMLCanvasElement): void;
    static GetUISurface(): DrawSurface;
    static GetWorldSurface(): DrawSurface;
    static GetBlankWorldSurface(): DrawSurface;
    static pop(): void;
    static push(): void;
    static clear(): void;
}
export declare class EditorControl {
    static draggingObject: Draggable;
    static lastMouseCoords: Vector2;
    static clickables: DraggableUI[];
    static clickObject(object: Draggable): void;
    static update(mouseCoords: Vector2): void;
    static checkForClick(clickableObjects: any[], x: number, y: number): void;
}
export declare class ObjectManager {
    static editorCamera: Camera;
    static gameObjects: GameObject[];
    static gameObjectHierarchy: HTMLElement[];
    static selectedObject: GameObject;
    static inspectorItems: HTMLElement[];
    static componentOptions: {
        name: string;
        type: {
            new (): Component;
        };
    }[];
    static update(dt: number): void;
    static render(): void;
    static addObject(): void;
    static removeObject(rowIndex: number): void;
    static populateInspector(): void;
    static updateInspector(): void;
    static showInInspector(): void;
    static addComponentButton(gameObject: GameObject): HTMLElement;
    static assignAllComponentOptions(select: HTMLSelectElement): void;
    static showSelectedObject(component: Component, property: any, componentDiv: HTMLElement): void;
    static hideSelectedObject(): void;
}
