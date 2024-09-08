import { IResponseWrapper } from "src/common/interface/base.response.interface";
import { StatusCodes } from "../common/enums/status-codes.enum";
import { Status } from "../common/enums/status.enum";

export function responseHandler<T>(result: Partial<T> | null, message: string, status: Status, statusCode: StatusCodes): IResponseWrapper<T> {
    try {
        const response: IResponseWrapper<T> = {
            statusCode,
            status,
            message,
        };

        if (result !== null) {
            response.result = result;
        }

        return response;
    } catch (error) {
        console.error(error, 'responseHandler')
    }

}