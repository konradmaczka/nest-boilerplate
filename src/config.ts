import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const OrmConf: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/entities/*.entity.js'],
  synchronize: true,
}
