import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SetPinRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  pin: string;
}
