import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async create(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: this.generateHash(data.password),
        },
      });
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to create user: ' + error.message);
      }
      throw new Error('Failed to create user: An unknown error occurred');
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmailOrUsername(emailOrUsername: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  }

  async update(id: string, updateUserDto: CreateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
