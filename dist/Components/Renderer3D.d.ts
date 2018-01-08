import { Renderer } from "./Component";
import { Vector3, Vector4 } from "../EngineUtility";
import { DrawSurface } from "../Surface";
import { Camera } from "./CameraUtility";
export interface Drawable {
    blit(): void;
}
export declare abstract class Renderer3D extends Renderer implements Drawable {
    protected positions: Float32Array;
    protected colors: Float32Array;
    protected indicies: Uint16Array;
    protected normals: Float32Array;
    protected _normalBuffer: WebGLBuffer;
    protected _vertexBuffer: WebGLBuffer;
    protected _colorBuffer: WebGLBuffer;
    protected _indexBuffer: WebGLBuffer;
    constructor();
    create(): void;
    protected init_renderer(surface: DrawSurface, camera: Camera): void;
    changeSprite(url: any, width: any, height: any): void;
    blit(): void;
    update(dt: number): void;
}
export declare class SpriteRenderer extends Renderer3D {
    constructor();
    create(): void;
    initVertexBuffer(gl: WebGLRenderingContext): void;
    initColorBuffer(gl: WebGLRenderingContext): void;
    initIndexBuffer(gl: WebGLRenderingContext): void;
    initNormalBuffer(gl: WebGLRenderingContext): void;
    protected init_sprite_renderer(surface: DrawSurface, camera: Camera, url?: any, width?: any, height?: any): void;
    blit(): void;
    assignAttrib(buffer: any, attribLocation: any, components: number): void;
    bindIndexToVerts(): void;
    update(dt: number): void;
    cartesianToHomogeneous(point: Vector3): Vector4;
    homogeneousToCartesian(point: Vector4): Vector3;
}
export declare class CubeRenderer extends Renderer3D {
    constructor();
    create(): void;
    initVertexBuffer(gl: WebGLRenderingContext): void;
    initColorBuffer(gl: WebGLRenderingContext): void;
    initIndexBuffer(gl: WebGLRenderingContext): void;
    initNormalBuffer(gl: WebGLRenderingContext): void;
    protected init_cube_renderer(surface: DrawSurface, camera: Camera, url?: any, width?: any, height?: any): void;
    blit(): void;
    assignAttrib(buffer: any, attribLocation: any, components: number): void;
    bindIndexToVerts(): void;
    update(dt: number): void;
    cartesianToHomogeneous(point: Vector3): Vector4;
    homogeneousToCartesian(point: Vector4): Vector3;
}
