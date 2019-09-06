import { OfflineAudioContext } from 'standardized-audio-context';

export const loadFixtureAsPreparedAudioBuffer = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = () => callback('request-failed');
    request.onload = (event) => {
        const arrayBuffer = event.target.response;
        const decodingOfflineAudioContext = new OfflineAudioContext(1, 1, 44100);

        decodingOfflineAudioContext
            .decodeAudioData(arrayBuffer)
            .then((audioBuffer) => {
                const filteringOfflineAudioContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
                const biquadFilter = filteringOfflineAudioContext.createBiquadFilter();
                const bufferSourceNode = filteringOfflineAudioContext.createBufferSource();

                biquadFilter.frequency.value = 240;
                biquadFilter.type = 'lowpass';

                bufferSourceNode.buffer = audioBuffer;

                bufferSourceNode
                    .connect(biquadFilter)
                    .connect(filteringOfflineAudioContext.destination);

                bufferSourceNode.start(0);

                return filteringOfflineAudioContext.startRendering();
            })
            .then((audioBuffer) => callback(null, audioBuffer))
            .catch((err) => callback(err));
    };
    request.open('GET', '/base/test/fixtures/' + fixture);
    request.responseType = 'arraybuffer';

    request.send();
};
