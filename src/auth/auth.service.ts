import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/entities/user.repository';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserToken } from './entities/user.token';
// rounds of hashing
const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

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
  async login(loginUserDto: LoginUserDto): Promise<User> {
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

    return user;
  }

  async creatToken(user: User) {
    const payload = plainToClass(UserToken, user, {
      excludeExtraneousValues: true,
    }) as UserToken;
    return this.jwtService.sign(JSON.stringify(payload));
  }
}
