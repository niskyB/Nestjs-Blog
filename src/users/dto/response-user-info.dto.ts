import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class ResponseUserInfo extends PickType(User, ['username', 'role']) {}
