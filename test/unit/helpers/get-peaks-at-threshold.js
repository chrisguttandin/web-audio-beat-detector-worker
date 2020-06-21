import { getPeaksAtThreshold } from '../../../src/helpers/get-peaks-at-threshold';

describe('getPeaksAtThreshold()', () => {
    it('should pick the peak above the threshold', () => {
        const channelData = new Float32Array([0, 0.3, 0.4, 0.3]);
        const threshold = 0.35;
        const sampleRate = 8;

        expect(getPeaksAtThreshold(channelData, threshold, sampleRate)).to.deep.equal([2]);
    });

    it('should only pick peaks with a distance of at least 0.25 seconds', () => {
        const channelData = new Float32Array([0.6, 0.3, 0.4, 0.2, 0.9, 0.1]);
        const threshold = 0.35;
        const sampleRate = 8;

        expect(getPeaksAtThreshold(channelData, threshold, sampleRate)).to.deep.equal([0, 4]);
    });

    it('should wait for the hightest value before picking a peak', () => {
        const channelData = new Float32Array([0.4, 0.5, 0.6, 0.7, 0.2]);
        const threshold = 0.35;
        const sampleRate = 8;

        expect(getPeaksAtThreshold(channelData, threshold, sampleRate)).to.deep.equal([3]);
    });

    it('should pick a peak if it is the last value', () => {
        const channelData = new Float32Array([0.2, 0.3, 0.4]);
        const threshold = 0.35;
        const sampleRate = 8;

        expect(getPeaksAtThreshold(channelData, threshold, sampleRate)).to.deep.equal([2]);
    });
});
