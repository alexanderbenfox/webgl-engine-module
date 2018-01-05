import { Component } from "./Component";
import { Vector2 } from "../EngineUtility";
export declare class Collider extends Component {
}
export declare class Collider2D extends Collider {
    protected _dots: Vector2[];
    constructor();
    readonly dots: Vector2[];
}
export declare class RectCollider extends Collider2D {
    private _size;
    private _rotation;
    constructor();
    init(topLeft: any, size: any): void;
    update(dt: number): void;
    updatePosition(): void;
    updateRotation(): void;
    detectCollision(other: Collider2D): boolean;
    private getProjectionResult(corners_box1, corners_box2, normals);
    detectPoint(other: Vector2): boolean;
    getNormals(): Vector2[];
}
export declare class CircleCollider extends Collider2D {
    radius: number;
    constructor();
    init(radius: number): void;
    update(dt: number): void;
    detectCollision(other: Collider2D): boolean;
}
