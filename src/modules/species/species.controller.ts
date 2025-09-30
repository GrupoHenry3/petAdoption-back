import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SpeciesDTO } from './species.dto';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserType } from '@prisma/client';
import { UserTypes } from '../auth/auth.decorator';

@Controller('species')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@UserTypes(UserType.Shelter)
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: SpeciesDTO) {
    return this.speciesService.create(payload);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.speciesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.speciesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() payload: SpeciesDTO) {
    return this.speciesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    return this.speciesService.remove(id);
  }
}
