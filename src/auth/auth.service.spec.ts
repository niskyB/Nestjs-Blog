import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  let testCreateUserDto: CreateUserDto;
  let users: User[];
  let fakeUser: User;

  beforeEach(async () => {
    users = [];
    fakeUserService = {
      findOneByField: (field, value) => {
        const user = users.find((user) => (user.username = value));
        return Promise.resolve(user);
      },
      createNewUser: (createUserDto) => {
        const user = {
          id: 'dsfaf' + Math.floor(Math.random() * 9999),
          username: createUserDto.username,
          name: createUserDto.name,
          password: createUserDto.password,
          avatarUrl: 'acb',
          role: 'USER',
          isDisabled: false,
          createDate: null,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    testCreateUserDto = {
      username: 'loc06st',
      password: '123456',
      confirmPassword: '123456',
      name: 'hoang loc',
    } as CreateUserDto;

    fakeUser = {
      id: 'dsfaf' + Math.floor(Math.random() * 9999),
      username: testCreateUserDto.username,
      name: testCreateUserDto.name,
      password: testCreateUserDto.password,
      avatarUrl: 'acb',
      role: 'USER',
      isDisabled: false,
      createDate: null,
    } as User;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: () => {
            return new JwtService({ secret: process.env.JWT_SECRET });
          },
        },
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws error when create new user with existed username', async () => {
    await service.create(testCreateUserDto);
    try {
      await service.create(testCreateUserDto);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe('username has already existed');
      expect(err.response.error).toBe('Bad Request');
    }
  });

  it('throws error when create new user with wrong confirmPassword', async () => {
    testCreateUserDto.confirmPassword = '1234567';
    fakeUserService.findOneByField = () => null;
    try {
      await service.create(testCreateUserDto);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe(
        'password and confirm password are not correct',
      );
      expect(err.response.error).toBe('Bad Request');
    }
  });

  it('returns a user if correct fields are provided', async () => {
    fakeUserService.findOneByField = () => null;
    const user = await service.create(testCreateUserDto);
    expect(user).toBeDefined();
  });

  it('throws error when login with wrong password', async () => {
    try {
      await service.login({
        username: testCreateUserDto.username,
        password: '123',
      });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe('username or password is not correct');
      expect(err.response.error).toBe('Bad Request');
    }
  });

  it('throws error when login with wrong username', async () => {
    try {
      await service.login({
        username: testCreateUserDto.username + 'asc',
        password: '123456',
      });
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe('username or password is not correct');
      expect(err.response.error).toBe('Bad Request');
    }
  });

  it('returns a user if login with correct fields', async () => {
    await service.create(testCreateUserDto);
    const user = await service.login({
      username: testCreateUserDto.username,
      password: '123456',
    });
    expect(user).toBeDefined();
  });
});
