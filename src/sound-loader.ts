import * as PIXI from 'pixi.js';
import type { Sound } from '@pixi/sound';

let isInitialized = false;

export const load = async (url:string) => 
{
    if (!isInitialized)
    {
        const PIXI_SOUND = await import('@pixi/sound');
        PIXI.extensions.add({
            extension: PIXI.ExtensionType.LoadParser,
            test: (url) => url.endsWith('ogg'),
            async load(src) {
                return new Promise((resolve) => {
                    resolve(PIXI_SOUND.Sound.from(src));
                });
            }
        });
        isInitialized = true;
    }
    
    return await PIXI.Assets.load<Sound>(url);
};