import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    return users;
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        adoptions: true,
      },
    });
  }

  async deleteOne(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
