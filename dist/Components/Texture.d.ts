import { DrawSurface } from "../Surface";
import { Vector2, EditorProperty, EditorString } from "../EngineUtility";
import { Renderer } from "./Component";
export declare class Texture2D implements EditorProperty {
    renderer: Renderer;
    size: Vector2;
    surface: DrawSurface;
    buffer: WebGLBuffer;
    coords: Float32Array;
    image: HTMLImageElement;
    texture: WebGLTexture;
    url: EditorString;
    elements: HTMLElement[];
    showEditorProperty(): void;
    changeTexture(url: any, width: any, height: any): void;
    hideEditorProperty(): void;
    constructor(surface: any, renderer: any, url?: any, width?: any, height?: any);
    init(surface: any, renderer: any, url: any, width: any, height: any): void;
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
    constructor(surface: any, renderer: any, url: any, width: any, height: any);
    init(surface: any, renderer: any, url: any, width: any, height: any): void;
    changeTexture(url: any, width: any, height: any): void;
    createTexture(canvas: any, index?: any): void;
    onLoad(): void;
    update(dt: number): void;
    bindTexture(): void;
}
