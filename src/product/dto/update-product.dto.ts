import {
    IsOptional,
    IsString,
    IsBoolean,
    IsInt,
    Min,
    IsNumber,
  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
  
  export class UpdateProductDto {
    @ApiProperty({
      description: 'The name of the product (optional)',
      example: 'iPhone 15 Pro Max',
      minLength: 1,
      maxLength: 255,
      required: false
    })
    @IsOptional()
    @IsString()
    name?: string;
  
    @ApiProperty({
      description: 'Detailed description of the product (optional)',
      example: 'Latest iPhone with advanced camera system and A17 Pro chip',
      minLength: 1,
      maxLength: 1000,
      required: false
    })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({
      description: 'Whether the product is currently in stock (optional)',
      example: true,
      required: false
    })
    @IsOptional()
    @IsBoolean()
    in_stock?: boolean;
  
    @ApiProperty({
      description: 'Current quantity of the product in stock (optional)',
      example: 75,
      minimum: 0,
      required: false
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
  
    @ApiProperty({
      description: 'Price of the product in currency units (optional)',
      example: 1199.99,
      minimum: 1,
      required: false
    })
    @IsOptional()
    @Min(1)
    @IsNumber()
    price?: number;
  }
  