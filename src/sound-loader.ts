export type Sound = {
    start: () => {},
    stop: () => {}
}

export const load = async (url:string, volume = 1, loop = false) => 
{
    const context = new AudioContext();
    const audioBuffer = await fetch(url)
        .then(res => res.arrayBuffer())
        .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
    
    let source:AudioBufferSourceNode = null;
    let gainNode:GainNode = null;

    return {

        start () {
            if (source !== null || gainNode !== null)
            {
                source.stop();
                source.disconnect();
                gainNode.disconnect();
            }

            source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = loop;
        
            gainNode = context.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(context.destination);
            
            // now instead of connecting to aCtx.destination, connect to the gainNode
            source.connect(gainNode);
            // source.connect(context.destination);
            source.start();
        },

        stop ()
        {
            if (source !== null || gainNode !== null)
            {
                source.stop();
                source.disconnect();
                gainNode.disconnect();
                source = null;
                gainNode = null;
            }
        }

    } as Sound;
};