import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedDTO, UpdateBreedDTO } from './breeds.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';

@Controller('breeds')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@UserTypes(UserType.Shelter)
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  async create(@Body() payload: BreedDTO) {
    return this.breedsService.create(payload);
  }

  @Get()
  async findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.breedsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateBreedDTO) {
    return this.breedsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.breedsService.remove(id);
  }
}
