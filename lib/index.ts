import * as Prog from "./Program";
import {testFunction} from "./Components/Component"
var gameProgram;

export function startProgram(){

	gameProgram = new Prog.Program();
}

(<any>window).starter = function(){
	testFunction();
	console.log("Ran tests");
	gameProgram = new Prog.Program();
};

(<any>window).setCameraValue = function(value : number){
	gameProgram.setCameraValue(value);
};

(<any>window).addGameObject = () =>{
	gameProgram.addGameObject();
};