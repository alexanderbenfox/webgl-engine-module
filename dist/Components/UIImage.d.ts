import { DrawSurface } from "../Surface";
import { Renderer } from "./Component";
export declare class UIImage extends Renderer {
    surface: DrawSurface;
    vertexBuffer: WebGLBuffer;
    textureCoords: Float32Array;
    colorBuffer: WebGLBuffer;
    constructor();
    init_renderer(camera: any, surface: any, url?: any, width?: any, height?: any): void;
    update(dt: number): void;
    blit(): void;
}
