import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  Put,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiValidationPipe } from 'src/utils/validation/JoiValidationPipe.pipe';
import { createUserSchema } from './schema/create-user.schema';
import { updateUserSchema } from './schema/update-user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer/multerOptions';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { updatePasswordSchema } from './schema/update-password.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @description POST method to create a new user in database
   * @param createUserDto
   * @returns response user data if success or error message if fail
   */
  @Post('/signup')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * @description find user by id
   * @param id
   * @returns response user data if success or error message if fail
   */
  @Get('/:id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOne(id);
  }

  /**
   * @description PUT method to change user info
   * @param id of user
   * @returns successful message or error message
   */
  @Put('/profile/avatar/:id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async updateAvatar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar should not be empty');
    }
    return await this.usersService.updateAvatar(id, file);
  }

  /**
   * @description update name of user
   * @param id
   * @param updateUserDto
   * @returns response user data if success or error message if fail
   */
  @Put('/profile/name/:id')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async updateName(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateName(id, updateUserDto);
  }

  /**
   * @description update password of user
   * @param id
   * @param updatePasswordDto
   * @returns success message or error message
   */
  @Put('password/:id')
  @UsePipes(new JoiValidationPipe(updatePasswordSchema))
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  /**
   * @description bannish user
   * @param id
   * @returns success message or error message
   */
  @Put('banishment/:id')
  async banish(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.banish(id);
  }
}
