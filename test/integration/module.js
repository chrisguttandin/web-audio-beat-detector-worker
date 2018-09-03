import bpmOffsetData from '../fixtures/bpm-offset-data.json';
import { loadFixtureAsPreparedAudioBuffer } from '../helper/load-fixture';
import tempoData from '../fixtures/tempo-data.json';

describe('module', () => {

    let id;
    let worker;

    beforeEach(() => {
        id = 63;

        worker = new Worker('base/src/module.js');
    });

    describe('analyze', () => {

        let method;

        beforeEach(() => {
            method = 'analyze';
        });

        leche.withData(tempoData, (filename, tempo) => {

            let channelData;
            let sampleRate;

            beforeEach(function (done) {
                this.timeout(30000);

                loadFixtureAsPreparedAudioBuffer(filename, (err, audioBuffer) => {
                    expect(err).to.be.null;

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;

                    done();
                });
            });

            it('should analyze the tempo from the given channelData', function (done) {
                this.timeout(30000);

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
                    method,
                    params: {
                        channelData,
                        sampleRate
                    }
                }, [
                    channelData.buffer
                ]);
            });

        });

        describe('with a file without detectable beats', () => {

            let channelData;
            let sampleRate;

            beforeEach(function (done) {
                this.timeout(30000);

                loadFixtureAsPreparedAudioBuffer('tombo-piano.wav', (err, audioBuffer) => {
                    expect(err).to.be.null;

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;

                    done();
                });
            });

            it('should return an error', function (done) {
                this.timeout(30000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            message: 'The given channelData does not contain any detectable beats.'
                        },
                        id,
                        result: null
                    });

                    done();
                });

                worker.postMessage({
                    id,
                    method,
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

    describe('guess', () => {

        let method;

        beforeEach(() => {
            method = 'guess';
        });

        leche.withData(bpmOffsetData, (filename, bpm, offset) => {

            let channelData;
            let sampleRate;

            beforeEach(function (done) {
                this.timeout(30000);

                loadFixtureAsPreparedAudioBuffer(filename, (err, audioBuffer) => {
                    expect(err).to.be.null;

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;

                    done();
                });
            });

            it('should guess the bpm and the offset from the given channelData', function (done) {
                this.timeout(30000);

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
                    method,
                    params: {
                        channelData,
                        sampleRate
                    }
                }, [
                    channelData.buffer
                ]);
            });

        });

        describe('with a file without detectable beats', () => {

            let channelData;
            let sampleRate;

            beforeEach(function (done) {
                this.timeout(30000);

                loadFixtureAsPreparedAudioBuffer('tombo-piano.wav', (err, audioBuffer) => {
                    expect(err).to.be.null;

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;

                    done();
                });
            });

            it('should return an error', function (done) {
                this.timeout(30000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            message: 'The given channelData does not contain any detectable beats.'
                        },
                        id,
                        result: null
                    });

                    done();
                });

                worker.postMessage({
                    id,
                    method,
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

});
