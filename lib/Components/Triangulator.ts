//class for building out vertex, normal, and color buffers for generic primitives
import {Vector3, polygonTriangulate} from "../EngineUtility"

class buffers{
    public normals : number[]
	public verts : number[]
	public colors : number[]
	public texCoords : number[]
}

class Triangulator {
    static MakeTriangle(buffer : buffers, a : Vector3, b : Vector3, c : Vector3, color : number){
        let normal : Vector3;
        let d1 = a.sub(b);
        let d2 = b.sub(c);
        normal = d1.cross(d2);
        normal = normal.normalize();

        //add vertex in order
        buffer.verts.concat(a.toArray(), b.toArray(), c.toArray());

        buffer.normals.concat(normal.toArray(), normal.toArray(), normal.toArray());

        buffer.colors.push(color, color, color);

        buffer.texCoords.push(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    }

    static MakeQuad(buffer : buffers, a : Vector3, b : Vector3, c : Vector3, d : Vector3, color : number){
        Triangulator.MakeTriangle(buffer, a, b, c, color);
        Triangulator.MakeTriangle(buffer, c, d, a, color);
    }

    static MakeCube(buffer : buffers, size : Vector3, position : Vector3, color : number){
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
        Triangulator.MakeQuad(buffer, c1, c2, c4, c3, color);
        Triangulator.MakeQuad(buffer, c1, c2, c6, c5, color);
        Triangulator.MakeQuad(buffer, c5, c6, c8, c7, color);
        Triangulator.MakeQuad(buffer, c4, c3, c7, c8, color);
        Triangulator.MakeQuad(buffer, c3, c1, c5, c7, color);
        Triangulator.MakeQuad(buffer, c2, c4, c8, c6, color);
    }

    
    static MakeCircle(buffer : buffers, position : Vector3, radius : number, color : number){
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

            Triangulator.MakeTriangle(buffer, pt1, pt2, position, color);
        }
    }

    //when making rings, make sure they are added in counter clockwise fashion
    static MakePolygon(buffer : buffers, position : Vector3, rings : Vector3[][], color : number){
        let points : Vector3[];
        for(let i = 0; i < rings.length; i++){
            let convex = polygonTriangulate(rings[i]);
            if (convex.length % 3 == 0){
                for(let j = 0; j < convex.length; j+=3)
                {
                    this.MakeTriangle(buffer, convex[j], convex[j+1], convex[j+2], color);
                }
            }
        }
    }

    static MakeSphere(buffer : buffers, position : Vector3, radius : number, color : number){
        
    }

}

//this to consider
//define angle vector as pitch, roll, yaw
//should this transformation be applied after the shape is created?? yeah probably