import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictExceptionCustom extends HttpException {
  constructor() {
    super(
      'Пользователь с таким email или username уже зарегистрирован',
      HttpStatus.CONFLICT,
    );
  }
}
