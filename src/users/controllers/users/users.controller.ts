import { Controller, Get } from '@nestjs/common';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { User } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUser(@RequestUser() user: User) {
    const data = await this.usersService.findOne(user);

    return {
      message: 'User profile fetched',
      data,
    };
  }
}
