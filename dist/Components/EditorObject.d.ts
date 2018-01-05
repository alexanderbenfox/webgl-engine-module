import { Vector2 } from "../EngineUtility";
import { Component } from "./Component";
import { RectCollider } from "./Collider";
import { Camera } from "./CameraUtility";
export declare abstract class Draggable {
    onDrag(delta: Vector2): void;
}
export declare abstract class Clickable {
    isClicked(mousePos: Vector2): boolean;
}
export declare class DraggableUI extends Component implements Draggable, Clickable {
    rect: RectCollider;
    constructor();
    init(camera: Camera, img: string, surf: any, startX: any, startY: any, width?: number, height?: number): void;
    isClicked(mousePos: Vector2): boolean;
    onDrag(delta: Vector2): void;
}
