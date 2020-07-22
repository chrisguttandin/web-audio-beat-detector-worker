export interface IGuessRequest {
    id: number;

    method: 'guess';

    params: {
        channelData: Float32Array;

        maxTempo?: number;

        minTempo?: number;

        sampleRate: number;
    };
}
