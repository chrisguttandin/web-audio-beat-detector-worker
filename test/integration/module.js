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

        for (const [filename, params, tempo] of tempoData) {
            describe('with a file with detectable beats', () => {
                let channelData;
                let sampleRate;

                beforeEach(async function () {
                    this.timeout(30000);

                    const audioBuffer = await loadFixtureAsPreparedAudioBuffer(filename);

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;
                });

                it('should analyze the tempo from the given channelData', function (done) {
                    this.timeout(30000);

                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            id,
                            result: tempo
                        });

                        done();
                    });

                    worker.postMessage(
                        {
                            id,
                            method,
                            params: {
                                channelData,
                                sampleRate,
                                ...params
                            }
                        },
                        [channelData.buffer]
                    );
                });
            });
        }

        describe('with a file without detectable beats', () => {
            let channelData;
            let sampleRate;

            beforeEach(async function () {
                this.timeout(30000);

                const audioBuffer = await loadFixtureAsPreparedAudioBuffer('tombo-piano.wav');

                channelData = audioBuffer.getChannelData(0);
                sampleRate = audioBuffer.sampleRate;
            });

            it('should return an error', function (done) {
                this.timeout(30000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'The given channelData does not contain any detectable beats.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage(
                    {
                        id,
                        method,
                        params: {
                            channelData,
                            sampleRate
                        }
                    },
                    [channelData.buffer]
                );
            });
        });
    });

    describe('guess', () => {
        let method;

        beforeEach(() => {
            method = 'guess';
        });

        for (const [filename, params, bpm, offset, tempo] of bpmOffsetData) {
            describe('with a file with detectable beats', () => {
                let channelData;
                let sampleRate;

                beforeEach(async function () {
                    this.timeout(30000);

                    const audioBuffer = await loadFixtureAsPreparedAudioBuffer(filename);

                    channelData = audioBuffer.getChannelData(0);
                    sampleRate = audioBuffer.sampleRate;
                });

                it('should guess the bpm, the offset and the tempo from the given channelData', function (done) {
                    this.timeout(30000);

                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            id,
                            result: { bpm, offset, tempo }
                        });

                        done();
                    });

                    worker.postMessage(
                        {
                            id,
                            method,
                            params: {
                                channelData,
                                sampleRate,
                                ...params
                            }
                        },
                        [channelData.buffer]
                    );
                });
            });
        }

        describe('with a file without detectable beats', () => {
            let channelData;
            let sampleRate;

            beforeEach(async function () {
                this.timeout(30000);

                const audioBuffer = await loadFixtureAsPreparedAudioBuffer('tombo-piano.wav');

                channelData = audioBuffer.getChannelData(0);
                sampleRate = audioBuffer.sampleRate;
            });

            it('should return an error', function (done) {
                this.timeout(30000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'The given channelData does not contain any detectable beats.'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage(
                    {
                        id,
                        method,
                        params: {
                            channelData,
                            sampleRate
                        }
                    },
                    [channelData.buffer]
                );
            });
        });
    });
});
