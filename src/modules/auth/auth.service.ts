import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { JwtPayload } from './dtos/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: AuthCredentialsDto): Promise<void> {
    const { password } = body;

    const encrypted = await bcrypt.hash(password, 10);

    return this.usersService.createUser(
      Object.assign(body, { password: encrypted }),
    );
  }

  async signIn(body: AuthCredentialsDto): Promise<{ acessToken: string }> {
    const { username, password } = body;

    const found = await this.usersService.getUserByUsername(username);

    if (found && (await bcrypt.compare(password, found.password))) {
      const payload: JwtPayload = { username };
      const acessToken = this.jwtService.sign(payload);

      return { acessToken };
    } else {
      throw new UnauthorizedException(`Please check your login credentials`);
    }
  }
}
