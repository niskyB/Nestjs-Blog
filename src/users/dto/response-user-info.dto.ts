import { Expose } from 'class-transformer';
import { UserRole } from '../enum/user.userRole.enum';

export class ResponseUserInfo {
  @Expose()
  username: string;

  @Expose()
  role: UserRole;

  @Expose()
  name: string;
}
