import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RequestUser } from 'src/common/decorators/request-user.decorator';
import { IdPipe } from 'src/id/id.pipe';
import { CreateStoreDto } from 'src/store/dto/dto/create-store.dto';
import { UpdateStoreDto } from 'src/store/dto/dto/update-store.dto';
import { StoreService } from 'src/store/services/store/store.service';
import { User } from 'src/users/schema/users.schema';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  async create(
    @Body() createstoreDto: CreateStoreDto,
    @RequestUser() user: User,
  ) {
    const data = await this.storeService.create(createstoreDto, user);

    return { message: 'Store created successfully', data };
  }

  @Get('')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @RequestUser() user: User,
  ) {
    const data = await this.storeService.findAll(user, page, limit);

    return { message: 'Stores listed successfully', data };
  }

  @Get(':storeId')
  async findOne(
    @Param('storeId', IdPipe) storeId: string,
    @RequestUser() user: User,
  ) {
    const data = await this.storeService.findOne(storeId, user);

    return { message: 'Question fetched successfully', data };
  }

  @Patch(':storeId/update')
  async update(
    @Param('storeId', IdPipe) storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @RequestUser() user: User,
  ) {
    const data = await this.storeService.update(storeId, updateStoreDto, user);

    return { message: 'Store details updated successfully', data };
  }

  @Delete(':storeId')
  async delete(
    @Param('storeId', IdPipe) storeId: string,
    @RequestUser() user: User,
  ) {
    await this.storeService.remove(storeId, user);

    return { message: 'Store deleted successfully' };
  }
}
