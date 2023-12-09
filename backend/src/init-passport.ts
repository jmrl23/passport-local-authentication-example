import passport from 'passport';
import { UserService } from './services/user.service';

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id: string, done) {
  const userService = await UserService.getInstance();
  const user = await userService.getUserById(id);

  done(null, user);
});
