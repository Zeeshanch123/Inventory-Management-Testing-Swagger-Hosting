import { IsNotEmpty, IsInt, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockLogDto {
  @ApiProperty({
    description: 'UUID of the product for which stock is being logged',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Use positive numbers to add stock, negative numbers to reduce stock',
    example: 10,
  })
  @IsInt()
  change: number;

  @ApiProperty({
    description: 'Reason for the stock change',
    example: 'Stock replenishment from supplier',
    minLength: 1,
    maxLength: 500
  })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Whether to update the product stock quantity (default: true)',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  updateStock?: boolean = true;
}
