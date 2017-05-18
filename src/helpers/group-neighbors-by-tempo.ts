import { IIntervalBucket, ITempoBucket } from '../interfaces';

export const groupNeighborsByTempo = (intervalBuckets: IIntervalBucket[], sampleRate: number) => {
    const tempoBuckets: ITempoBucket[] = [];

    intervalBuckets
        .forEach((intervalBucket) => {
            // Convert an interval to a tempo (aka BPM).
            let theoreticalTempo = 60 / (intervalBucket.interval / sampleRate);

            // Adjust the tempo to fit within the 90-180 BPM range.
            while (theoreticalTempo < 90) {
                theoreticalTempo *= 2;
            }
            while (theoreticalTempo > 180) {
                theoreticalTempo /= 2;
            }

            const foundTempo = tempoBuckets.some((tempoCount) => {
                if (tempoCount.tempo === theoreticalTempo) {
                    tempoCount.peaks = [ ...tempoCount.peaks, ...intervalBucket.peaks ];

                    return true;
                }

                return false;
            });

            if (!foundTempo) {
                tempoBuckets.push({
                    peaks: intervalBucket.peaks,
                    tempo: theoreticalTempo
                });
            }
        });

    return tempoBuckets;
};
