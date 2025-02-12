import { TWorkerImplementation, createWorker } from 'worker-factory';
import { analyze } from './helpers/analyze';
import { guess } from './helpers/guess';
import { IWebAudioBeatDetectorWorkerCustomDefinition } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

createWorker<IWebAudioBeatDetectorWorkerCustomDefinition>(self, <TWorkerImplementation<IWebAudioBeatDetectorWorkerCustomDefinition>>{
    analyze: ({ channelData, sampleRate, tempoSettings }) => {
        return { result: analyze(channelData, sampleRate, tempoSettings) };
    },
    guess: ({ channelData, sampleRate, tempoSettings }) => {
        return { result: guess(channelData, sampleRate, tempoSettings) };
    }
});
