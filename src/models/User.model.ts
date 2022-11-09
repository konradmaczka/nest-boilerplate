import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop()
  login: string

  @Prop()
  password: string

  @Prop()
  salt: string

  @Prop()
  isAdmin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)