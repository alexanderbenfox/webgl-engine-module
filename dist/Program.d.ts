import { DrawSurface } from "./Surface";
export declare class Program {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    surface_texobjects_2d: DrawSurface;
    surface_shapes_2d: DrawSurface;
    surface_shapes_3d: DrawSurface;
    lastUpdateTime: number;
    constructor();
    createGameObjects(): void;
    createEditorObjects(): void;
    setupGrid(): void;
    assignPageEvents(): void;
    updateLoop(): void;
    update(dt: number): void;
    draw(): void;
    drawScene(): void;
}
