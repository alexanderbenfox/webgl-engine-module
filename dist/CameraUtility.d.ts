import "sylvester";
import { Vector3 } from "./EngineUtility";
import { Shape3D } from "./DrawShapes";
export declare class Camera {
    position: Vector3;
    rotation: Vector3;
    private _time;
    projectionMatrix: any;
    viewProjectionMatrix: any;
    constructor(gl: WebGLRenderingContext);
    update(lookAt: Shape3D, deltaMovement: Vector3): void;
    updateMatrix(): void;
    updateMatrixLookAt(lookAt: Shape3D): void;
    lookAt(cameraPosition: Vector3, targetPosition: Vector3, up: Vector3): any[];
}
