import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import fs = require('fs')

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const { method, query, body, path } = context.switchToHttp().getRequest()

    /**
     * We don't want to log user's credentials
     */
    if (path.includes('auth')) {
      return next.handle()
    }

    const dateObj = new Date()
    const year = dateObj.getUTCFullYear()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const date = `${year}-${month}-${day}`

    let preRequestLog: string = `[${method}] Request started at ${new Date().toLocaleString(
      'pl-PL',
    )} with qs: ${JSON.stringify(query)}`

    switch (method) {
      case 'GET':
      case 'DELETE':
        preRequestLog += '\n'
        break
      case 'POST':
      case 'PUT':
      case 'PATCH':
        preRequestLog += ` and body: ${JSON.stringify(body)}\n`
        break
      default:
        break
    }

    fs.appendFile(`./logs/${date}.txt`, preRequestLog, () => {})

    return next.handle().pipe(
      tap((response) => {
        const postRequestLog: string = `[${method}] Request ended at ${new Date().toLocaleString(
          'pl-PL',
        )} with response: ${JSON.stringify(response)}\n`

        fs.appendFile(`./logs/${date}.txt`, postRequestLog, () => {})
      }),
    )
  }
}
