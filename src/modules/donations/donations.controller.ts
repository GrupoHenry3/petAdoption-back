import { Controller, Get, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';
import { Donation, DonationDTO } from './donations.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('donations')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @ApiOperation({ summary: 'New donation' })
  @ApiBody({
    type: DonationDTO,
  })
  @ApiCreatedResponse({ description: 'Donation submitted successfully' })
  @Post()
  @UseGuards(UserTypeGuard)
  @UserTypes(UserType.User)
  async create(@Req() req, @Body() payload: DonationDTO) {
    const { id } = req.user;
    return this.donationsService.create(id, payload);
  }

  @ApiOperation({ summary: 'Handle failed payments (Stripe)' })
  @Post('failed')
  async failed(@Body() payload: { sessionId: string; errorReason: string }) {
    return await this.donationsService.failed(payload);
  }

  @ApiOperation({ summary: 'List all donations (Admin)' })
  @ApiOkResponse({ description: 'List of all donations', type: [Donation] })
  @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    return this.donationsService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific user donations' })
  @ApiOkResponse({ description: 'Donation details fetched successfully', type: [Donation] })
  @Get(':id')
  async findByUser(@Param('id') id: string) {
    return await this.donationsService.findByUser(id);
  }

  @ApiOperation({ summary: 'Get current user donations' })
  @ApiOkResponse({ description: 'Donation details fetched successfully', type: [Donation] })
  @UseGuards(UserTypeGuard)
  @UserTypes(UserType.User)
  @Get('my')
  async findMyDonations(@Req() req) {
    const { id } = req.user;

    return await this.donationsService.findByUser(id);
  }

  @ApiOperation({ summary: 'List all donations by shelter' })
  @ApiOkResponse({ description: 'List of all donations', type: [Donation] })
  @UseGuards(UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @Get('shelter')
  async findByshelter(@Req() req) {
    const { id } = req.user;

    return await this.donationsService.findByShelter(id);
  }
}
