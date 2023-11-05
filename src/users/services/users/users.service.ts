import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/schema/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    await this.throwIfUserExists(createUserDto.email);

    const user: User = {
      _id: new Types.ObjectId(),
      ...createUserDto,
    };

    const newUser = await this.userModel.create(user);
    newUser.save();
  }

  async findOne(user: User) {
    return this.userModel
      .findOne({
        _id: user._id,
      })
      .select('-password')
      .then((data) => {
        if (!data) throw new NotFoundException('User Not found');
        return data;
      });
  }

  async throwIfUserExists(email: string) {
    await this.findByEmail(email).then((user) => {
      if (user) throw new ConflictException('User with email already exists');
    });
  }

  async findByEmail(email: string, populatePath = false) {
    return this.userModel
      .findOne({ email: email.toLowerCase() })
      .select(populatePath ? '+password' : undefined);
  }
}
