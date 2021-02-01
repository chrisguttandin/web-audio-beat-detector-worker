export interface IGuessResponse {
    error: null;

    id: number;

    result: {
        bpm: number;

        offset: number;

        tempo: number;
    };
}
