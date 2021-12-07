import { RepositoryService } from 'src/utils/repository/repository.service';
import { EntityRepository } from 'typeorm';
import { Blog } from './blog.entity';

@EntityRepository(Blog)
export class BlogRepository extends RepositoryService<Blog> {}
