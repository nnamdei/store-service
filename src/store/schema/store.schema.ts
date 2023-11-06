import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountStatus } from 'src/users/enums/account-status.enum';
import { User } from 'src/users/schema/users.schema';
import { StoreType } from '../enums/store-type.enum';

export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true })
export class Store {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  storeName: string;

  @Prop({ enum: StoreType, default: StoreType.STORE })
  storeType: StoreType;

  @Prop({
    default:
      'https://res.cloudinary.com/dietidkln/image/upload/v1581506204/sample.jpg',
  })
  storeBanner?: string;

  @Prop()
  storeDescription?: string;

  @Prop()
  address: string;

  @Prop()
  supportEmail?: string;

  @Prop()
  storePhone?: string;

  @Prop({
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  accountStatus?: AccountStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user?: User;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
