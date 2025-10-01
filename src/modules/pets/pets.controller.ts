import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PetService } from './pets.service';
import { Pet, Prisma, UserType } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PetWithRelations } from './pet.types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Firulais' },
        age: { type: 'integer', example: 3 },
        gender: { type: 'string', example: 'Male' },
        size: { type: 'string', example: 'Small' },
        adoptionFee: { type: 'integer', example: 100 },
        avatarURL: {
          type: 'string',
          example: 'https://res.cloudinary.com/demo/image/upload/v123456789/pet.jpg',
          description: 'Secure URL returned from Cloudinary',
        },
        shelterID: { type: 'string', example: 'shltr123' },
        breedID: { type: 'string', example: 'brd456' },
        speciesID: { type: 'string', example: 'spc789' },
      },
      required: [
        'name',
        'age',
        'gender',
        'size',
        'adoptionFee',
        'avatarURL',
        'shelterID',
        'breedID',
        'speciesID',
      ],
    },
  })
  create(@Body() data: Prisma.PetCreateInput): Promise<Pet> {
    return this.petService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active pets (public)' })
  @ApiResponse({ status: 200, description: 'List of active pets returned.' })
  @ApiResponse({ status: 204, description: 'No pets found.' })
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.petService.findAll({ skip, take });
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pets (active and inactive) - (admin only)' })
  @ApiResponse({ status: 200, description: 'List of pets returned.' })
  findAllWithInactive(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ): Promise<PetWithRelations[]> {
    return this.petService.findAllWithInactive({ skip, take });
  }

  @Patch('restore/:id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiOperation({ summary: 'Restore a soft-deleted pet (admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the pet to restore',
  })
  @ApiResponse({
    status: 200,
    description: 'Pet successfully restored and marked as active',
  })
  @ApiResponse({
    status: 404,
    description: 'Pet not found',
  })
  async restore(@Param('id') id: string) {
    return this.petService.restore(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pet by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Pet found.' })
  @ApiResponse({ status: 404, description: 'Pet not found.' })
  findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a pet - ADMIN' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated pet.' })
  @ApiResponse({ status: 404, description: 'Pet not found.' })
  update(@Param('id') id: string, @Body() data: Prisma.PetUpdateInput) {
    return this.petService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate (soft delete) a pet - ADMIN' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Pet disabled.' })
  @ApiResponse({ status: 404, description: 'Pet not found.' })
  async remove(@Param('id') id: string) {
    await this.petService.remove(id);
  }

  @Get('shelter/:id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pets by shelter (active and inactive)' })
  @ApiResponse({ status: 200, description: 'List of pets returned.' })
  findAllByShelter(@Param('id') id: string) {
    return this.petService.findAllByShelter(id);
  }
}
