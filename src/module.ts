import { analyze } from './helpers/analyze';
import { guess } from './helpers/guess';
import { IAnalyzeResponse, IBrokerEvent, IErrorResponse, IGuessResponse } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'analyze') {
            const {
                id,
                params: { channelData, sampleRate, tempoSettings }
            } = data;

            const tempo = analyze(channelData, sampleRate, tempoSettings);

            postMessage(<IAnalyzeResponse>{
                error: null,
                id,
                result: { tempo }
            });
        } else if (data.method === 'guess') {
            const {
                id,
                params: { channelData, sampleRate, tempoSettings }
            } = data;

            const { bpm, offset } = guess(channelData, sampleRate, tempoSettings);

            postMessage(<IGuessResponse>{
                error: null,
                id,
                result: { bpm, offset }
            });
        } else {
            throw new Error(`The given method "${(<any>data).method}" is not supported`);
        }
    } catch (err) {
        postMessage(<IErrorResponse>{
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
