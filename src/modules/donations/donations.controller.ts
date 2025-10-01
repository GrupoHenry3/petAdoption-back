import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException } from '@nestjs/common';
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

  @Get('my')
  async findMyDonations(@Req() req) {
    const { id } = req.user;
    return this.donationsService.findByUser(id);
  }

  @Get('shelter')
  async findShelterDonations(@Req() req) {
    const { id: userId } = req.user;
    
    // Primero obtener el shelter del usuario
    const user = await this.donationsService.findUserShelter(userId);
    if (!user || !user.shelter) {
      throw new NotFoundException('User does not have an associated shelter');
    }
    
    return this.donationsService.findByShelter(user.shelter.id);
  }

  @Post('payment-failed')
  async handlePaymentFailure(@Body() body: { sessionId: string; errorReason: string }) {
    return this.donationsService.handlePaymentFailure(body.sessionId, body.errorReason);
  }
}
