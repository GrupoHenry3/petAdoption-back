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
import { AnimalService } from './animal.service';
import { Prisma } from '@prisma/client';

@Controller('pets')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  async create(@Body() data: Prisma.AnimalCreateInput) {
    return this.animalService.create(data);
  }

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('name') name?: string,
    @Query('gender') gender?: string,
    @Query('neutered') neutered?: string,
  ) {
    const where: Prisma.AnimalWhereInput = {};
    if (name) where.name = { contains: name };
    if (gender) where.gender = gender as any;
    if (neutered !== undefined) where.neutered = neutered === 'true' ? true : false;

    return this.animalService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animalService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: Prisma.AnimalUpdateInput) {
    return this.animalService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.animalService.remove(id);
  }
}
