import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { BlogRepository } from './entities/blog.repository';

@Injectable()
export class BlogService {
  constructor(
    private blogRepository: BlogRepository,
    private userService: UsersService,
  ) {}

  async getAll(id: string) {
    const results = await this.blogRepository.findManyByField('user', id);
    return results;
  }

  async createNewBlog(createBlogDto: CreateBlogDto, userId: string) {
    // check user
    const user = (await this.userService.findOne(userId)).data;

    if (!user) {
      throw new NotFoundException("SORRY we couldn't find that page");
    }

    // create blog instance
    let blog = this.blogRepository.create();
    blog = plainToClass(Blog, createBlogDto);
    blog.user = user;

    // save to database
    return await this.blogRepository.manager.save(blog);
  }
}
