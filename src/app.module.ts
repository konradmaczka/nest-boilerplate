import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './module/auth/auth.module'
import { UserModule } from './module/user/user.module'

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_CS, { dbName: process.env.MONGO_DB_NAME }), AuthModule, UserModule],
})
export class AppModule {}
