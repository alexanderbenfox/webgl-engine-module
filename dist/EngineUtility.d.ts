export interface EditorProperty {
    elements: HTMLElement[];
    showEditorProperty(): void;
    hideEditorProperty(): void;
}
export declare class Vector2 implements EditorProperty {
    protected _x: number;
    protected _y: number;
    elements: HTMLElement[];
    constructor(x: number, y: number);
    x: number;
    y: number;
    static zero(): Vector2;
    checkZero(): boolean;
    cross(b: Vector2): Vector2;
    dot(b: Vector2): number;
    add(b: Vector2): Vector2;
    sub(b: Vector2): Vector2;
    magnitude(): number;
    normalize(): Vector2;
    static getMinMaxProjections(vectors: Vector2[], axis: Vector2): any;
    showEditorProperty(): void;
    hideEditorProperty(): void;
}
export declare class Vector3 extends Vector2 implements EditorProperty {
    protected _z: number;
    constructor(x: number, y: number, z: number);
    z: number;
    static zero(): Vector3;
    static zAxis(): Vector3;
    static yAxis(): Vector3;
    static xAxis(): Vector3;
    checkZero(): boolean;
    toArray(): number[];
    add(b: Vector3): Vector3;
    sub(b: Vector3): Vector3;
    cross(b: Vector3): Vector3;
    dot(b: Vector3): number;
    magnitude(): number;
    angleBetween(b: Vector3): number;
    normalize(): Vector3;
    dist(other: Vector3): number;
    showEditorProperty(): void;
}
export declare class Vector4 extends Vector3 {
    protected _w: number;
    constructor(x: number, y: number, z: number, w: number);
    w: number;
    showEditorProperty(): void;
}
export declare class EditorString implements EditorProperty {
    elements: HTMLElement[];
    property: string;
    string: string;
    constructor(property: string, string: string);
    showEditorProperty(): void;
    hideEditorProperty(): void;
}
export declare function inBounds2D(topLeft: Vector2, bottomRight: Vector2, boundSize: Vector2): boolean;
export declare function degreeToRadians(degree: number): number;
export declare function computeMatrix(relativeToMatrix: any, outputMatrix: any, position: Vector3, rotation: Vector3): void;
export declare function polygonDecompose(points: Vector3[]): Vector3[];
