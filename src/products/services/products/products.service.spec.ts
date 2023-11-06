import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from 'src/products/schema/product.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';

const mockProductModel = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('ProductsService', () => {
  let productsService: ProductsService;
  let createProductDto: CreateProductDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);

    createProductDto = {
      name: 'Product Name',
      description: 'Product Description',
      price: 10,
      quantity: 5,
      image: 'https://example.com/image.jpg',
      storeId: 'store123',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      mockProductModel.create.mockResolvedValue({
        _id: 'product123',
        ...createProductDto,
      });
      const result = await productsService.create(createProductDto);

      expect(mockProductModel.create).toHaveBeenCalledWith({
        store: expect.any(Object),
        ...createProductDto,
      });
      expect(result).toEqual({ _id: 'product123', ...createProductDto });
    });
  });

  describe('findAll', () => {
    it('should find all products for a store', async () => {
      const storeId = 'store123';
      const page = 1;
      const limit = 10;
      const records = [{ _id: 'product123', ...createProductDto }];
      const data = [{ _id: 'product123', ...createProductDto }];
      mockProductModel.find.mockResolvedValue(records);

      const result = await productsService.findAll(storeId, page, limit);

      expect(mockProductModel.find).toHaveBeenCalledWith({
        store: expect.any(Object),
      });
      expect(result).toEqual({
        limit,
        page,
        totalPages: 1,
        count: data.length,
        totalCount: records.length,
        data,
      });
    });
  });

  describe('findOne', () => {
    it('should find and return a product', async () => {
      const productId = 'validProductId';
      const productMock = {
        _id: productId,
        name: 'Product 1',
      };

      mockProductModel.findOne.mockResolvedValue(productMock);

      const result = await productsService.findOne(productId);

      expect(result).toEqual(productMock);
      expect(mockProductModel.findOne).toHaveBeenCalledWith({ _id: productId });
    });

    it('should throw NotFoundException if product is not found', async () => {
      const productId = 'invalidProductId';

      mockProductModel.findOne.mockResolvedValue(null);

      try {
        await productsService.findOne(productId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Product Not Found');
      }
    });
  });

  describe('update', () => {
    it('should update and return the updated product', async () => {
      const storeId = 'validStoreId';
      const productId = 'validProductId';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 10,
      };

      mockProductModel.findOneAndUpdate.mockResolvedValue(updateProductDto);

      const result = await productsService.update(
        storeId,
        productId,
        updateProductDto,
      );

      expect(result).toEqual(updateProductDto);
      expect(mockProductModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: productId, store: storeId },
        updateProductDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if product is not found', async () => {
      const storeId = 'validStoreId';
      const productId = 'invalidProductId';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 10,
      };

      mockProductModel.findOneAndUpdate.mockResolvedValue(null);

      try {
        await productsService.update(storeId, productId, updateProductDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Product Not Found');
      }
    });
  });

  describe('remove', () => {
    it('should delete the product', async () => {
      const storeId = 'validStoreId';
      const productId = 'validProductId';

      mockProductModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await productsService.remove(storeId, productId);

      expect(mockProductModel.deleteOne).toHaveBeenCalledWith({
        _id: productId,
        store: storeId,
      });
    });

    it('should throw NotFoundException if product is not found during removal', async () => {
      const storeId = 'validStoreId';
      const productId = 'invalidProductId';

      mockProductModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      try {
        await productsService.remove(storeId, productId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Product not found');
      }
    });
  });

  // You can add more tests for other service methods here.

  describe('findProductsByStore', () => {
    it('should find products by store', async () => {
      const storeId = 'validStoreId';
      const products = [{ name: 'Product 1' }, { name: 'Product 2' }];

      mockProductModel.find.mockResolvedValue(products);

      const result = await productsService.findProductsByStore(storeId);

      expect(result).toEqual(products);
      expect(mockProductModel.find).toHaveBeenCalledWith({ store: storeId });
    });
  });
});
