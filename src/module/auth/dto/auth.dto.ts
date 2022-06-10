import { IsString, Length } from 'class-validator'
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'

export class AuthRegisterParamDTO {
  @ApiProperty()
  @IsString()
  login: string

  @ApiProperty()
  @IsString()
  @Length(8)
  password: string
}

export class AuthLoginParamDTO {
  @ApiProperty()
  @IsString()
  login: string

  @ApiProperty()
  @IsString()
  password: string
}

export class AuthLoginResponseDTO {
  @ApiResponseProperty()
  token: string
}
