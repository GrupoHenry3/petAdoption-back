import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// import your .env file
import 'dotenv/config'

export default defineConfig({
  experimental: {
    adapter: true,
  },
  schema: path.join('prisma', 'schema.prisma'),
  async adapter() {
    return new PrismaLibSQL({
      url: `${process.env.TURSO_DB_URL}`,
      authToken: `${process.env.TURSO_DB_TOKEN}`,
    })
  }
})