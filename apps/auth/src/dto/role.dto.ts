import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RoleDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;
}
