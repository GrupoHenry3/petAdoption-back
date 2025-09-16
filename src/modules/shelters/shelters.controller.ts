import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SheltersService } from './shelters.service';
import { GetSheltersDTO, ShelterDTO, UpdateShelterDTO } from './shelters.dto';

@Controller('shelters')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: ShelterDTO) {
    return await this.sheltersService.create(payload);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: string, @Body() payload: UpdateShelterDTO) {
    return await this.sheltersService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.sheltersService.delete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: GetSheltersDTO) {
    return await this.sheltersService.findAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.sheltersService.findOne(id);
  }
}
