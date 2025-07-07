import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
    @ApiProperty({
        description: 'The name of the supplier',
        example: 'Apple Inc.',
        minLength: 1,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Contact email address for the supplier',
        example: 'contact@apple.com',
        format: 'email'
    })
    @IsNotEmpty()
    @IsEmail()
    contact_email: string;
}
