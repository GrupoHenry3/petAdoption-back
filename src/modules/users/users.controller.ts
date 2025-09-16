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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, GetUsersDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async createUser(@Body() payload: CreateUserDTO) {
    return await this.usersService.create(payload);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateUser(@Req() req: Request, @Body() payload: UpdateUserDTO) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) throw new UnauthorizedException();
    const token = await this.jwtService.decode(accessToken);

    return await this.usersService.update(token.sub, payload);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateStatus(@Param('id') id: string) {
    return await this.usersService.updateUserStatus(id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() req: Request) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) throw new UnauthorizedException();
    const token = await this.jwtService.decode(accessToken);

    return await this.usersService.delete(token.sub);
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
