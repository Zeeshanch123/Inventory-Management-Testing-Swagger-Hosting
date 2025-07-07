import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'iPhone 15 Pro',
    minLength: 1,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example: 'Latest iPhone with advanced camera system and A17 Pro chip',
    minLength: 1,
    maxLength: 1000
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Whether the product is currently in stock',
    example: true,
    default: true
  })
  @IsBoolean()
  in_stock: boolean;

  @ApiProperty({
    description: 'Current quantity of the product in stock',
    example: 50,
    minimum: 0,
    default: 0
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Price of the product in currency units',
    example: 999.99,
    minimum: 1,
    default: 0
  })
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'UUID of the supplier who provides this product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;
}
