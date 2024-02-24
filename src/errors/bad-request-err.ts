import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestExceptionCustom extends HttpException {
  constructor() {
    super('Ошибка валидации переданных значений', HttpStatus.BAD_REQUEST);
  }
}
