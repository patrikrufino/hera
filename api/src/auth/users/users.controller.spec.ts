import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 'clxyz',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: 'hashedpassword123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersService],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and return safe user data', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Usando o padrão NestJS de resposta
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        location: jest.fn().mockReturnThis(),
      };

      await controller.create(createUserDto, response as any);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.location).toHaveBeenCalledWith(`/users/${mockUser.id}`);

      // Verificando a estrutura da resposta
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          username: mockUser.username,
        }),
      );

      // Garantindo que a senha não está presente
      expect(response.json.mock.calls[0][0]).not.toHaveProperty('password');
    });
  });
});
