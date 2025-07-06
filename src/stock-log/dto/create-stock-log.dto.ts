import { IsNotEmpty, IsInt, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateStockLogDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  change: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsBoolean()
  updateStock?: boolean = true;
}
