declare function require(name:string);
import {Vector2,inBounds2D} from "./EngineUtility"
import {Sprite} from "./Sprite"
import {DrawSurface} from "./Surface"
import {GameManager} from "./Control"

export abstract class Draggable{
	onDrag(delta : Vector2) : void {}
}

export abstract class Clickable{
	isClicked(mousePos : Vector2) : boolean
	{
		return false;
	}
}

class AABBRect{
	private _topLeft : Vector2;
	private _size : Vector2;

	constructor(topLeft, size){
		this._topLeft = new Vector2(topLeft.x, topLeft.y);
		this._size = new Vector2(size.x, size.y);
	}

	detectCollision(other : AABBRect) : boolean {
		return this._topLeft.x < other._topLeft.x + other._size.x &&
				this._topLeft.x + this._size.x > other._topLeft.x &&
				this._topLeft.y < other._topLeft.y + other._size.y &&
				this._size.y + this._topLeft.y > other._topLeft.y;

	}
}


export class Object2D{
	public sprite : Sprite;
	public pos : Vector2;
	protected _delta : Vector2;
	protected _size : Vector2;
	protected _topLeft : Vector2;
	protected _bottomRight : Vector2;

	constructor(img : string, width : number, height : number, surf : DrawSurface, startX : number, startY : number){
		if(img)
			this.sprite = new Sprite(surf, width, height, img);
		else
			this.sprite = null;

		this.pos = new Vector2(startX, startY);

		this._delta = Vector2.zero();
		this._size = new Vector2(width, height);

		this._topLeft = new Vector2(startX, startY);
		this._bottomRight = new Vector2((startX + width), (startY + height));
	}

	move(dx :number, dy : number) : void {
		this._delta = new Vector2(dx, dy);
	}

	update(dt : number) : void{
		this.updateBounds();
	}

	draw() : void {
		if(this.sprite)
			this.sprite.blit(this.pos.x - GameManager.camera.pos.x, this.pos.y - GameManager.camera.pos.y);
	}

	bounds(vec2 : Vector2) : boolean{
		return inBounds2D(this._topLeft, this._bottomRight, vec2);
	}

	updateBounds() : void {
		this._topLeft = new Vector2(this.pos.x, this.pos.y);
		this._bottomRight = new Vector2(this.pos.x + this._size.x, this.pos.y + this._size.y);
	}
}

export class EditorObject extends Object2D implements Draggable, Clickable{
	constructor(img : string, width : number, height : number, surf, startX, startY){
		super(img, width, height, surf, startX, startY);
	}

	isClicked(mousePos : Vector2) : boolean {
		return super.bounds(new Vector2(mousePos.x, mousePos.y));
	}

	onDrag(delta : Vector2){
		let newX = this.pos.x + delta.x;
		let newY = this.pos.y + delta.y;
		this.pos = new Vector2(newX, newY);
	}

}

export class GameObject extends Object2D{
	constructor(img : string, width : number, height : number, surf, startX, startY){
		super(img, width, height, surf, startX, startY);
	}

	update(dt : number) : void {
		let newX = this.pos.x + (this._delta.x * dt);
		let newY = this.pos.y + (this._delta.y * dt);
		this.pos = new Vector2(newX, newY);
		super.update(dt);
	}
}

