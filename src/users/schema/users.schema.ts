import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountType } from '../enums/account-type.enum';
import { AccountStatus } from '../enums/account-status.enum';
import { Store } from 'src/store/schema/store.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    sparse: true,
  })
  email: string;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({ select: false })
  password: string;

  @Prop()
  phone?: string;

  @Prop({ type: String, enum: AccountType, default: AccountType.USER })
  accountType?: AccountType;

  @Prop({ enum: AccountStatus, required: true, default: AccountStatus.ACTIVE })
  accountStatus?: AccountStatus;

  @Prop({ type: Types.ObjectId, ref: 'Store' })
  store?: Store | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
