import { PickType } from '@nestjs/mapped-types';
import { Blog } from '../entities/blog.entity';

export class CreateBlogDto extends PickType(Blog, [
  'title',
  'content',
] as const) {}
