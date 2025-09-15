import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() payload: CreateUserDTO) {
    return await this.usersService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUserDTO) {
    return await this.usersService.update(id, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() filters: GetUsersDTO) {
    return await this.usersService.findAll(filters);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  // @HttpCode(HttpStatus.OK)
  // @Get(':id/adoptions')
  // async findUserAdoptions(@Param('id') id: string) {
  //   return await this.usersService.findUserAdoptions(id);
  // }
}
