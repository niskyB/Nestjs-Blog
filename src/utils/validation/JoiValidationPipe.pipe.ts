import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object') {
      const { error } = this.schema.validate(value, { abortEarly: false });
      if (error) {
        const errors = error.details.reduce((pre, next) => {
          return {
            ...pre,
            [next.context.label]: next.message,
          };
        }, {});
        throw new BadRequestException(errors);
      }
    }

    return value;
  }
}
