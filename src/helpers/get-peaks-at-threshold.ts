export const getPeaksAtThreshold = (channelData: Float32Array, threshold: number, sampleRate: number) => {
    const peaks = [];

    const length = channelData.length;

    for (let i = 0; i < length; i += 1) {
        if (channelData[i] > threshold) {
            peaks.push(i);

            // Skip 0.25 seconds forward to get past this peak.
            i += (sampleRate / 4) - 1;
        }
    }

    return peaks;
};
