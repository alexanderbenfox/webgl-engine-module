import { DrawSurface } from "../Surface";
import { Renderer } from "./Component";
export declare class SpriteRenderer extends Renderer {
    surface: DrawSurface;
    image: HTMLImageElement;
    vertexBuffer: WebGLBuffer;
    textureBuffer: WebGLBuffer;
    textureCoords: Float32Array;
    protected texture: any;
    constructor();
    init_renderer(camera: any, surface: any, url: any, width?: any, height?: any): void;
    update(dt: number): void;
    onLoad(): void;
    createTexture(canvas: any, index?: any): void;
    canvasFrame(frame: any, drawFunction: any): void;
    loadUrl(url: any): void;
    blit(): void;
}
export declare class AnimatedSprite extends SpriteRenderer {
    currentFrame: number;
    textures: {
        texture: WebGLTexture;
        frameTime: number;
    }[];
    private _currentFrameTime;
    constructor();
    init_renderer(camera: any, surface: any, url: any, width: any, height: any): void;
    createTexture(canvas: any, index?: any): void;
    onLoad(): void;
    update(dt: number): void;
    blit(): void;
}
