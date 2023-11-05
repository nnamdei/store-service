import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
@Injectable()
export class IdPipe implements PipeTransform {
  transform(value: any) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID');
    }

    return value;
  }
}
