import {
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/decorators/user-type.decorator';
import { UserType } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @UseGuards(AdminGuard)
  // async create(@Body() payload: CreateUserDTO) {
  //   return await this.usersService.create(payload);
  // }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateStatus(@Param('id') id: string) {
    return await this.usersService.updateUserStatus(id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async update(@Req() req, @Body() payload: UpdateUserDTO) {
    return await this.usersService.update(req.user.id, payload);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Req() req) {
    return await this.usersService.delete(req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async findAll(@Query() filters: GetUsersDTO) {
    return await this.usersService.findAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }
}
