import dotenv = require('dotenv')
dotenv.config()

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './interceptors/LoggingInterceptor'
;(async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ allowedHeaders: '*', methods: '*', origin: '*' })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('v1')
  app.useGlobalInterceptors(new LoggingInterceptor())

  const config = new DocumentBuilder().setTitle('API docs').setDescription('API docs').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3001)
})()
