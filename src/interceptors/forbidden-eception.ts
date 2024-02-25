import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptionCustom extends HttpException {
  constructor() {
    super(
      'Запрашиваемый подарок создан другим пользователем',
      HttpStatus.FORBIDDEN,
    );
  }
}
