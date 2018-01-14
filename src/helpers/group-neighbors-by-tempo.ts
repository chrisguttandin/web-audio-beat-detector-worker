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

            let foundTempo = false;
            let score = intervalBucket.peaks.length;

            tempoBuckets
                .forEach((tempoBucket) => {
                    if (tempoBucket.tempo === theoreticalTempo) {
                        tempoBucket.score += intervalBucket.peaks.length;
                        tempoBucket.peaks = [ ...tempoBucket.peaks, ...intervalBucket.peaks ];

                        foundTempo = true;
                    }

                    if (tempoBucket.tempo > theoreticalTempo - 0.5 && tempoBucket.tempo < theoreticalTempo + 0.5) {
                        const tempoDifference = Math.abs(tempoBucket.tempo - theoreticalTempo) * 2;

                        score += (1 - tempoDifference) * tempoBucket.peaks.length;
                        tempoBucket.score += (1 - tempoDifference) * intervalBucket.peaks.length;
                    }
                });

            if (!foundTempo) {
                tempoBuckets.push({
                    peaks: intervalBucket.peaks,
                    score,
                    tempo: theoreticalTempo
                });
            }
        });

    return tempoBuckets;
};
