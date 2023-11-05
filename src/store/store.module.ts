import { Module } from '@nestjs/common';
import { StoreService } from './services/store/store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/users.schema';
import { Store, StoreSchema } from './schema/store.schema';
import { StoreController } from './controllers/store/store.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [StoreService],
  exports: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
