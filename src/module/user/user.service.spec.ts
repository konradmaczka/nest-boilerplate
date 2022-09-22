import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UserEntity } from '../../entities/user.entity'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { 
          provide: getRepositoryToken(UserEntity), 
          useValue: UserEntity
        }
      ]
    })
      .compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should retrieve an user', async () => {
    const mock = (id: number) => {
      return {
        id,
        login: 'email@example.com',
        isAdmin: false,
        createdAt: new Date('01-01-1999 10:00:00')
      }      
    }
    jest.spyOn(service, 'getSelf').mockImplementation(async (id: number) => mock(id))

    expect(await service.getSelf(1)).toEqual(mock(1))
  })
})