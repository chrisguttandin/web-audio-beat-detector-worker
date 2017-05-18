import bpmOffsetData from '../fixtures/bpm-offset-data.json';
import { loadFixtureAsPreparedAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('module', () => {

    let id;
    let worker;

    beforeEach(() => {
        id = 63;

        worker = new Worker('base/src/module.ts');
    });

    leche.withData(tempoData, (filename, tempo) => { // eslint-disable-line no-undef

        let channelData;
        let sampleRate;

        beforeEach((done) => {
            loadFixtureAsPreparedAudioBuffer(filename, (err, audioBuffer) => {
                expect(err).to.be.null;

                channelData = audioBuffer.getChannelData(0);
                sampleRate = audioBuffer.sampleRate;

                done();
            });
        });

        it('should analyze the tempo from the given channelData', function (done) {
            this.timeout(5000);

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: null,
                    id,
                    result: { tempo }
                });

                done();
            });

            worker.postMessage({
                id,
                method: 'analyze',
                params: {
                    channelData,
                    sampleRate
                }
            }, [
                channelData.buffer
            ]);
        });

    });

    leche.withData(bpmOffsetData, (filename, bpm, offset) => { // eslint-disable-line no-undef

        let channelData;
        let sampleRate;

        beforeEach((done) => {
            loadFixtureAsPreparedAudioBuffer(filename, (err, audioBuffer) => {
                expect(err).to.be.null;

                channelData = audioBuffer.getChannelData(0);
                sampleRate = audioBuffer.sampleRate;

                done();
            });
        });

        it('should guess the bpm and the offset from the given channelData', function (done) {
            this.timeout(5000);

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: null,
                    id,
                    result: { bpm, offset }
                });

                done();
            });

            worker.postMessage({
                id,
                method: 'guess',
                params: {
                    channelData,
                    sampleRate
                }
            }, [
                channelData.buffer
            ]);
        });

    });

});
