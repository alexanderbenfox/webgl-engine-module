import * as Prog from "./Program";

export function startProgram(){
	let gameProgram = new Prog.Program();
}

(<any>window).starter = function(){
	let gameProgram = new Prog.Program();
};