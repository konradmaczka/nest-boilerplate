import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { decrypt } from 'src/utils/cryptography'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const {
      headers: { authorization },
    } = request

    if (!authorization) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized.',
          code: 'ER_UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const token = JSON.parse(decrypt(authorization))

      if (token.tokenValidTill < new Date().getTime()) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized.',
            code: 'ER_UNAUTHORIZED',
          },
          HttpStatus.UNAUTHORIZED,
        )
      }

      request.user = token

      return true
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized.',
          code: 'ER_UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED,
      )
    }
  }
}
