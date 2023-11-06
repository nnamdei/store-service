import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateStoreDto } from 'src/store/dto/dto/create-store.dto';
import { StoreType } from 'src/store/enums/store-type.enum';
import { User } from 'src/users/schema/users.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Store } from 'src/store/schema/store.schema';
import { Types } from 'mongoose';
import { UpdateStoreDto } from 'src/store/dto/dto/update-store.dto';
const mockStoreModel = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('StoreService', () => {
  let storeService: StoreService;
  describe('StoreService', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          StoreService,
          {
            provide: getModelToken(Store.name),
            useValue: mockStoreModel,
          },
        ],
      }).compile();

      storeService = module.get<StoreService>(StoreService);
    });

    it('should be defined', () => {
      expect(storeService).toBeDefined();
    });

    // Add more test cases for your service methods, e.g., create, findAll, findOne, update, remove, etc.
    it('should create a new store', async () => {
      const createStoreDto: CreateStoreDto = {
        storeName: 'Test Store',
        storeType: StoreType.STORE,
        // Add other properties as needed
      };
      const user: User = {
        _id: new Types.ObjectId(),
      };

      mockStoreModel.create.mockResolvedValueOnce(createStoreDto);

      const result = await storeService.create(createStoreDto, user);

      expect(mockStoreModel.create).toHaveBeenCalledWith({
        user: user._id,
        ...createStoreDto,
      });
      expect(result).toEqual(createStoreDto);
    });

    it('should throw NotFoundException when store is not found', async () => {
      const storeId = 'invalidStoreId';
      const user: User = {
        _id: new Types.ObjectId(),
      };

      mockStoreModel.findOne.mockResolvedValueOnce(null);

      await expect(storeService.findOne(storeId, user)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw ConflictException when a store with the same name already exists', async () => {
      const storeName = 'Existing Store';
      mockStoreModel.findOne.mockResolvedValueOnce({});

      await expect(
        storeService.create(
          { storeName, storeType: StoreType.STORE },
          {} as User,
        ),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should find all stores for a user', async () => {
      const user = { _id: new Types.ObjectId() };
      const page = 1;
      const limit = 10;
      const records = [{}, {}]; // Mock data

      mockStoreModel.find.mockResolvedValue(records);

      const result = await storeService.findAll(user, page, limit);

      expect(result).toEqual({
        limit: limit,
        page: page,
        totalPages: 1, // Mocked data length / limit
        count: 2, // Mocked data length
        totalCount: 2, // Mocked data length
        data: records,
      });
    });
  });

  describe('findOne', () => {
    it('should find a single store for a user', async () => {
      const user = { _id: new Types.ObjectId() };
      const storeId = new Types.ObjectId();
      const store = { _id: storeId, user: user._id }; // Mock data

      mockStoreModel.findOne.mockResolvedValue(store);

      const result = await storeService.findOne(storeId.toString(), user);

      expect(result).toEqual(store);
    });

    it('should throw NotFoundException when store is not found', async () => {
      const user = { _id: new Types.ObjectId() };
      const storeId = new Types.ObjectId();

      mockStoreModel.findOne.mockResolvedValue(null);

      await expect(
        storeService.findOne(storeId.toString(), user),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a store', async () => {
      const storeId = 'store_id';
      const updateStoreDto: UpdateStoreDto = {
        storeDescription: 'New Store Name',
        storeAddress: 'Abc adress',
      };
      const user = { _id: new Types.ObjectId() };

      mockStoreModel.findOneAndUpdate.mockResolvedValue({
        storeName: 'New Store Name',
        storeType: StoreType.STORE,
      });

      const result = await storeService.update(storeId, updateStoreDto, user);

      expect(result.storeName).toBe(updateStoreDto.storeDescription);
      expect(result.storeType).toBe(updateStoreDto.storeAddress);
    });

    it('should handle store not found during update', async () => {
      const storeId = 'non_existent_store_id';
      const updateStoreDto: UpdateStoreDto = {
        storeAddress: 'New Store address',
        storeDescription: 'description',
      };
      const user = { _id: new Types.ObjectId() };

      mockStoreModel.findOneAndUpdate.mockResolvedValue(null);

      expect(async () => {
        await storeService.update(storeId, updateStoreDto, user);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      const storeId = 'store_id';
      const user = { _id: new Types.ObjectId() };

      mockStoreModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(storeService.remove(storeId, user)).resolves.not.toThrow();
    });

    it('should handle store not found during remove', async () => {
      const storeId = 'non_existent_store_id';
      const user = { _id: new Types.ObjectId() };

      mockStoreModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      expect(async () => {
        await storeService.remove(storeId, user);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('findStoresByUser', () => {
    it('should find stores by user', async () => {
      const user = { _id: new Types.ObjectId() };
      const store1 = { storeName: 'Store 1' };
      const store2 = { storeName: 'Store 2' };

      mockStoreModel.find.mockResolvedValue([store1, store2]);

      const result = await storeService.findStoresByUser(user);

      expect(result).toHaveLength(2);
      expect(result[0].storeName).toBe('Store 1');
      expect(result[1].storeName).toBe('Store 2');
    });
  });
});
