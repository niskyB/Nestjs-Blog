import * as Joi from 'joi';
export const createBlogSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  content: Joi.string().min(255),
});
