import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// -- dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseBody } from 'src/app/interface/api.interface';
import { ResponseUserInfo } from './dto/response-user-info.dto';

// repository
import { UserRepository } from './entities/user.repository';

// rounds of hashing
const SALT = 10;

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  /**
   * @description create user with business requirement
   * @param createUserDto
   * @returns Promise of response user info
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseBody<ResponseUserInfo>> {
    // check existed user
    const user = await this.userRepository.findOneByField(
      'username',
      createUserDto.username,
    );
    if (user) {
      throw new BadRequestException('username has already existed');
    }

    // check password
    if (createUserDto.password != createUserDto.confirmPassword) {
      throw new BadRequestException(
        'password and confirmpassword are not correct',
      );
    }

    // hash password
    createUserDto.password = await bcrypt.hash(createUserDto.password, SALT);

    // call createNewUser method from repository
    const result = await this.userRepository.createNewUser(createUserDto);

    // return response body object
    return {
      data: { username: result.username, role: result.role, name: result.name },
      details: 'Signup successfully',
    } as ResponseBody<ResponseUserInfo>;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  /**
   * @description update avatar of user with the given data
   * @param id
   * @param updateUserDto
   */
  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<ResponseBody<string>> {
    // check existed user
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    // assign file
    if (file) {
      user.avatarUrl = file.filename;
    }

    await this.userRepository.save(user);

    // return response body object
    return {
      data: user.avatarUrl,
      details: 'Update successfully',
    } as ResponseBody<string>;
  }

  /**
   * @description update name of user with the given data
   * @param id
   * @param updateUserDto
   */
  async updateName(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseBody<ResponseUserInfo>> {
    // check existed user
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    // assign name
    user.name = updateUserDto.name;

    await this.userRepository.save(user);

    // return response body object
    return {
      data: { username: user.username, role: user.role, name: user.name },
      details: 'Signup successfully',
    } as ResponseBody<ResponseUserInfo>;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
