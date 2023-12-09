import { vendors } from '@jmrl23/express-helper';

export class UserRegisterLocalDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.Matches('^[a-zA-Z0-9_]{4,}[0-9]*$', void 0, {
    message: 'Invalid username',
  })
  username: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.MinLength(5)
  password: string;
}
