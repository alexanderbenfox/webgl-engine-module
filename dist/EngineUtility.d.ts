export declare class Vector2 {
    protected _x: number;
    protected _y: number;
    constructor(x: number, y: number);
    x: number;
    y: number;
    static zero(): Vector2;
    checkZero(): boolean;
}
export declare class Vector3 extends Vector2 {
    protected _z: number;
    constructor(x: number, y: number, z: number);
    z: number;
    static zero(): Vector3;
    static zAxis(): Vector3;
    static yAxis(): Vector3;
    static xAxis(): Vector3;
    checkZero(): boolean;
    toArray(): number[];
}
export declare class Vector4 extends Vector3 {
    protected _w: number;
    constructor(x: number, y: number, z: number, w: number);
    w: number;
}
export declare function inBounds2D(topLeft: Vector2, bottomRight: Vector2, boundSize: Vector2): boolean;
export declare function computeMatrix(relativeToMatrix: any, outputMatrix: any, position: Vector3, rotation: Vector3): void;
