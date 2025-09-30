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

@Controller('adoptions')
@UseGuards(JwtAuthGuard)
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() payload: AdoptionDTO) {
    const { id } = req.user;

    await this.adoptionsService.create(id, payload);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.adoptionsService.delete(id);
  }

  @Get()
  async findAll() {
    return await this.adoptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adoptionsService.findOne(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateAdoptionStatus(@Param('id') id: string, @Body() payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }
}
