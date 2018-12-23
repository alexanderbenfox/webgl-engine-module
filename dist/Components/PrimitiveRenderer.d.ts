import { Renderer3D } from "../Components/Renderer3D";
import { DrawSurface } from "../Surface";
import { Camera } from "./CameraUtility";
import { buffers } from "../Components/Triangulator";
import { Vector3, Vector4 } from "../EngineUtility";
export declare enum Primitive {
    SPHERE = 0,
    CYLINDER = 1,
    CUBE = 2,
    CONE = 3,
    DOME = 4,
}
export declare class PrimitiveRenderer extends Renderer3D {
    buffer: buffers;
    constructor();
    create(): void;
    createBuffers(type: Primitive, offset: Vector3, size: number): void;
    initVertexBuffer(gl: WebGLRenderingContext): void;
    initColorBuffer(gl: WebGLRenderingContext): void;
    initIndexBuffer(gl: WebGLRenderingContext): void;
    initNormalBuffer(gl: WebGLRenderingContext): void;
    protected init_un(surface: DrawSurface, camera: Camera, url?: any, width?: any, height?: any): void;
    blit(): void;
    assignAttrib(buffer: any, attribLocation: any, components: number): void;
    bindIndexToVerts(): void;
    update(dt: number): void;
    cartesianToHomogeneous(point: Vector3): Vector4;
    homogeneousToCartesian(point: Vector4): Vector3;
}
