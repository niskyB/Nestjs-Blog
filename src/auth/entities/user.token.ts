import { Expose } from 'class-transformer';
import { UserRole } from 'src/users/enum/user.userRole.enum';

export class UserToken {
  @Expose()
  id: string;

  @Expose()
  role: UserRole;
}
