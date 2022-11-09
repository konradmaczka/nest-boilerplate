import { Injectable } from '@nestjs/common'
import { UserGetSelfResponseDTO } from './dto/user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/models/User.model'
import { Model } from 'mongoose'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getSelf(id: number): Promise<UserGetSelfResponseDTO> {
    return await this.userModel.findOne({ _id: id }).then((user) => ({ id: user._id, login: user.login, isAdmin: user.isAdmin })) as UserGetSelfResponseDTO
  }
}
