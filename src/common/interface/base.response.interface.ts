import { StatusCodes } from "../enums/status-codes.enum"
import { Status } from "../enums/status.enum"


export interface IResponseWrapper<T> {
    statusCode: StatusCodes,
    result?: Partial<T>,
    status: Status,
    message: string
}

export interface IValidationError {
    statusCode: StatusCodes,
    status: Status,
    message: string
}


export interface IDecryptWrapper {
    consumerId: number,
    iat: number,
    exp: number
    iss: string,
    sub: string
}

export interface ILoggerMapper {
    consumerId: string,
    body?: string,
    params?: string,
    query?: string,
    invokationRestMethod: string,
    invokationApiUrl: string,
    invokationIp: string,
    invokationUserAgent: string,
    invokationController: string
    invokationMethod: string
    apiMessage?: string;
    completionTime: string,
    statusCode: number
}


export type SelectObject = { [key: string]: SelectObject | true };
