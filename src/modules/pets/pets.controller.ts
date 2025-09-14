import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Body() data: Prisma.PetCreateInput) {
    return this.petsService.create(data);
  }

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('name') name?: string,
    @Query('gender') gender?: string,
    @Query('neutered') neutered?: string,
  ) {
    const where: Prisma.PetWhereInput = {};
    if (name) where.name = { contains: name };
    if (gender) where.gender = gender as any;
    if (neutered !== undefined) where.neutered = neutered === 'true' ? true : false;

    return this.petsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() data: Prisma.PetUpdateInput) {
    return this.petsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.petsService.remove(id);
  }
}
