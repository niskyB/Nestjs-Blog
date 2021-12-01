import * as Joi from 'joi';

export const loginUserSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required().trim(),
});
