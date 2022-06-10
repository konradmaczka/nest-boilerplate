import { Injectable } from '@nestjs/common'
import { UserEntity } from '../../entities/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserGetSelfResponseDTO } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  getSelf(id: number): Promise<UserGetSelfResponseDTO> {
    return this.userRepository.findOne({ id }, { select: ['id', 'login', 'isAdmin', 'createdAt'] })
  }
}
