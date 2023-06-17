import './style.css';
import * as PIXI from 'pixi.js';
import {
	Light,
	CameraOrbitControl,
	LightingEnvironment,
	Camera
} from 'pixi3d/pixi7';
import Box from './box';
import D from './key';
import {Map, RoomType} from './map';
import {Player} from './player';
import * as TWEEN from '@tweenjs/tween.js';

const app = new PIXI.Application<HTMLCanvasElement>({ 
	resizeTo: window, 
	backgroundColor: 0xcccccc, 
	antialias: true
});

document.body.appendChild(app.view);

D();

// let control = new CameraOrbitControl(app.view);

let light1 = new Light()
light1.position.set(0, 3, 0);
LightingEnvironment.main.lights.push(light1);

let light2 = new Light()
light2.position.set(2, 3, 2);
LightingEnvironment.main.lights.push(light2);

let light3 = new Light()
light3.position.set(7, 3, 7);
LightingEnvironment.main.lights.push(light3);


const map = new Map(`
	########
	#-#--#-#
	#-#--#-#
	######--
	###?##--
	-##--#--
	--------
	-#------
`);

map.forEach((z, x, room) => {
	if (room)
	{
		const box = new Box();
		box.x = x;
		box.z = z;
		app.stage.addChild(box);

		if (map.getRoom(z, x - 1)) {
			box.left.visible = false;
		}
		if (map.getRoom(z, x + 1)) {
			box.right.visible = false;
		}
		if (map.getRoom(z - 1, x)) {
			box.forward.visible = false;
		}
		if (map.getRoom(z + 1, x)) {
			box.back.visible = false;
		}
		if (room === RoomType.KEY)
		{
			box.item.visible = true;
		}
	}
});

const player = new Player(map);

Camera.main.rotationQuaternion.setEulerAngles(0, player.direction * 90, 0);
Camera.main.x = player.x;
Camera.main.y = -0.5;
Camera.main.z = player.z;

let isTweening = false;

player.onMove((newZ, newX, oldZ, oldX) => {
	new TWEEN.Tween({z: oldZ, x: oldX})
		.to({z: newZ, x: newX}, 120)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onStart(() => {
			isTweening = true;
		})
		.onUpdate(({z, x}) => {
			Camera.main.z = z;
			Camera.main.x = x;
		})
		.onComplete(() => {
			isTweening = false;
		})
		.start();
});

player.onRotate((newRotation, oldRotation) => {
	new TWEEN.Tween({r: oldRotation})
		.to({r: newRotation}, 200)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onStart(() => {
			isTweening = true;
		})
		.onUpdate(({r}) => {
			Camera.main.rotationQuaternion.setEulerAngles(0, r * 90, 0);
		})
		.onComplete(() => {
			isTweening = false;
		})
		.start();
});

window.addEventListener("keydown", (e) => {
	if (!isTweening)
	{
		switch(e.key)
		{
			case "w":
			case "ArrowUp":
				player.MoveForward();
				break;
			case "s":
			case "ArrowDown":
				player.MoveBackward();
				break;
			case "a":
			case "ArrowLeft":
				player.TurnLeft();
				break;
			case "d":
			case "ArrowRight":
				player.TurnRight();
				break;
		}
	}
});

app.ticker.add(() => {
	TWEEN.update();
	console.log(`z:${player.z}, x:${player.x}, direction:${player.direction}, rotation:${player.rotation}`);
});
