import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const tursoUrl = `${process.env.TURSO_DB_URL}`;
    const tursoToken = `${process.env.TURSO_DB_TOKEN}`;

    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await super.$connect();
  }
}
