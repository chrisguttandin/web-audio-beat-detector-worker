import { IIntervalBucket } from '../interfaces';

export const countIntervalsBetweenNearbyPeaks = (peaks: number[]) => {
    const intervalBuckets: IIntervalBucket[] = [];

    peaks
        .forEach((peak, index) => {
            const length = Math.min(peaks.length - index, 10);

            for (let i = 1; i < length; i += 1) {
                const interval = peaks[index + i] - peak;

                const foundInterval = intervalBuckets.some((intervalBucket) => {
                    if (intervalBucket.interval === interval) {
                        intervalBucket.peaks.push(peak);

                        return true;
                    }

                    return false;
                });

                if (!foundInterval) {
                    intervalBuckets.push({
                        interval,
                        peaks: [ peak ]
                    });
                }
            }
        });

    return intervalBuckets;
};
