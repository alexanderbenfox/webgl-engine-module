import "sylvester";
import { Vector3 } from "../EngineUtility";
import { Component, GameObject } from "./Component";
export declare class Camera extends Component {
    private _time;
    projectionMatrix: any;
    viewProjectionMatrix: any;
    constructor();
    init(gl: WebGLRenderingContext): void;
    update(degree: number): void;
    updatePosition(deltaMovement: Vector3): void;
    updateMatrix(): void;
    updateMatrixLookAt(lookAt: GameObject): void;
    lookAt(cameraPosition: Vector3, targetPosition: Vector3, up: Vector3): any[];
}
