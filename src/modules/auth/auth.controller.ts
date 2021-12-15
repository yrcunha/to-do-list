import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: AuthCredentialsDto): Promise<{ acessToken: string }> {
    return this.authService.signIn(body);
  }

  @Post('signout')
  signOut() {
    return;
  }

  @Post('me')
  @UseGuards(AuthGuard())
  me(@Req() req) {
    return req.user;
  }
}
