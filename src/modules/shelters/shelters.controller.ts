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
  Req,
  UseGuards,
} from '@nestjs/common';
import { SheltersService } from './shelters.service';
import { ShelterDTO, GetSheltersDTO, UpdateShelterDTO } from './shelters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('shelters')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(@Body() payload: ShelterDTO, @Req() req: any) {
    return await this.sheltersService.create(payload, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id') id: string, @Body() payload: UpdateShelterDTO) {
    return await this.sheltersService.update(id, payload);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateStatus(@Param('id') id: string) {
    return await this.sheltersService.updateStatus(id);
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
