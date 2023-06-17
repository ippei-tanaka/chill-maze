import './style.css';
import * as PIXI from 'pixi.js';
import {
	Light,
	// CameraOrbitControl,
	LightingEnvironment,
	Camera,
	Model
} from 'pixi3d/pixi7';
import Box from './box';
import {Map, RoomType} from './map';
import {Player} from './player';
import {createKeyModel} from './key';
import {createChestModel} from './chest';

import * as TWEEN from '@tweenjs/tween.js';

import { sound } from '@pixi/sound';

const music = sound.add('music', '/sounds/music.ogg');
music.loop = true;
music.volume = 0.8;

const sfx01 = sound.add('sfx01', '/sounds/sfx01.ogg');
const sfx02 = sound.add('sfx02', '/sounds/sfx02.ogg');

const app = new PIXI.Application<HTMLCanvasElement>({ 
	resizeTo: window, 
	backgroundColor: 0xcccccc, 
	antialias: true
});

document.body.appendChild(app.view);

const mapLayouts = [
`
	##?#
	####
	##*#
	#---
`,
`
	######
	#----#
	##*###
	#---##
	#####?
`,
`
	###-###-####
	#-###-#-#--#
	#--#--###--#
	#--#-#--#--?
	#-##-####---
	##-------#########*
	-###-###-#----
	-#-###-####
`
];

async function showStart ()
{
	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 50,
		// fontStyle: 'italic',
		fontWeight: 'bold',
		fill: ['#ffffff'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 500,
		lineJoin: 'round',
		align: 'center'
	});
	
	const richText = new PIXI.Text('Press any key to start', style);
	richText.x = (app.renderer.width - 500) / 2;
	richText.y = (app.renderer.height - 200) / 2;

	const onKeydown = (e) => {
		app.stage.removeChildren();
		window.removeEventListener("keydown", onKeydown);
		init(0);
	};
	window.addEventListener("keydown", onKeydown);
	app.stage.addChild(richText);
}

showStart();

async function init(layoutNumber:number) {
	// let control = new CameraOrbitControl(app.view);

	for (let x = 0; x < 15; x += 3) 
	{
		for (let z = 0; z < 15; z += 3) 
		{
			let light = new Light()
			light.position.set(x, Math.floor(Math.random() * (9 - 3) + 3), z);
			LightingEnvironment.main.lights.push(light);
		}
	}

	music.play();

	const map = new Map(mapLayouts[layoutNumber]);

	const boxes:Array<Array<Box>> = [];
	let keys:Array<Model> = [];
	let chests:Array<Model> = [];
	
	map.forEach(async (z, x, room) => {
		if (room)
		{
			const box = new Box();
			box.x = x;
			box.z = z;
			app.stage.addChild(box);

			if (!boxes[z])
			{
				boxes[z] = [];
			}
			boxes[z][x] = box;

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
				const key = await createKeyModel();
				box.content.addChild(key);
				keys = [...keys, key];
			} 
			else if (room === RoomType.CHEST)
			{
				const chest = await createChestModel();
				box.content.addChild(chest);
				chests = [...chests, chest];
			}
		}
	});
	
	const player = new Player(map);
	
	Camera.main.rotationQuaternion.setEulerAngles(0, player.direction * 90, 0);
	Camera.main.x = player.x;
	Camera.main.y = -0.5;
	Camera.main.z = player.z;
	
	let isTweening = false;
	
	player.onMove = (newZ, newX, oldZ, oldX) => {
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
	};
	
	player.onRotate = (newRotation, oldRotation) => {
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
	};

	player.onGetKey = (z, x) => {
		const key_thumb = PIXI.Sprite.from('./images/key_thumb.png');
		app.stage.addChild(key_thumb);
		key_thumb.x = 20;		
		key_thumb.y = 20;		
		key_thumb.scale = new PIXI.Point(0.5, 0.5);
		const box = boxes[z][x];
		if (box)
		{
			box.content.visible = false;
		}
		sfx01.play();
		// console.log('GOt Key');
	};

	player.onGetChest = () => {
		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 50,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: ['#ffffff', '#ffff99'], // gradient
			stroke: '#4a1850',
			strokeThickness: 5,
			dropShadow: true,
			dropShadowColor: '#000000',
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 500,
			lineJoin: 'round',
			align: 'center'
		});
		
		const richText = new PIXI.Text('You got a tresure!', style);
		richText.x = (app.renderer.width - 500) / 2;
		richText.y = (app.renderer.height - 200) / 2;
		
		app.stage.addChild(richText);
		window.removeEventListener("keydown", onKeydown);
		music.stop();
		sfx02.play();

		setTimeout(() => {
			// console.log(layoutNumber, mapLayouts.length);
			if (layoutNumber < mapLayouts.length - 1)
			{
				app.ticker.remove(onTick);
				app.stage.removeChildren();
				TWEEN.removeAll();
				while (LightingEnvironment.main.lights.length > 0) {
					LightingEnvironment.main.lights.pop()
				}
				init(layoutNumber + 1);
			} else {
				richText.text = "You beat all the levels!\nCongratulations!"
			}
		}, 2000);
	};
	
	const onKeydown = (e) => {
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
	};
	
	window.addEventListener("keydown", onKeydown);
	
	let time = 0;

	const onTick = () => {
		TWEEN.update();
		keys.forEach(key => {
			key.rotationQuaternion.setEulerAngles(time / 2, time, 0);
		});
		time++;

		chests.forEach(chest => {
			chest.rotationQuaternion.setEulerAngles(0, time / 2, 0);
		});
		// console.log(`z:${player.z}, x:${player.x}, direction:${player.direction}, rotation:${player.rotation}`);
	};

	app.ticker.add(onTick);
}