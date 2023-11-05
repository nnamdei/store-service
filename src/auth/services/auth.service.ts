import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/services/config/config.service';
import { User } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = configService.getValue('JWT_SECRET');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findByEmail(
      email.toLowerCase(),
      true,
    );

    // console.log(user);
    if (user && (await this.verifyPassword(user, password))) {
      if (!user._id) {
        throw new HttpException(
          'Your email is not verified',
          HttpStatus.PRECONDITION_REQUIRED,
        );
      }
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = {
      sub: user._id.toString(),
    };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn: '24h',
        secret: this.jwtSecret,
      }),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    await this.usersService.throwIfUserExists(createUserDto.email);
    const user: CreateUserDto = {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: await this.hashPassword(createUserDto.password),
    };
    const data = await this.usersService.create(user);
    return data;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    return user;
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async verifyPassword(user: User, password: string) {
    console.log(password);
    console.log(user.password);
    return bcrypt.compare(password, user.password);
  }
}
