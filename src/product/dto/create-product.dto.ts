import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  in_stock: boolean;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  supplierId: string;
}
