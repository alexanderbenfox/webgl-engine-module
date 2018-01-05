import {Vector2, Vector3, inBounds2D} from "../EngineUtility"
import {SpriteRenderer} from "./Sprite"
import {SquareRenderer} from "./Renderer2D"
import {Component} from "./Component"
import {RectCollider} from "./Collider"
import {Camera} from "./CameraUtility"

export abstract class Draggable{
	onDrag(delta : Vector2) : void {}
}

export abstract class Clickable{
	isClicked(mousePos : Vector2) : boolean
	{
		return false;
	}
}

export class DraggableUI extends Component implements Draggable, Clickable{

	rect : RectCollider;

	constructor(){
		super();
	}
	init(camera : Camera, img : string, surf, startX, startY, width? : number, height? : number){

		if(img){
			this.gameObject.renderer = this.AddComponent(SpriteRenderer);
			let spriteRenderer : SpriteRenderer = <SpriteRenderer>this.GetComponent(SpriteRenderer);
			spriteRenderer.init_renderer(camera, surf, img);

			width = spriteRenderer.size.x;
			height = spriteRenderer.size.y;
		}
		else{
			//this.gameObject.renderer = this.AddComponent(SquareRenderer);
			//let squareRenderer : SquareRenderer = <SquareRenderer>this.GetComponent(SquareRenderer);
			//squareRenderer.init_renderer(surface, )
		}

		this.gameObject.transform.position = new Vector3(startX + width/2, startY + height/2, 0);
		this.gameObject.transform.scale = new Vector3(width, height, 0);

		this.gameObject.collider = this.AddComponent(RectCollider);
		this.rect = <RectCollider>this.GetComponent(RectCollider);
		this.rect.init(new Vector2(startX, startY), new Vector2(width, height));
	}

	isClicked(mousePos : Vector2) : boolean {
		return this.rect.detectPoint(mousePos);
	}

	onDrag(delta : Vector2){
		let newX = this.gameObject.transform.position.x + delta.x;
		let newY = this.gameObject.transform.position.y + delta.y;
		this.gameObject.transform.position = new Vector3(newX, newY, 0);
	}

}

