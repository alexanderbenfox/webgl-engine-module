import * as Prog from "./Program";
var gameProgram;

export function startProgram(){
	gameProgram = new Prog.Program();
}

(<any>window).starter = function(){
	gameProgram = new Prog.Program();
};

(<any>window).setCameraValue = function(value : number){
	gameProgram.setCameraValue(value);
};