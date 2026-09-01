import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UnlockModuleRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  pin: string;
}
