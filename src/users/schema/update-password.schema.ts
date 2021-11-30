import * as Joi from 'joi';

export const updatePasswordSchema = Joi.object({
  password: Joi.string().required().trim(),
  newPassword: Joi.string().min(6).max(30).required().trim(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')),
});
