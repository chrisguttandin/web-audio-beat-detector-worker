import { IWorkerDefinition } from 'worker-factory';
import { ITempoSettings } from './tempo-settings';

export interface IWebAudioBeatDetectorWorkerCustomDefinition extends IWorkerDefinition {
    analyze: {
        params: {
            channelData: Float32Array;

            sampleRate: number;

            tempoSettings?: ITempoSettings;
        };

        response: {
            result: {
                tempo: number;
            };
        };
    };

    guess: {
        params: {
            channelData: Float32Array;

            sampleRate: number;

            tempoSettings?: ITempoSettings;
        };

        response: {
            result: {
                bpm: number;

                offset: number;

                tempo: number;
            };
        };
    };
}
