import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserToken } from './entities/user.token';
import { UsersService } from 'src/users/users.service';
// rounds of hashing
const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * @description create user with business requirement
   * @param createUserDto
   * @returns Promise of response user info
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // check existed user
    const user = await this.userService.findOneByField(
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
    const result = await this.userService.createNewUser(createUserDto);

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
    const user = await this.userService.findOneByField(
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

  /**
   * @description generate jwt token with user's info
   * @param user
   * @returns jwt token
   */
  async creatToken(user: User) {
    const payload = {
      ...plainToClass(UserToken, user, {
        excludeExtraneousValues: true,
      }),
    };
    return this.jwtService.sign(payload);
  }

  /**
   * @description get UserToken from token
   * @param authToken
   * @returns UserToken instance
   */
  getUserByToken(authToken: string): UserToken {
    try {
      return this.jwtService.verify<any>(authToken) as UserToken;
    } catch (err) {
      return null;
    }
  }
}
