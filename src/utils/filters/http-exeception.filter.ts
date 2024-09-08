import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { StatusCodes } from '../../common/enums/status-codes.enum';
import { responseHandler } from '../../helpers/response-handler';
import { IncomingMessage } from 'http';
import { Response } from 'express';

export const getStatusCode = <T>(exception: T): number => {  // This function takes an argument exception of type T (a generic type).
    try {
        return exception instanceof HttpException   // It returns a number, which represents the HTTP status code.
            ? exception?.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
    } catch (error) {
        console.error(error)
    }
};

export const getErrorMessage = <T>(exception: T): string => { // This function also takes an argument exception of type T (a generic type)
    try {
        if (exception instanceof HttpException) {
            const { message } = exception;
            const response = exception?.getResponse() as ErrorResponse;
            const messageArray = typeof response === 'object' && response?.hasOwnProperty('message') ? response?.message : null;  //we use the typeof operator to check if response is an object and has a message property. If it does, we assign the value of response.message to messageArray. Otherwise, we set messageArray to null

            return Array?.isArray(messageArray) ? messageArray?.join(' and ') : message;  // It returns a string, which represents the error message
        }
        return null;
    } catch (error) {
        console.error(error);
    }
};

@Catch(HttpException) // decorator is used to specify that this filter should be applied when an HttpException is thrown in the application
export class HttpExceptionFilter<T> implements ExceptionFilter { // this filter is used for handling http errors
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host?.switchToHttp();
        const response = ctx?.getResponse<Response>();
        const request = ctx?.getRequest<IncomingMessage>();
        const statusCode = getStatusCode<T>(exception);
        const message = getErrorMessage<T>(exception);

        let ErroResponse = responseHandler(null, message, 0, statusCode == 403 ? StatusCodes.FORBIDDEN : statusCode == 401 ? StatusCodes.UNAUTHORIZED : statusCode == 400 ? StatusCodes.BAD_REQUEST : statusCode);

        response.status(statusCode).json({
            timestamp: new Date().toISOString(),
            path: request?.url,
            ...ErroResponse,
        });
    }
}
