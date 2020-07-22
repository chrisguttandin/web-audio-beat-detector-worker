import { computeTempoBuckets } from './compute-tempo-buckets';

export const analyze = (channelData: Float32Array, sampleRate: number, minTempo = 90, maxTempo = 180) => {
    const tempoBuckets = computeTempoBuckets(channelData, sampleRate, minTempo, maxTempo);

    if (tempoBuckets.length === 0) {
        throw new Error('The given channelData does not contain any detectable beats.');
    }

    return tempoBuckets[0].tempo;
};
