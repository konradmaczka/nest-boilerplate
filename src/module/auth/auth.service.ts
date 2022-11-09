import crypto = require('crypto')
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { AuthRegisterParamDTO, AuthLoginParamDTO, AuthLoginResponseDTO } from './dto/auth.dto'
import { encrypt } from 'src/utils/cryptography'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/models/User.model'
import { Model } from 'mongoose'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register({ login, password }: AuthRegisterParamDTO) {
    try {
      const exists = await this.userModel.findOne({ login })
      if (exists) {
        throw new Error('ER_DUP_ENTRY')
      }

      const salt = crypto.randomBytes(32).toString('hex')
      const hash = crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex')
      
      await this.userModel.create({ login, password: hash, salt, isAdmin: false })

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
    const user = await this.userModel.findOne({ login })

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
      id: user._id,
      isAdmin: user.isAdmin,
      tokenCreatedAt: new Date().getTime(),
      tokenValidTill: new Date().getTime() + Number(process.env.TOKEN_VALID_MS),
    }
    const token = encrypt(tokenData)

    return { token }
  }
}
