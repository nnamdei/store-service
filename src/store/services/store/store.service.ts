import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStoreDto } from 'src/store/dto/dto/create-store.dto';
import { UpdateStoreDto } from 'src/store/dto/dto/update-store.dto';
import { Store, StoreDocument } from 'src/store/schema/store.schema';
import { User } from 'src/users/schema/users.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<StoreDocument>,
  ) {}

  async create(createStoreDto: CreateStoreDto, user: User) {
    return this.storeModel.create({
      user: user._id,
      ...createStoreDto,
    });
  }

  async findAll(user: User, page: number, limit: number) {
    const records = await this.findStoresByUser(user);

    const data = await this.storeModel
      .find(
        {
          user: user._id,
        },
        { __v: 0 },
      )
      .skip((page - 1) * limit)
      .limit(limit);

    const result = {
      limit: limit,
      page: page,
      totalPages: Math.ceil(records.length / limit),
      count: data.length,
      totalCount: records.length,
      data,
    };

    return result;
  }

  async findOne(storeId: string, user: User) {
    return this.storeModel
      .findOne({
        _id: new Types.ObjectId(storeId),
        user: user._id,
      })
      .then((store) => {
        if (!store) throw new NotFoundException('Store Not Found');
        return store;
      });
  }

  async update(storeId: string, updateStoreDto: UpdateStoreDto, user: User) {
    return this.storeModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(storeId),
          user: user._id,
        },
        updateStoreDto,
        { new: true },
      )
      .then((store) => {
        if (!store) throw new NotFoundException('Store Not Found');
        return store;
      });
  }

  async remove(storeId: string, user: User) {
    await this.storeModel
      .deleteOne({
        _id: new Types.ObjectId(storeId),
        user: user._id,
      })
      .then((result) => {
        if (result.deletedCount === 0)
          throw new NotFoundException('Store not found');
      });
  }

  private async findStoresByUser(user: User) {
    const records = await this.storeModel.find({
      user: user._id,
    });

    return records;
  }
}
