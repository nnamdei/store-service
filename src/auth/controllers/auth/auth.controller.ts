import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
     await this.authService.registerUser(registerDto);
    return { message: 'User Registered successfully' };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: User) {
    const data = await this.authService.login(user);

    return { message: 'Login successful', data };
  }
}
