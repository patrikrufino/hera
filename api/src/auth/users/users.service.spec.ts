import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
    };
    const mockUser = {
      id: '1',
      ...createUserDto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: createUserDto,
    });
    expect(result).toEqual(mockUser);
  });

  it('should create a user with hashed password', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      ...createUserDto,
      password: 'hashedPassword123',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword123');
    jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createUserDto,
        password: 'hashedPassword123',
      },
    });
    expect(result).toEqual(mockUser);
  });
});
