import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrmConf } from './config'

import { AuthModule } from './module/auth/auth.module'
import { UserModule } from './module/user/user.module'

@Module({
  imports: [TypeOrmModule.forRoot(OrmConf), AuthModule, UserModule],
})
export class AppModule {}
