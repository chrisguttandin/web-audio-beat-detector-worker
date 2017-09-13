import { ITempoBucket } from '../interfaces';
import { countIntervalsBetweenNearbyPeaks } from './count-intervals-between-nearby-peaks';
import { getPeaksAtThreshold } from './get-peaks-at-threshold';
import { groupNeighborsByTempo } from './group-neighbors-by-tempo';

const INITIAL_THRESHOLD = 0.9;
const MINUMUM_NUMBER_OF_PEAKS = 30;
const MINIMUM_THRESHOLD = 0.3;

export const computeTempoBuckets = (channelData: Float32Array, sampleRate: number): ITempoBucket[] => {
    let peaks: number[] = [];
    let threshold = INITIAL_THRESHOLD;

    while (peaks.length < MINUMUM_NUMBER_OF_PEAKS && threshold >= MINIMUM_THRESHOLD) {
        peaks = getPeaksAtThreshold(channelData, threshold, sampleRate);
        threshold -= 0.05;
    }

    const intervalBuckets = countIntervalsBetweenNearbyPeaks(peaks);
    const tempoBuckets = groupNeighborsByTempo(intervalBuckets, sampleRate);

    tempoBuckets.sort((a, b) => b.peaks.length - a.peaks.length);

    return tempoBuckets;
};
