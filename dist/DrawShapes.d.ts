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
export declare abstract class Shape3D implements Drawable {
    surface: DrawSurface;
    protected positions: Float32Array;
    protected colors: Float32Array;
    protected indicies: Uint16Array;
    protected _vertexBuffer: any;
    protected _colorBuffer: any;
    protected _indexBuffer: any;
    constructor(surface: DrawSurface);
    blit(): void;
    update(dt: number): void;
}
export declare class Cube extends Shape3D {
    rotation: number;
    constructor(surface: DrawSurface);
    blit(): void;
    moveCube(modelViewMatrix: any): void;
    assignAttrib(buffer: any, attribLocation: any, components: number): void;
    bindIndexToVerts(): void;
    update(dt: number): void;
}
export declare class Stroke extends Shape implements Drawable {
    constructor(surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number);
    blit(): void;
}
export declare class Square extends Shape implements Drawable {
    constructor(surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number);
    blit(): void;
}
