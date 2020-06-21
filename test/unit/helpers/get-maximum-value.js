import { getMaximumValue } from '../../../src/helpers/get-maximum-value';

describe('getMaximumValue()', () => {
    it('should return 0 be default', () => {
        const channelData = new Float32Array([]);

        expect(getMaximumValue(channelData)).to.equal(0);
    });

    it('should return the maximum value', () => {
        const channelData = new Float32Array([0, 0.4, 0.2, 1, 0.8]);

        expect(getMaximumValue(channelData)).to.equal(1);
    });
});
