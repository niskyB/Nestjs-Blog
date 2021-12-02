import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserRole } from 'src/users/enum/user.userRole.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const role = this.reflector.get<UserRole>('role', context.getHandler());
    const authToken = req.cookies['auth-user-token'] || '';
    // check token
    if (!authToken) {
      throw new UnauthorizedException('Not login yet.');
    }
    req.currentUser = this.authService.getUserByToken(authToken);
    //check role
    if (role === UserRole.ADMIN && req.currentUser.role !== UserRole.ADMIN) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }
    return true;
  }
}
