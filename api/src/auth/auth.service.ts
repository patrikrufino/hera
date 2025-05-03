import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any) {
    // Implementar lógica de logout, se necessário (ex.: blacklist de tokens)
    return { message: 'Logout successful' };
  }
}
