export class Vector2{
	protected _x : number;
	protected _y : number;
	constructor(x : number, y : number){
		this._x = x;
		this._y = y;
	}
	get x() : number{
		return this._x;
	}
	get y() : number{
		return this._y;
	}

	static zero() : Vector2{
		return new Vector2(0,0);
	}

	checkZero() : boolean{
		return this._x == 0 && this._y == 0;
	}
}

export class Vector3 extends Vector2{
	protected _z : number;
	constructor(x: number, y : number, z : number){
		super(x,y);
		this._z = z;
	}

	get z() : number {
		return this._z;
	}

	static zero() : Vector3{
		return new Vector3(0,0,0);
	}

	checkZero() : boolean{
		return super.checkZero() && this._z == 0;
	}
}

export function inBounds2D(topLeft : Vector2, bottomRight : Vector2, boundSize : Vector2) : boolean{
	if(boundSize.x > topLeft.x && boundSize.x < bottomRight.x){
		if(boundSize.y > topLeft.y && boundSize.y < bottomRight.y)
			return true;
	}
	return false;
}