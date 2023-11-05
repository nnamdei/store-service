import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Store } from 'src/store/schema/store.schema';
import { ProductStatus } from '../enums/product-status.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  _id?: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  quantity: number;

  @Prop()
  image?: string;

  @Prop({
    enum: ProductStatus,
    default: ProductStatus.IN_STOCK,
  })
  status?: ProductStatus;

  @Prop({ type: Types.ObjectId, ref: Store.name, required: true })
  store?: Store;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
