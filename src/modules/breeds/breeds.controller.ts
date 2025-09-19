import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { BreedDTO, UpdateBreedDTO } from './breeds.dto';

@Controller('breeds')
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
