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

// repository
import { UserRepository } from './entities/user.repository';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

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
  async create(createUserDto: CreateUserDto): Promise<User> {
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
        'password and confirm password are not correct',
      );
    }

    // hash password
    createUserDto.password = await bcrypt.hash(createUserDto.password, SALT);

    // call createNewUser method from repository
    const result = await this.userRepository.createNewUser(createUserDto);

    // return response body object
    return result;
  }
  /**
   * @description check username and password
   * @param loginUserDto
   * @returns Promise of response user info
   */
  async login(loginUserDto: LoginUserDto): Promise<ResponseBody<User>> {
    // check existed user
    const user = await this.userRepository.findOneByField(
      'username',
      loginUserDto.username,
    );
    if (!user) {
      throw new BadRequestException('username or password is not correct');
    }

    // check isDisabled
    if (user.isDisabled) {
      throw new BadRequestException('username or password is not correct');
    }

    // check password
    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new BadRequestException('username or password is not correct');
    }

    return {
      data: user,
      details: 'Signup successfully',
    } as ResponseBody<User>;
  }

  /**
   * @description get all user in database
   * @returns users list
   */
  async findAll(): Promise<ResponseBody<any>> {
    const results = await this.userRepository.find();
    if (results.length === 0) {
      throw new NotFoundException('The users list is empty');
    }
    // return response body object
    return {
      data: { results },
      details: 'Get users successfully',
    } as ResponseBody<any>;
  }

  /**
   * @description find user by given id
   * @param id
   * @returns Promise of response user info
   */
  async findOne(id: string): Promise<ResponseBody<User>> {
    // check existed user or disabled user
    const user = await this.userRepository.findOneByField('id', id);
    if (!user || user.isDisabled) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }
    // return response body object
    return {
      data: user,
      details: 'Get user successfully',
    } as ResponseBody<User>;
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
  async updateName(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // check existed user
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    // assign name
    user.name = updateUserDto.name;

    const result = await this.userRepository.save(user);

    // return response body object
    return result;
  }

  /**
   * @description update password of user
   * @param id
   * @param updatePasswordDto
   */
  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseBody<string>> {
    // check existed user
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    // check password

    if (!(await bcrypt.compare(updatePasswordDto.password, user.password))) {
      throw new BadRequestException('Password is not correct');
    }

    // check new password
    if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'new password and confirm password are not correct',
      );
    }

    // assign new password
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, SALT);

    // save to db
    await this.userRepository.save(user);

    // return response body object
    return {
      details: 'Update successfully',
    } as ResponseBody<string>;
  }

  /**
   * @description update isDisabled of user to true
   * @param id
   */
  async banish(id: string): Promise<ResponseBody<string>> {
    // check existed user
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    user.isDisabled = true;

    // save to db
    await this.userRepository.save(user);

    // return response body object
    return {
      details: 'Banish successfully',
    } as ResponseBody<string>;
  }
}
