import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Species, SpeciesDTO } from './species.dto';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserType } from '@prisma/client';
import { UserTypes } from '../auth/auth.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('species')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@UserTypes(UserType.Shelter)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @ApiOperation({ summary: 'Create a new species' })
  @ApiBody({
    type: SpeciesDTO,
  })
  @ApiOkResponse({ description: 'Species created successfully' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: SpeciesDTO) {
    return this.speciesService.create(payload);
  }

  @ApiOperation({ summary: 'List all species' })
  @ApiOkResponse({ description: 'List of all species', type: [Species] })
  @ApiNoContentResponse({ description: 'No species found' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.speciesService.findAll();
  }

  @ApiOperation({ summary: 'Get a specific species' })
  @ApiOkResponse({ description: 'Species details fetched successfully', type: Species })
  @ApiNotFoundResponse({ description: 'Species not found' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.speciesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a specific species' })
  @ApiOkResponse({ description: 'Species updated successfully', type: Species })
  @ApiNotFoundResponse({ description: 'Species not found' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() payload: SpeciesDTO) {
    return this.speciesService.update(id, payload);
  }

  @ApiOperation({ summary: 'Delete a specific species' })
  @ApiOkResponse({ description: 'Species deleted successfully' })
  @ApiNotFoundResponse({ description: 'Species not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    return this.speciesService.remove(id);
  }
}
