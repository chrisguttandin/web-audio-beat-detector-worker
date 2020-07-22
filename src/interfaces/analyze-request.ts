export interface IAnalyzeRequest {
    id: number;

    method: 'analyze';

    params: {
        channelData: Float32Array;

        maxTempo?: number;

        minTempo?: number;

        sampleRate: number;
    };
}
