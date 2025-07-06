import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class ChangeStockDto {
  @IsInt()
  change: number;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
