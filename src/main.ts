import './style.css';
import * as PIXI from 'pixi.js';
import {
	Light,
	// CameraOrbitControl,
	LightingEnvironment,
	Camera
} from 'pixi3d/pixi7';
import Box from './box';
import D from './key';
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


const str = `
########
`;

const strArr = str.trim().split(/\n/).map(line => {
	return line.trim().split('');
});

const boxArr:Array<Array<Box>> = [];

for (let z = 0; z < strArr.length; z++)
{
	boxArr[z] = [];
	for (let x = 0; x < strArr[z].length; x++)
	{
		if (strArr[z][x] === '#')
		{
			const box = new Box();
			box.x = x;
			box.z = z;
			app.stage.addChild(box);
			boxArr[z][x] = box;
		}
	}
}

for (let z = 0; z < boxArr.length; z++)
{
	for (let x = 0; x < boxArr[z].length; x++)
	{
		if (boxArr[z][x])
		{
			try {
				if (boxArr[z][x - 1]) {
					boxArr[z][x].left.visible = false;
					boxArr[z][x - 1].right.visible = false;
				}
				if (boxArr[z - 1][x]) {
					boxArr[z][x].forward.visible = false;
					boxArr[z - 1][x].back.visible = false;
				}
			} catch (e) {
				// console.error(e);
			}
			
		}
	}
}

let playerDirection = 0;
let playerX = 0;
let playerZ = 0;

Camera.main.rotationQuaternion.setEulerAngles(0, playerDirection * 90, 0);
Camera.main.x = playerX;
Camera.main.y = -0.5;
Camera.main.z = playerZ;

let isTweening = false;
const runTween = (
	from:number, 
	to:number, 
	onUpdate:(u:{value:number}) => void,
	onComplete:(u:{value:number}) => void
) => {
	if (!isTweening) 
	{
		new TWEEN.Tween({value: from})
			.to({value: to}, 180)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onStart(() => {
				isTweening = true;
			})
			.onUpdate(onUpdate)
			.onComplete(arg => {
				isTweening = false;
				onComplete(arg);
			})
			.start();
	}
};

const calculateDirection = (num:number) => ((num % 4) + 4) % 4;

const checkIfBoxExist = (z:number, x:number) => {
	try {
		return boxArr[z][x];
	} catch (e)
	{
		return false;
	}
}

const moveOnZ = (vz:number) => {
	if (checkIfBoxExist(playerZ + vz, playerX))
		runTween(
			Camera.main.z, 
			Camera.main.z + vz, 
			({value}) => {
				Camera.main.z = value;
			}, 
			({value}) => {
				playerZ = value;
			});
};

const moveOnX = (vx:number) => {
	if (checkIfBoxExist(playerZ, playerX + vx))
		runTween(
			Camera.main.x, 
			Camera.main.x + vx, 
			({value}) => {
				Camera.main.x = value;
			}, 
			({value}) => {
				playerX = value;
			});
};

window.addEventListener("keydown", (e) => {
	switch(e.key)
	{
		case "w":
		case "ArrowUp":
			switch (calculateDirection(playerDirection))
			{
				case 0:
					moveOnZ(1);
				break;
				case 1:
					moveOnX(1);
				break;
				case 2:
					moveOnZ(-1);
				break;
				case 3:
					moveOnX(-1);
				break;
			}
			break;
		case "s":
		case "ArrowDown":
			switch (calculateDirection(playerDirection))
			{
				case 0:
					moveOnZ(-1);
				break;
				case 1:
					moveOnX(-1);
				break;
				case 2:
					moveOnZ(1);
				break;
				case 3:
					moveOnX(1);
				break;
			}
			break;
		case "a":
		case "ArrowLeft":
			runTween(playerDirection, playerDirection + 1, ({value}) => {
				Camera.main.rotationQuaternion.setEulerAngles(0, value * 90, 0);
			}, ({value}) => {
				playerDirection = value;
			});
			break;
		case "d":
		case "ArrowRight":
			runTween(playerDirection, playerDirection - 1, ({value}) => {
				Camera.main.rotationQuaternion.setEulerAngles(0, value * 90, 0);
			}, ({value}) => {
				playerDirection = value;
			});
			break;
	}
});

app.ticker.add(() => {
	TWEEN.update();
	console.log(`z:${playerZ}, x:${playerX}, direction:${calculateDirection(playerDirection)}`);
});
