import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      },
    });

    return users;
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        phoneNumber: true,
        email: true,
        adoptions: true
      },
    });
  }

  async deleteOne(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
