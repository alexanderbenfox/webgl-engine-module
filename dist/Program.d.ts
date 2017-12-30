import { DrawSurface } from "./Surface";
export declare class Program {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    surface_sprites: DrawSurface;
    surface_lines: DrawSurface;
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
