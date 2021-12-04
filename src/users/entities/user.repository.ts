import { EntityRepository } from 'typeorm';

// -- Enities
import { User } from './user.entity';

// -- Services
import { RepositoryService } from '../../utils/repository/repository.service';
import { CreateUserDto } from '../dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends RepositoryService<User> {
  /**
   *
   *
   * @description create a new user in database
   * @param createUserDto: CreateUserDto
   */
  public async createNewUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.name = createUserDto.name;
    return await this.manager.save(user);
  }
}
