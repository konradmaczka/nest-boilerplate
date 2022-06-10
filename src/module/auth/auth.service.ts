import crypto = require('crypto')
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { AuthRegisterParamDTO, AuthLoginParamDTO, AuthLoginResponseDTO } from './dto/auth.dto'
import { encrypt } from 'src/utils/cryptography'

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async register({ login, password }: AuthRegisterParamDTO) {
    try {
      const salt = crypto.randomBytes(32).toString('hex')
      const hash = crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex')

      await this.userRepository.insert({ login, password: hash, salt })

      return { success: true }
    } catch (error) {
      if (error.message.includes('ER_DUP_ENTRY')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            error: 'User already exists.',
            code: 'ER_DUP_USER',
          },
          HttpStatus.CONFLICT,
        )
      }
    }
  }

  async login({ login, password }: AuthLoginParamDTO): Promise<AuthLoginResponseDTO> {
    const user = await this.userRepository.findOne({ login })

    if (!user) {
      throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED }, HttpStatus.UNAUTHORIZED)
    }

    const { password: hash, salt } = user

    if (
      crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex') !== hash
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Wrong login or password.',
          code: 'ER_UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    const tokenData = {
      id: user.id,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      tokenCreatedAt: new Date().getTime(),
      tokenValidTill: new Date().getTime() + Number(process.env.TOKEN_VALID_MS),
    }
    const token = encrypt(tokenData)

    return { token }
  }
}
