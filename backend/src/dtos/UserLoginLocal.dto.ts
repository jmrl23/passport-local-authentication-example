import { vendors } from '@jmrl23/express-helper';

export class UserLoginLocalDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  username: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  password: string;
}
