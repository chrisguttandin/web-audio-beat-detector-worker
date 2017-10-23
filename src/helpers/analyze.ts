import { computeTempoBuckets } from './compute-tempo-buckets';

export const analyze = (channelData: Float32Array, sampleRate: number) => {
    const tempoBuckets = computeTempoBuckets(channelData, sampleRate);

    if (tempoBuckets.length === 0) {
        throw new Error('The given channelData does not contain any detectable beats.');
    }

    return tempoBuckets[0].tempo;
};
