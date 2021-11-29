import { BadRequestException, Injectable } from '@nestjs/common';
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

  // create a new user with business requirements
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
      data: { username: result.username, role: result.role },
      details: 'Signup successfully',
    } as ResponseBody<ResponseUserInfo>;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
