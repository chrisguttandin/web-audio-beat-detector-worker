export const getPeaksAtThreshold = (channelData: Float32Array, threshold: number, sampleRate: number) => {
    const length = channelData.length;
    const peaks = [];

    let lastValueWasAboveThreshold = false;

    for (let i = 0; i < length; i += 1) {
        if (channelData[i] > threshold) {
            lastValueWasAboveThreshold = true;
        } else if (lastValueWasAboveThreshold) {
            lastValueWasAboveThreshold = false;
            peaks.push(i - 1);

            // Skip 0.25 seconds forward to get past this peak.
            i += sampleRate / 4 - 1;
        }
    }

    // Add the last value in the unlikely case it was peak.
    if (lastValueWasAboveThreshold) {
        peaks.push(length - 1);
    }

    return peaks;
};
