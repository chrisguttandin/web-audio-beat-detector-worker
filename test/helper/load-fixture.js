import { OfflineAudioContext } from 'standardized-audio-context';

const offlineAudioContext = new OfflineAudioContext(1, 1, 44100);

export const loadFixtureAsPreparedAudioBuffer = (fixture) =>
    fetch(`/base/test/fixtures/${fixture}`)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => offlineAudioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const filteringOfflineAudioContext = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                audioBuffer.length,
                audioBuffer.sampleRate
            );
            const biquadFilter = filteringOfflineAudioContext.createBiquadFilter();
            const bufferSourceNode = filteringOfflineAudioContext.createBufferSource();

            biquadFilter.frequency.value = 240;
            biquadFilter.type = 'lowpass';

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(biquadFilter).connect(filteringOfflineAudioContext.destination);

            bufferSourceNode.start(0);

            return filteringOfflineAudioContext.startRendering();
        });
