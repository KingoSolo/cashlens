import { IsString, IsNotEmpty } from 'class-validator';

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;
}
