import { Controller, Get, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from '../../guards/AuthGuard'
import { UserGetSelfResponseDTO } from './dto/user.dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve profile data' })
  @ApiOkResponse({ status: HttpStatus.OK, description: "User's profile data" })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard)
  @Get('/me')
  getSelf(@Request() { user: { id } }): Promise<UserGetSelfResponseDTO> {
    return this.userService.getSelf(id)
  }
}
