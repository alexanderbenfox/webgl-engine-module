import { Vector3 } from "./EngineUtility";
import { DrawSurface } from "./Surface";
import { Camera } from "./Components/CameraUtility";
export declare class Program {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    surface_texobjects_2d: DrawSurface;
    surface_shapes_2d: DrawSurface;
    surface_shapes_3d: DrawSurface;
    lastUpdateTime: number;
    uiCamera: Camera;
    worldCamera: Camera;
    positionDelta: Vector3;
    constructor();
    createCameras(): void;
    createGameObjects(): void;
    assignPageEvents(): void;
    updateLoop(): void;
    update(dt: number): void;
    render(): void;
    setCameraValue(value: number): void;
    drawScene(): void;
}
