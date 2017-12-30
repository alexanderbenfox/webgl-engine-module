/// <reference path="Surface.d.ts" />
import { Vector2 } from "./EngineUtility";
import { DrawSurface } from "./Surface";
export interface Drawable {
    blit(): void;
}
export declare abstract class Shape {
    protected _surface: DrawSurface;
    protected _vertexBuffer: any;
    protected _colorBuffer: any;
    protected _points: Float32Array;
    protected _width: number;
    constructor(surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number);
    blit(): void;
}
export declare class Stroke extends Shape implements Drawable {
    constructor(surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number);
    blit(): void;
}
export declare class Square extends Shape implements Drawable {
    constructor(surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number);
    blit(): void;
}
