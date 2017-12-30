//
// Matrix stuff
//
import "sylvester"

export class MatrixStack{
	public stack : any[];
	public matrix : Matrix;

	constructor(){
		this.stack = [];
		this.matrix = Matrix.I(3);
	}

	push_matrix(m : any = false) : void{
		if(m){
			this.stack.push(m.dup());
			this.matrix = m.dup();
		}
		else
		{
			this.stack.push(this.matrix.dup());
		}
	}

	pop_matrix(){
		if(!this.stack.length){
			throw('Can\'t pop from empty stack');
		}

		this.matrix = this.stack.pop();
		return this.matrix;
	}

	rotate(angle, v){
		var radians = angle * Math.PI / 180.0;
		var m = MatrixUtil.matrix_ensure4x4(Matrix.Rotation(radians, $V([v[0], v[1], v[2]])));
		this.matrix = MatrixUtil.matrix_multiply(this.matrix, m);
	}
}

export class MatrixRect{
	public top : number;
	public bottom : number;
	public left : number;
	public right : number;
}



	//static functions

export class MatrixUtil{
	static Translation(v) : Matrix{
		if(v.elements.length == 2){
			let r = Matrix.I(3);
			r.elements[2][0] = v.elements[0];
			r.elements[2][1] = v.elements[1];
			return r;
		}

		if(v.elements.length == 3){
			let r = Matrix.I(4);
			r.elements[0][3] = v.elements[0];
			r.elements[1][3] = v.elements[1];
			r.elements[2][3] = v.elements[2];
			return r;
		}

		throw "Invalid length for Translation";
	}

	static matrix_identity(m : Matrix) : Matrix{
		m = Matrix.I(4);
		return m;
	}

	static matrix_multiply(m1 : Matrix, m2 : Matrix) : Matrix{
		return m1.x(m2);
	}

	static matrix_translate(m, v){
		return this.matrix_multiply(m, MatrixUtil.matrix_ensure4x4(MatrixUtil.Translation($V([v[0], v[1], v[2]]))));
	}

	static transform(out, a, m){
		var x = a[0];
		var y = a[1];
		out[0] = m[0] * x + m[3] * y + m[6];
		out[1] = m[1] * x + m[3] * y + m[7];
		return out;	
	}

	static invert(out, a) {
		var a00 = a[0], a01 = a[1], a02 = a[2]
		var a10 = a[3], a11 = a[4], a12 = a[5]
		var a20 = a[6], a21 = a[7], a22 = a[8]

		var b01 = a22 * a11 - a12 * a21
		var b11 = -a22 * a10 + a12 * a20
		var b21 = a21 * a10 - a11 * a20

		// Calculate the determinant
		var det = a00 * b01 + a01 * b11 + a02 * b21

		if (!det) return null
		det = 1.0 / det

		out[0] = b01 * det
		out[1] = (-a22 * a01 + a02 * a21) * det
		out[2] = (a12 * a01 - a02 * a11) * det
		out[3] = b11 * det
		out[4] = (a22 * a00 - a02 * a20) * det
		out[5] = (-a12 * a00 + a02 * a10) * det
		out[6] = b21 * det
		out[7] = (-a21 * a00 + a01 * a20) * det
		out[8] = (a11 * a00 - a01 * a10) * det

		return out
	}

	static multMatrix(m1, m2){
		return m1.x(m2);
	}

	static Translate(m, v){
		return MatrixUtil.multMatrix(m, MatrixUtil.matrix_ensure4x4(MatrixUtil.Translation($V([v[0], v[1], v[2]]))));
	}

	static vector_flatten(v : Vector)
	{
		return v.elements;
	}

	static matrix_flatten(m : Matrix)
	{
		let result = [];
		if(m.elements.length == 0)
			return [];

		for (let j = 0; j < m.elements[0].length; j++)
		{
	    	for (let i = 0; i < m.elements.length; i++)
	    	{
	        	result.push(m.elements[i][j]);
	    	}
		}

		return result;
	} 

	static matrix_ensure4x4(m : Matrix)
	{
		let e = m.elements;
		if(e.length == 4 && e[0].length == 4)
			return m;
		if(e.length > 4 || e[0].length > 4)
			return null;

		//fill the rest with identity
		for(let i = 0; i < e.length; i++){
			for (let j = e[i].length; j < 4; j++){
				if(i == j)
					e[i].push(1);
				else
					e[i].push(0);
			}
		}

		for(let i = e.length; i < 4; i++){
			let row = [0,0,0,0];
			row[i] = 1;
			e.push(row);
		}

		m.elements = e;
		return m;
	}

	static matrix_make3x3(m : Matrix)
	{
		if(m.elements.length != 4 || m.elements[0].length != 4)
			return null;

		return Matrix.create([[m.elements[0][0], m.elements[0][1], m.elements[0][2]],
	                          [m.elements[1][0], m.elements[1][1], m.elements[1][2]],
	                          [m.elements[2][0], m.elements[2][1], m.elements[2][2]]]);
	}
}
