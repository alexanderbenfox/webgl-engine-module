/// <reference path="EngineUtility.d.ts" />
import { Vector2 } from "./EngineUtility";
export declare class ShaderProperties {
    position: GLint;
    texture: GLint;
    resolution: WebGLUniformLocation;
    matrix: WebGLUniformLocation;
    projection: WebGLUniformLocation;
    program: WebGLProgram;
    constructor(position_: GLint, texture_: GLint, resolution_: WebGLUniformLocation, matrix_: WebGLUniformLocation, projection_: WebGLUniformLocation, program_: WebGLProgram);
}
export declare enum ShaderType {
    texture_2d = 0,
    no_texture_2d = 1,
    no_texture3d = 2,
}
export declare module GLUtility {
    function initGL(gl: WebGLRenderingContext, size: Vector2, type: ShaderType): ShaderProperties;
    function initShaders(gl: WebGLRenderingContext, fs_name: string, vs_name: string): ShaderProperties;
    function getShader(gl: WebGLRenderingContext, id: string, type?: any): WebGLShader;
    function getGLContext(canvas: any, opts: any): any;
    function nextPowerOfTwo(n: any): number;
}
