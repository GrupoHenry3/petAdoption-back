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
import { Adoption, AdoptionDTO, UpdateAdoptionDTO } from './adoptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { AdoptionStatus, UserType } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@Controller('adoptions')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @ApiOperation({ summary: 'Submit a new adoption application' })
  @ApiBody({
    type: AdoptionDTO,
  })
  @ApiCreatedResponse({ description: 'Adoption application created successfully' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UserTypes(UserType.User)
  async create(@Req() req, @Body() payload: AdoptionDTO) {
    const { id } = req.user;

    await this.adoptionsService.create(id, payload);
  }

  @ApiOperation({ summary: 'Withdraw an adoption application' })
  @ApiOkResponse({ description: 'Adoption application withdrawn successfully' })
  @ApiNotFoundResponse({ description: 'Adoption application not found' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async patch(@Param('id') id: string, payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.withdrawApplication(id);
  }

  @ApiOperation({ summary: 'Delete an adoption application' })
  @ApiOkResponse({ description: 'Adoption application deleted successfully' })
  @ApiNotFoundResponse({ description: 'Adoption application not found' })
  @Delete(':id')
  @UserTypes(UserType.Shelter)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.adoptionsService.delete(id);
  }

  @ApiOperation({ summary: 'List all adoption applications (Shelter / Admin)' })
  @ApiOkResponse({ description: 'List of all adoption applications', type: [Adoption] })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UserTypes(UserType.Shelter)
  async findAll() {
    return await this.adoptionsService.findAll();
  }

  @ApiOperation({ summary: 'List all adoptions by shelter' })
  @ApiOkResponse({ description: 'List of all adoption applications', type: [Adoption] })
  @ApiBadRequestResponse()
  @Get('shelter/:id')
  @HttpCode(HttpStatus.OK)
  @UserTypes(UserType.Shelter)
  async findByShelter(@Param('id') id: string) {
    return await this.adoptionsService.findByShelter(id);
  }

  @ApiOperation({ summary: 'Get a specific adoption application' })
  @ApiOkResponse({
    description: 'Adoption application details fetched successfully',
    type: Adoption,
  })
  @ApiBadRequestResponse()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.adoptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update the status of an adoption application (Shelter / Admin)' })
  @ApiBody({
    type: Adoption,
  })
  @ApiOkResponse({ description: 'Adoption application updated successfully' })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UserTypes(UserType.Shelter)
  async updateAdoptionStatus(@Param('id') id: string, @Body() payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }
}
