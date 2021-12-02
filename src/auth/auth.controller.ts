import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ResponseUserInfo } from 'src/users/dto/response-user-info.dto';
import { createUserSchema } from 'src/users/schema/create-user.schema';
import { loginUserSchema } from 'src/users/schema/login-user.schema';
import { serialize } from 'src/utils/interceptor/serialize.interceptor';
import { JoiValidationPipe } from 'src/utils/validation/JoiValidationPipe.pipe';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description POST method to create a new user in database
   * @param createUserDto
   * @returns response user data if success or error message if fail
   */
  @Post('/signup')
  @serialize(ResponseUserInfo)
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  /**
   * @description POST method to login
   * @param loginUserDto
   * @returns response user data and send jwt to cookie if success or error message if fail
   */
  @Post('/login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginUserDto);
    const token = await this.authService.creatToken(result);
    res.cookie('auth-user-token', token, {
      maxAge: 86400 * 100,
    });
    return result;
  }

  /**
   * @description POST method to delete token in cookie
   * @param res Request
   * @returns success message
   */
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('auth-user-token', '', { maxAge: -999 });
    return 'Logout successful';
  }
}
