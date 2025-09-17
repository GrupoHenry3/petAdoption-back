import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationsService } from './donations.service';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() payload) {
    return this.donationsService.create(payload);
  }

  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }
}
