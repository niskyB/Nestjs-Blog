import {
  Controller,
  Get,
  Body,
  Param,
  UsePipes,
  Put,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from 'src/utils/validation/JoiValidationPipe.pipe';
import { updateUserSchema } from './schema/update-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer/multerOptions';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { updatePasswordSchema } from './schema/update-password.schema';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from './enum/user.userRole.enum';
import { UserGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';

@Controller('users')
@UseGuards(UserGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description GET method to find all users
   * @returns  response list of user data if success or error message if fail
   */
  @Get('/all')
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * @description GET method to find user by id
   * @returns response user data if success or error message if fail
   */
  @Get()
  async findOne(@Req() req: Request) {
    return await this.usersService.findOne(req.currentUser.id);
  }

  /**
   * @description PUT method to change user info
   * @returns successful message or error message
   */
  @Put('/profile/avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar should not be empty');
    }
    return await this.usersService.updateAvatar(req.currentUser.id, file);
  }

  /**
   * @description PUT method to update name of user
   * @param updateUserDto
   * @returns response user data if success or error message if fail
   */
  @Put('/profile/name')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateName(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return await this.usersService.updateName(
      req.currentUser.id,
      updateUserDto,
    );
  }

  /**
   * @description PUT method to update password of user
   * @param updatePasswordDto
   * @returns success message or error message
   */
  @Put('password')
  @UsePipes(new JoiValidationPipe(updatePasswordSchema))
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    return await this.usersService.updatePassword(
      req.currentUser.id,
      updatePasswordDto,
    );
  }

  /**
   * @description PUT method to bannish user
   * @returns success message or error message
   */
  @Put('banishment/:id')
  @Roles(UserRole.ADMIN)
  async banish(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.banish(id);
  }
}
