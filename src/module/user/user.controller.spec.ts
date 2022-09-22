import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('Users controller', () => {
  let controller: UserController

  const mockUserService = {
    getSelf: jest.fn().mockImplementation((dto) => {
      return {
        id: Math.floor(Math.random() * 1000),
        ...dto
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('receive an user', () => {
    const dto = { user: { id: 0 } }
    expect(controller.getSelf(dto)).toEqual({ id: expect.any(Number) })

    expect(mockUserService.getSelf).toHaveBeenCalled()
  })
})