import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier (optional)',
    example: 'Apple Inc.',
    minLength: 1,
    maxLength: 255,
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Contact email address for the supplier (optional)',
    example: 'contact@apple.com',
    format: 'email',
    required: false
  })
  @IsOptional()
  @IsEmail()
  contact_email?: string;
}
