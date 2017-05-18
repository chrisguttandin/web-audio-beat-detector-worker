import { IAnalyzeResponse, IErrorResponse, IGuessResponse } from '../interfaces';

export type TWorkerMessage = IAnalyzeResponse | IErrorResponse | IGuessResponse;
