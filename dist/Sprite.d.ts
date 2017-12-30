import { Vector2 } from "./EngineUtility";
import { DrawSurface } from "./Surface";
export declare class Sprite {
    surface: DrawSurface;
    textures: any[];
    size: Vector2;
    image: HTMLImageElement;
    vertexBuffer: WebGLBuffer;
    textureBuffer: WebGLBuffer;
    textureCoords: Float32Array;
    constructor(surface: any, width: any, height: any, url?: any);
    onLoad(): void;
    createTexture(canvas: any, index?: any): void;
    canvasFrame(frame: any, drawFunction: any): void;
    getFrameCount(): number;
    loadUrl(url: any): void;
    blit(x: any, y: any, frame?: any): void;
}
