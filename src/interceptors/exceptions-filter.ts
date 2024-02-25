import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConflictExceptionCustom } from './conflict-eception';
import { BadRequestExceptionCustom } from 'src/errors/bad-request-err';
import { NotFoundExceptionCustom } from './not-found';
import { ForbiddenExceptionCustom } from './forbidden-eception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';

    if (exception instanceof ConflictExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof BadRequestExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof NotFoundExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    if (exception instanceof ForbiddenExceptionCustom) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    // if (exception instanceof Error) {
    //   message = 'Запрашиваемый подарок создан другим пользователем';
    // }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
