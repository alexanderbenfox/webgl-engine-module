import { Vector2 } from "./EngineUtility";
import { ShaderProperties, ShaderType } from "./GLUtility";
import { MatrixStack, MatrixRect } from "./Matrix";
export declare class DrawSurface {
    canvas: HTMLCanvasElement;
    matrixStack: MatrixStack;
    size: Vector2;
    gl: WebGLRenderingContext;
    locations: ShaderProperties;
    private _program;
    density: number;
    getMatrix(): any;
    constructor(canvas: HTMLCanvasElement, type: ShaderType);
    resize(size: Vector2): void;
    clear(): void;
    push(): void;
    pop(): void;
    translate(tx: any, ty: any): any;
    rotate(angle: any, v?: any): void;
    getRect(): MatrixRect;
}
