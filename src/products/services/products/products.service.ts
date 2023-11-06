import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { Product, ProductDocument } from 'src/products/schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.findByProductName(createProductDto.name);
    return this.productModel.create({
      store: new Types.ObjectId(createProductDto.storeId),
      ...createProductDto,
    });
  }

  async findAll(storeId: string, page: number, limit: number) {
    const records = await this.findProductsByStore(storeId);

    const data = await this.productModel
      .find(
        {
          store: new Types.ObjectId(storeId),
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

  async findOne(productId: string) {
    return this.productModel
      .findOne({
        _id: new Types.ObjectId(productId),
      })
      .then((product) => {
        if (!product) throw new NotFoundException('Product Not Found');
        return product;
      });
  }

  async update(
    storeId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    return this.productModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(productId),
          store: new Types.ObjectId(storeId),
        },
        updateProductDto,
        { new: true },
      )
      .then((store) => {
        if (!store) throw new NotFoundException('Product Not Found');
        return store;
      });
  }

  async remove(storeId: string, productId: string) {
    await this.productModel
      .deleteOne({
        _id: new Types.ObjectId(productId),
        store: new Types.ObjectId(storeId),
      })
      .then((result) => {
        if (result.deletedCount === 0)
          throw new NotFoundException('Product not found');
      });
  }

  async findProductsByStore(storeId: string) {
    const records = await this.productModel.find({
      store: new Types.ObjectId(storeId),
    });

    return records;
  }

  private async findByProductName(name: string) {
    return this.productModel.findOne({ name: name }).then((product) => {
      if (product)
        throw new ConflictException('Product with this name already exists');
    });
  }
}
