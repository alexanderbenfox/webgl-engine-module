/// <reference path="EngineUtility.d.ts" />
import { Vector2 } from "./EngineUtility";
export declare class ShaderProperties {
    attributes: {
        position: GLint;
        texture: GLint;
        normal: GLint;
    };
    uniforms: {
        resolution: WebGLUniformLocation;
        matrix: WebGLUniformLocation;
        projection: WebGLUniformLocation;
        normal: WebGLUniformLocation;
        light_color: WebGLUniformLocation;
        light_direction: WebGLUniformLocation;
    };
    program: WebGLProgram;
    constructor(attributes: {
        position: GLint;
        texture: GLint;
        normal: GLint;
    }, uniforms: {
        resolution: WebGLUniformLocation;
        matrix: WebGLUniformLocation;
        projection: WebGLUniformLocation;
        normal: WebGLUniformLocation;
        light_color: WebGLUniformLocation;
        light_direction: WebGLUniformLocation;
    }, program: WebGLProgram);
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
