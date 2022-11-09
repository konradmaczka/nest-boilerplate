import { ApiResponseProperty } from '@nestjs/swagger'

export class UserGetSelfResponseDTO {
  @ApiResponseProperty()
  id: number

  @ApiResponseProperty()
  login: string

  @ApiResponseProperty()
  isAdmin: boolean
}
