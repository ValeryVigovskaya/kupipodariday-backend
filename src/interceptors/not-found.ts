import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExceptionCustom extends HttpException {
  constructor() {
    super('Запрашиваемый пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
