import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
