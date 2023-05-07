import Joi from 'joi';
// eslint-disable-next-line import/namespace
import { SignInParams } from '@/services';

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
