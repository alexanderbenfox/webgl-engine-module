import { Vector2 } from "../EngineUtility";
import { DrawSurface } from "../Surface";
import { Camera } from "./CameraUtility";
import { Renderer } from "./Component";
export interface Drawable {
    blit(): void;
}
export declare abstract class Renderer2D extends Renderer {
    protected _surface: DrawSurface;
    protected _vertexBuffer: any;
    protected _colorBuffer: any;
    protected _topLeft: Vector2;
    protected _bottomRight: Vector2;
    constructor();
    init(surface: DrawSurface, camera: Camera): void;
    blit(): void;
    update(dt: number): void;
}
export declare class LineRenderer extends Renderer2D implements Drawable {
    protected _points: Float32Array;
    protected _width: number;
    constructor();
    init_renderer(camera: Camera, surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number): void;
    blit(): void;
}
export declare class SquareRenderer extends Renderer2D implements Drawable {
    protected _points: Float32Array;
    protected _width: number;
    constructor();
    init_renderer(camera: Camera, surface: DrawSurface, startCoord: Vector2, endCoord: Vector2, width: number): void;
    blit(): void;
}
