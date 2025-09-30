import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';
import { DonationDTO } from './donations.dto';

@Controller('donations')
@UseGuards(JwtAuthGuard, UserTypeGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UserTypes(UserType.User)
  async create(@Req() req, @Body() payload: DonationDTO) {
    const { id } = req.user;
    return this.donationsService.create(id, payload);
  }

  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }
}
