import { ITempoBucket } from '../interfaces';
import { countIntervalsBetweenNearbyPeaks } from './count-intervals-between-nearby-peaks';
import { getMaximumValue } from './get-maximum-value';
import { getPeaksAtThreshold } from './get-peaks-at-threshold';
import { groupNeighborsByTempo } from './group-neighbors-by-tempo';

const MINUMUM_NUMBER_OF_PEAKS = 30;

export const computeTempoBuckets = (channelData: Float32Array, sampleRate: number): ITempoBucket[] => {
    const maximumValue = getMaximumValue(channelData);
    const minimumThreshold = maximumValue * 0.3;

    let peaks: number[] = [];
    let threshold = maximumValue - (maximumValue * 0.05);

    if (maximumValue > 0.25) {
        while (peaks.length < MINUMUM_NUMBER_OF_PEAKS && threshold >= minimumThreshold) {
            peaks = getPeaksAtThreshold(channelData, threshold, sampleRate);
            threshold -= maximumValue * 0.05;
        }
    }

    const intervalBuckets = countIntervalsBetweenNearbyPeaks(peaks);
    const tempoBuckets = groupNeighborsByTempo(intervalBuckets, sampleRate);

    tempoBuckets.sort((a, b) => b.score - a.score);

    return tempoBuckets;
};
