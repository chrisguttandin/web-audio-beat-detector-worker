import { IIntervalBucket, ITempoBucket, ITempoSettings } from '../interfaces';

export const groupNeighborsByTempo = (intervalBuckets: IIntervalBucket[], sampleRate: number, tempoSettings: ITempoSettings = {}) => {
    const minTempo = tempoSettings.minTempo ?? 90;
    const maxTempo = tempoSettings.maxTempo ?? 180;
    const tempoBuckets: ITempoBucket[] = [];

    intervalBuckets.forEach((intervalBucket) => {
        // Convert an interval to a tempo (aka BPM).
        let theoreticalTempo = 60 / (intervalBucket.interval / sampleRate);

        // Adjust the tempo to fit within the min-max (90-180) BPM range.
        while (theoreticalTempo < minTempo) {
            theoreticalTempo *= 2;
        }
        while (theoreticalTempo > maxTempo) {
            theoreticalTempo /= 2;
        }

        let foundTempo = false;
        let score = intervalBucket.peaks.length;

        tempoBuckets.forEach((tempoBucket) => {
            if (tempoBucket.tempo === theoreticalTempo) {
                tempoBucket.score += intervalBucket.peaks.length;
                tempoBucket.peaks = [...tempoBucket.peaks, ...intervalBucket.peaks];

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
