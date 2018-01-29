import { OfflineAudioContext } from 'standardized-audio-context';

const base64ToArrayBuffer = (encodedData) => {
    const decodedData = atob(encodedData.replace(/\s/g, ''));
    const uint8Array = new Uint8Array(decodedData.length);

    Array.prototype.forEach.call(uint8Array, (value, index) => {
        uint8Array[index] = decodedData.charCodeAt(index);
    });

    return uint8Array.buffer;
};

export const loadFixtureAsPreparedAudioBuffer = (fixture, callback) => {
    const request = new XMLHttpRequest();

    request.onerror = () => callback('request-failed');
    request.onload = (event) => {
        const arrayBuffer = event.target.response;
        const offlineAudioContext = new OfflineAudioContext(1, 1, 44100);

        if (fixture.slice(-4) === '.txt') {
            arrayBuffer = base64ToArrayBuffer(arrayBuffer);
        }

        offlineAudioContext
            .decodeAudioData(arrayBuffer)
            .then((audioBuffer) => {
                const offlineAudioContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
                const biquadFilter = offlineAudioContext.createBiquadFilter();
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                biquadFilter.frequency.value = 240;
                biquadFilter.type = 'lowpass';

                bufferSourceNode.buffer = audioBuffer;

                bufferSourceNode
                    .connect(biquadFilter)
                    .connect(offlineAudioContext.destination);

                bufferSourceNode.start(0);

                return offlineAudioContext.startRendering();
            })
            .then((audioBuffer) => callback(null, audioBuffer))
            .catch((err) => callback(err));
    };
    request.open('GET', '/base/test/fixtures/' + fixture);

    if (fixture.slice(-4) !== '.txt') {
        request.responseType = 'arraybuffer';
    }

    request.send();
};
