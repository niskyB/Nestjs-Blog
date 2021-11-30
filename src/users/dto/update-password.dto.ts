import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UpdatePasswordDto extends PickType(User, ['password']) {
  newPassword: string;
  confirmPassword: string;
}
