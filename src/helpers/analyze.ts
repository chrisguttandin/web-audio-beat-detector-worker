import { computeTempoBuckets } from './compute-tempo-buckets';

export const analyze = (channelData: Float32Array, sampleRate: number) => {
    const tempoBuckets = computeTempoBuckets(channelData, sampleRate);

    return tempoBuckets[0].tempo;
};
