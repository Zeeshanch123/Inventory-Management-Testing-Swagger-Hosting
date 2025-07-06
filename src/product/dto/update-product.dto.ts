import {
    IsOptional,
    IsString,
    IsBoolean,
    IsInt,
    Min,
    IsNumber,
  } from 'class-validator';
  
  export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsBoolean()
    in_stock?: boolean;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    quantity?: number;
  
    @IsOptional()
    @Min(1)
    @IsNumber()
    price?: number;
  }
  