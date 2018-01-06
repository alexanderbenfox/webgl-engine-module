import { DrawSurface } from "../Surface";
import { Vector2 } from "../EngineUtility";
export declare class Texture2D {
    size: Vector2;
    surface: DrawSurface;
    buffer: WebGLBuffer;
    coords: Float32Array;
    image: HTMLImageElement;
    texture: WebGLTexture;
    constructor(surface: any, url?: any, width?: any, height?: any);
    createPlaceholderTex(): void;
    onLoad(): void;
    createTexture(canvas: any, index?: any): void;
    canvasFrame(frame: any, drawFunction: any): void;
    loadUrl(url: any): void;
    update(dt: number): void;
    bindTexture(): void;
}
export declare class AnimatedTexture2D extends Texture2D {
    currentFrame: number;
    textures: {
        texture: WebGLTexture;
        frameTime: number;
    }[];
    protected _currentFrameTime: number;
    constructor(surface: any, url: any, width: any, height: any);
    createTexture(canvas: any, index?: any): void;
    onLoad(): void;
    update(dt: number): void;
    bindTexture(): void;
}
