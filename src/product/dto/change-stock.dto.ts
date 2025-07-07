import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeStockDto {
  @ApiProperty({
    description: 'Use positive numbers to add stock, negative numbers to reduce stock',
    example: 10,
    required: true
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
}
