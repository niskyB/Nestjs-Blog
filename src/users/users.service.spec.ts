import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserRepo: Partial<UserRepository>;
  let users: User[];
  let user: User;

  beforeEach(async () => {
    users = [];

    user = {
      id: 'dsfaf' + Math.floor(Math.random() * 9999),
      username: 'loc05st',
      name: 'hoang loc',
      password: '123456',
      avatarUrl: 'acb',
      role: 'USER',
      isDisabled: false,
      createDate: null,
    } as User;

    fakeUserRepo = {
      find: () => {
        return Promise.resolve(users);
      },
      findOneByField: (field, value) => {
        const user = users.find((user) => (user.username = value));
        return Promise.resolve(user);
      },
      save: (value) => {
        return Promise.resolve(value);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: fakeUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns a response with users list', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
  });

  it('throws error when find user not existed', async () => {
    try {
      await service.findOne('id');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response.statusCode).toBe(404);
      expect(err.response.message).toBe("SORRY we couldn't find that page");
      expect(err.response.error).toBe('Not Found');
    }
  });

  it('returns a response with user data when find user existed', async () => {
    users.push(user);
    const result = await service.findOne('id');
    expect(result).toBeDefined();
  });
});
