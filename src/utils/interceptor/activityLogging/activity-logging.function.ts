import { ILoggerMapper } from "src/common/interface/base.response.interface";
import { Injectable } from "@nestjs/common";
import { Request } from 'express';


@Injectable()
export class LoggingFunctions {  // class related to logging function 

    activityLogHandler(request: Request, payload: string, response: any, invokationRestMethod: string, invokationApiUrl: string, invokationIp: string, invokationUserAgent: string, invokationController: string, invokationMethod: string, completionTime: string, statusCode: number) {
        let loggerMapper = {} as ILoggerMapper;


        loggerMapper.invokationController = invokationController;
        loggerMapper.invokationRestMethod = invokationRestMethod;
        loggerMapper.invokationUserAgent = invokationUserAgent;
        loggerMapper.body = JSON.stringify(payload ?? '');
        loggerMapper.invokationMethod = invokationMethod;
        loggerMapper.invokationApiUrl = invokationApiUrl;
        loggerMapper.completionTime = completionTime;
        loggerMapper.invokationIp = invokationIp;
        loggerMapper.statusCode = statusCode;
    }


}
