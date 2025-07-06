import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplierDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    contact_email: string;
}
