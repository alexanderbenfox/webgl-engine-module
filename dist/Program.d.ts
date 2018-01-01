import { Vector3 } from "./EngineUtility";
import { DrawSurface } from "./Surface";
import { Camera } from "./CameraUtility";
export declare class Program {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    surface_texobjects_2d: DrawSurface;
    surface_shapes_2d: DrawSurface;
    surface_shapes_3d: DrawSurface;
    lastUpdateTime: number;
    camera: Camera;
    positionDelta: Vector3;
    constructor();
    createGameObjects(): void;
    createEditorObjects(): void;
    setupGrid(): void;
    assignPageEvents(): void;
    updateLoop(): void;
    update(dt: number): void;
    draw(): void;
    setCameraValue(value: number): void;
    drawScene(): void;
}
