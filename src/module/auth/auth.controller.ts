import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthLoginParamDTO, AuthLoginResponseDTO, AuthRegisterParamDTO } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register user (email+password)' })
  @Post('/register')
  register(@Body() { login, password }: AuthRegisterParamDTO) {
    return this.authService.register({ login, password })
  }

  @ApiOperation({ summary: 'Login user (email+password)' })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() { login, password }: AuthLoginParamDTO): Promise<AuthLoginResponseDTO> {
    return this.authService.login({ login, password })
  }
}
