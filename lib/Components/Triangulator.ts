//class for building out vertex, normal, and color buffers for generic primitives
import {Vector3, polygonDecompose} from "../EngineUtility"
import {Color} from "../../node_modules/color-ts"

export class buffers{
    public normals : number[]
    public indicies : number[]
	public verts : number[]
	public colors : Color[]
    public texCoords : number[]
    
    constructor(){
        this.normals = [];
        this.indicies = [];
        this.verts = [];
        this.colors = [];
        this.texCoords = [];
    }
}

export class Triangulator {
    static MakeTriangle(buffer : buffers, a : Vector3, b : Vector3, c : Vector3, color : Color){
        let normal : Vector3;
        let d1 = a.sub(b);
        let d2 = b.sub(c);
        normal = d1.cross(d2);
        normal = normal.normalize();

        //add vertex in order
        buffer.verts = buffer.verts.concat(a.toArray(), b.toArray(), c.toArray());

        buffer.indicies.push(buffer.indicies.length);
        buffer.indicies.push(buffer.indicies.length);
        buffer.indicies.push(buffer.indicies.length);

        buffer.normals = buffer.normals.concat(normal.toArray(), normal.toArray(), normal.toArray());

        buffer.colors = buffer.colors.concat(color);

        buffer.texCoords.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }

    static MakeQuad(buffer : buffers, a : Vector3, b : Vector3, c : Vector3, d : Vector3, color : Color){
        this.MakeTriangle(buffer, c, b, a, color);
        this.MakeTriangle(buffer, a, d, c, color);
    }

    static MakeCube(buffer : buffers, size : Vector3, position : Vector3, color : Color){
        //cube position is defined by the center of the cube
        //make the corners of the cube from there
        //here z is depth, y is up
        let x1 = position.x - size.x / 2;
        let x2 = position.x + size.x / 2;
        let y1 = position.y - size.y / 2;
        let y2 = position.y + size.y / 2;
        let z1 = position.z - size.z / 2;
        let z2 = position.z + size.z / 2;

        //build the bottom front corners
        let c1 = new Vector3(x1, y1, z1);
        let c2 = new Vector3(x2, y1, z1);

        //bottom back corners
        let c3 = new Vector3(x1, y1, z2);
        let c4 = new Vector3(x2, y1, z2);

        //top front corners
        let c5 = new Vector3(x1, y2, z1);
        let c6 = new Vector3(x2, y2, z1);

        //top back corners
        let c7 = new Vector3(x1, y2, z2);
        let c8 = new Vector3(x2, y2, z2);

        //make quads representing each cube face
        this.MakeQuad(buffer, c1, c2, c4, c3, color);
        this.MakeQuad(buffer, c1, c2, c6, c5, color);
        this.MakeQuad(buffer, c5, c6, c8, c7, color);
        this.MakeQuad(buffer, c4, c3, c7, c8, color);
        this.MakeQuad(buffer, c3, c1, c5, c7, color);
        this.MakeQuad(buffer, c2, c4, c8, c6, color);
    }

    
    static MakeCircle(buffer : buffers, position : Vector3, radius : number, color : Color){
        //decompose into points around the radius of the circle, making a triangle to represent each
        const numSegments = 32;
        for(let i = 0; i < numSegments; i++){
            let theta0 = i/numSegments * 2 * Math.PI;
            let theta1 = (i + 1)/numSegments * 2 * Math.PI;

            let pt1 = new Vector3(Math.cos(theta0) * radius + position.x,
                                    Math.sin(theta0) * radius + position.y, 
                                    position.z);
            let pt2 = new Vector3(Math.cos(theta1) * radius + position.x,
                                    Math.sin(theta1) * radius + position.y,
                                    position.z);

            this.MakeTriangle(buffer, pt1, pt2, position, color);
        }
    }

    static MakeCylinder(buffer : buffers, position : Vector3, radiusBottom : number, radiusTop : number, height : number, color : Color){
        const numSegments = 32;
        for(let i = 0; i < numSegments; i++){
            let theta0 = i/numSegments * 2 * Math.PI;
            let theta1 = (i + 1)/numSegments * 2 * Math.PI;

            let pt1 = new Vector3(Math.cos(theta0) * radiusBottom + position.x,
                                    Math.sin(theta0) * radiusBottom + position.y, 
                                    position.z);
            let pt2 = new Vector3(Math.cos(theta1) * radiusBottom + position.x,
                                    Math.sin(theta1) * radiusBottom + position.y,
                                    position.z);
            let pt3 = new Vector3(Math.cos(theta0) * radiusTop + position.x,
                                    Math.sin(theta0) * radiusTop + position.y, 
                                    position.z + height);
            let pt4 = new Vector3(Math.cos(theta1) * radiusTop + position.x,
                                    Math.sin(theta1) * radiusTop + position.y,
                                    position.z + height);

            this.MakeQuad(buffer, pt1, pt3, pt4, pt2, color);
        }
    }

    //when making rings, make sure they are added in counter clockwise fashion
    static MakePolygon(buffer : buffers, position : Vector3, rings : Vector3[][], color : Color){
        let points : Vector3[];
        for(let i = 0; i < rings.length; i++){
            let convex = polygonDecompose(rings[i]);
            if (convex.length % 3 == 0){
                for(let j = 0; j < convex.length; j+=3)
                {
                    this.MakeTriangle(buffer, convex[j], convex[j+1], convex[j+2], color);
                }
            }
        }
    }

    static MakeDome(buffer : buffers, position : Vector3, radius : number, height : number, upsideDown : boolean, color : Color){
        //make rings out of cylinders to build dome
        const numSegments = 24/2;
        const startAngle = upsideDown ?  3/2 * Math.PI : 0;
        const endAngle = upsideDown ? 2 * Math.PI : Math.PI/2;

        for(let i = 0; i < numSegments; i++){
            //build quarter of circle, if upsideDown 
            const theta0 = startAngle + i/numSegments * (endAngle - startAngle);
            const theta1 = startAngle + (i + 1)/numSegments * (endAngle - startAngle);

            const radiusBottom = Math.cos(theta0) * radius;
            const radiusTop = Math.cos(theta1) * radius;

            const segmentHeight = (Math.sin(theta1) - Math.sin(theta0))*height;
            const ringPosition = new Vector3(position.x, position.y, position.z + Math.sin(theta0)*height);

            this.MakeCylinder(buffer, ringPosition, radiusBottom, radiusTop, segmentHeight, color); 
        }
    }

    static MakeSphere(buffer : buffers, position : Vector3, radius : number, height : number, color : Color){
        this.MakeDome(buffer, position, radius, height/2, false, color);
        this.MakeDome(buffer, position, radius, height/2, true, color);
    }

    static MakePyramid(buffer : buffers, position : Vector3, rings : Vector3[][], height: number, color : Color){
        rings.forEach((polygon) => {
            for(let i = 0; i < polygon.length - 1; i++){
                const point1 = new Vector3(position.x + polygon[i].x, position.y + polygon[i].y, position.z + polygon[i].z);
                const point2 = new Vector3(position.x + polygon[i + 1].x, position.y + polygon[i + 1].y, position.z + polygon[i + 1].z)
                const point3 = new Vector3(position.x, position.y, position.z + height);
                this.MakeTriangle(buffer, point1, point2, point3, color);
            }
        });
    }
}

//this to consider
//define angle vector as pitch, roll, yaw
//should this transformation be applied after the shape is created?? yeah probably