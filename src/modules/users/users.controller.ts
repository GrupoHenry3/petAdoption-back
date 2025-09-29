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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

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

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
}
