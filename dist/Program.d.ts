import { Vector3 } from "./EngineUtility";
import { DrawSurface } from "./Surface";
import { GameObject } from "./Components/Component";
import { Camera } from "./Components/CameraUtility";
export declare class Program {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    surface_ui: DrawSurface;
    surface_world: DrawSurface;
    surface_world_notex: DrawSurface;
    lastUpdateTime: number;
    uiCamera: Camera;
    worldCamera: Camera;
    positionDelta: Vector3;
    storedObject: GameObject;
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
