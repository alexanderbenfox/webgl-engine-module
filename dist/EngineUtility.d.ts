export declare class Vector2 {
    protected _x: number;
    protected _y: number;
    constructor(x: number, y: number);
    readonly x: number;
    readonly y: number;
    static zero(): Vector2;
    checkZero(): boolean;
}
export declare class Vector3 extends Vector2 {
    protected _z: number;
    constructor(x: number, y: number, z: number);
    readonly z: number;
    static zero(): Vector3;
    checkZero(): boolean;
}
export declare function inBounds2D(topLeft: Vector2, bottomRight: Vector2, boundSize: Vector2): boolean;
