import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => UsersModule)],
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
  exports: [AuthService],
})
export class AuthModule {}
