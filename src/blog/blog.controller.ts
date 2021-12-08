import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserGuard } from 'src/auth/guard/auth.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Request } from 'express';
import { JoiValidationPipe } from 'src/utils/validation/JoiValidationPipe.pipe';
import { createBlogSchema } from './schema/create-blog.schema';

@Controller('blogs')
@UseGuards(UserGuard)
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('/all')
  async getAllBlogs(@Req() req: Request) {
    return await this.blogService.getAll(req.currentUser.id);
  }

  /**
   * @description create a new blog
   * @param createBlogDto
   * @param req
   * @returns blog info
   */
  @Post('/newBlog')
  @UsePipes(new JoiValidationPipe(createBlogSchema))
  async createNewBlog(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ) {
    return await this.blogService.createNewBlog(
      createBlogDto,
      req.currentUser.id,
    );
  }

  /**
   * @description disable blog
   * @param id
   * @returns return blog info
   */
  @Put('/:id')
  async disableBlog(@Param('id') id: string, @Req() req: Request) {
    return await this.blogService.disableBlog(id, req.currentUser.id);
  }
}
