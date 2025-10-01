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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PetWithRelations } from './pet.types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { CreatePetDTO, UpdatePetDTO } from './pets.dto';

@Controller('pets')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({ status: 201, description: 'Pet created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({
    type: CreatePetDTO,
  })
  @ApiBearerAuth()
  async create(@Body() payload: CreatePetDTO) {
    return await this.petService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'List all pets' })
  @ApiResponse({ status: 200, description: 'List of all active pets' })
  @ApiNoContentResponse({ description: 'No pets found' })
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
  @ApiOperation({ summary: 'Restore a soft-deleted pet (Admin)' })
  @ApiOkResponse({ description: 'Pet successfully restored and marked as active' })
  @ApiNotFoundResponse({ description: 'Pet not found' })
  async restore(@Param('id') id: string) {
    return this.petService.restore(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific pet' })
  @ApiOkResponse({ description: 'Pet details fetched successfully' })
  @ApiNotFoundResponse({ description: 'Pet not found' })
  findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific pet (Shelter / Admin)' })
  @ApiBody({
    type: UpdatePetDTO,
  })
  @ApiOkResponse({ description: 'Pet updated successfully' })
  @ApiNotFoundResponse({ description: 'Pet not found' })
  update(@Param('id') id: string, @Body() payload: UpdatePetDTO) {
    return this.petService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a pet (Shelter / Admin)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  @ApiNotFoundResponse({ description: 'Pet not found' })
  async remove(@Param('id') id: string) {
    await this.petService.remove(id);
  }

  @Get('shelter/:id')
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.Shelter)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pets by shelter (active and inactive)' })
  @ApiOkResponse({ description: 'List of pets returned' })
  findAllByShelter(@Param('id') id: string) {
    return this.petService.findAllByShelter(id);
  }
}
