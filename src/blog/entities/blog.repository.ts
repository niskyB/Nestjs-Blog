import { RepositoryService } from 'src/utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import { Blog } from './blog.entity';

@EntityRepository(Blog)
export class BlogRepository extends RepositoryService<Blog> {
  public async findOneByField(field: keyof Blog, value: any): Promise<Blog> {
    return await this.createQueryBuilder('blog')
      .where(`blog.${field} = :value`, { value })
      .leftJoinAndSelect('blog.user', 'userId')
      .getOne();
  }
}
