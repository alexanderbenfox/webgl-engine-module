import "sylvester";
import { Vector3 } from "./EngineUtility";
export declare class Camera {
    position: Vector3;
    rotation: Vector3;
    private _time;
    projectionMatrix: any;
    viewProjectionMatrix: any;
    constructor(gl: WebGLRenderingContext);
    update(degree: number): void;
    updateMatrix(): void;
}
