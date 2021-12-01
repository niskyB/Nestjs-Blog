import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    {
      provide: JwtService,
      useFactory: () => {
        return new JwtService({ secret: process.env.JWT_SECRET });
      },
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
