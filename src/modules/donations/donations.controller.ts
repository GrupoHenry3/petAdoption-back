import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard'

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Req() req, @Body() payload) {
    const { id } = req.user;
    return this.donationsService.create(id, payload);
  }

  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }
}
