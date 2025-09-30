import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionDTO, UpdateAdoptionDTO } from './adoptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';

@Controller('adoptions')
@UseGuards(JwtAuthGuard, UserTypeGuard)
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UserTypes(UserType.User)
  async create(@Req() req, @Body() payload: AdoptionDTO) {
    const { id } = req.user;

    await this.adoptionsService.create(id, payload);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async patch(@Param('id') id: string, payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }

  @Delete(':id')
  @UserTypes(UserType.Shelter)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.adoptionsService.delete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UserTypes(UserType.Shelter)
  async findAll() {
    return await this.adoptionsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.adoptionsService.findOne(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UserTypes(UserType.Shelter)
  async updateAdoptionStatus(@Param('id') id: string, @Body() payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }
}
