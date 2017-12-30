/// <reference path="EngineUtility.d.ts" />
import { Vector2 } from "./EngineUtility";
export declare class ShaderProperties {
    position: GLint;
    texture: GLint;
    resolution: WebGLUniformLocation;
    matrix: WebGLUniformLocation;
    program: WebGLProgram;
    constructor(position_: GLint, texture_: GLint, resolution_: WebGLUniformLocation, matrix_: WebGLUniformLocation, program_: WebGLProgram);
}
export declare module GLUtility {
    function initGL(gl: WebGLRenderingContext, size: Vector2, line: boolean): ShaderProperties;
    function initShaders(gl: WebGLRenderingContext): ShaderProperties;
    function initShaderNoTexture(gl: any): ShaderProperties;
    function getShader(gl: WebGLRenderingContext, id: string, type?: any): WebGLShader;
    function getGLContext(canvas: any, opts: any): any;
    function nextPowerOfTwo(n: any): number;
}
