import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { Breed, BreedDTO, UpdateBreedDTO } from './breeds.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('breeds')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@UserTypes(UserType.Shelter)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @ApiOperation({ summary: 'Create a new breed' })
  @ApiBody({
    schema: {
      properties: {
        name: { type: 'string', example: 'Golden Retriever' },
        description: { type: 'string', example: 'Lovable goofballs' },
        avatarURL: { type: 'string', example: 'https://imageurl.com/goldenretriever.png' },
        speciesID: { type: 'string', example: 'cmg89qhbb000004l589owajpx' },
      },
      required: ['name', 'description', 'avatarURL', 'speciesID'],
    },
  })
  @ApiOkResponse({ description: 'Breed created successfully', type: Breed })
  @Post()
  async create(@Body() payload: BreedDTO) {
    return this.breedsService.create(payload);
  }

  @ApiOperation({ summary: 'List all breeds' })
  @ApiOkResponse({ description: 'List of all breeds', type: [Breed] })
  @ApiNoContentResponse({ description: 'No breeds found' })
  @Get()
  async findAll() {
    return this.breedsService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific breed' })
  @ApiOkResponse({ description: 'Breed details fetched successfully', type: Breed })
  @ApiNotFoundResponse({ description: 'Breed not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.breedsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a breed' })
  @ApiBody({
    type: UpdateBreedDTO,
  })
  @ApiOkResponse({ description: 'Breed updated successfully', type: Breed })
  @ApiNotFoundResponse({ description: 'Breed not found' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateBreedDTO) {
    return this.breedsService.update(id, payload);
  }

  @ApiOperation({ summary: 'Delete a breed' })
  @ApiOkResponse({ description: 'Breed deleted successfully' })
  @ApiNotFoundResponse({ description: 'Breed not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.breedsService.remove(id);
  }
}
