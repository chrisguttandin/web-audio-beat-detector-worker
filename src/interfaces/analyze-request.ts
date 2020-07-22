import { ITempoSettings } from './tempo-settings';

export interface IAnalyzeRequest {
    id: number;

    method: 'analyze';

    params: {
        channelData: Float32Array;

        sampleRate: number;

        tempoSettings?: ITempoSettings;
    };
}
