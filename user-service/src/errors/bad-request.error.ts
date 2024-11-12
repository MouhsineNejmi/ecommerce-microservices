import { ValidationError } from 'express-validator';
import { CustomError } from './custom.error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super('Something went wrong!');
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message || 'Something went wrong!' }];
  }
}
