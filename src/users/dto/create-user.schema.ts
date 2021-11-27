/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().trim(),
  password: Joi.string().min(6).max(30).required().trim(),
  name: Joi.string().min(2).max(50).required(),
});
