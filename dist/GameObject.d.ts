import { Vector2 } from "./EngineUtility";
import { Sprite } from "./Sprite";
import { DrawSurface } from "./Surface";
export declare abstract class Draggable {
    onDrag(delta: Vector2): void;
}
export declare abstract class Clickable {
    isClicked(mousePos: Vector2): boolean;
}
export declare class Object2D {
    sprite: Sprite;
    pos: Vector2;
    protected _delta: Vector2;
    protected _size: Vector2;
    protected _topLeft: Vector2;
    protected _bottomRight: Vector2;
    constructor(img: string, width: number, height: number, surf: DrawSurface, startX: number, startY: number);
    move(dx: number, dy: number): void;
    update(dt: number): void;
    draw(): void;
    bounds(vec2: Vector2): boolean;
    updateBounds(): void;
}
export declare class EditorObject extends Object2D implements Draggable, Clickable {
    constructor(img: string, width: number, height: number, surf: any, startX: any, startY: any);
    isClicked(mousePos: Vector2): boolean;
    onDrag(delta: Vector2): void;
}
export declare class GameObject extends Object2D {
    constructor(img: string, width: number, height: number, surf: any, startX: any, startY: any);
    update(dt: number): void;
}
