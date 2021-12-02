import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/enum/user.userRole.enum';

export const Roles = (role: UserRole) => SetMetadata('role', role);
