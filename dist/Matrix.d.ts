/// <reference types="sylvester" />
import "sylvester";
export declare class MatrixStack {
    stack: any[];
    matrix: Matrix;
    constructor();
    push_matrix(m?: any): void;
    pop_matrix(): Matrix;
    rotate(angle: any, v: any): void;
}
export declare class MatrixRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export declare class MatrixUtil {
    static Translation(v: any): Matrix;
    static matrix_identity(m: Matrix): Matrix;
    static matrix_multiply(m1: Matrix, m2: Matrix): Matrix;
    static matrix_translate(m: any, v: any): Matrix;
    static transform(out: any, a: any, m: any): any;
    static invert(out: any, a: any): any;
    static multMatrix(m1: any, m2: any): any;
    static Translate(m: any, v: any): any;
    static vector_flatten(v: Vector): number[];
    static matrix_flatten(m: Matrix): any[];
    static matrix_ensure4x4(m: Matrix): Matrix;
    static matrix_make3x3(m: Matrix): Matrix;
}
