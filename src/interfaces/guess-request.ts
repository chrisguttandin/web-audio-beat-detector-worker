export interface IGuessRequest {

    id: number;

    method: 'guess';

    params: {

        channelData: Float32Array;

        sampleRate: number;

    };

}
