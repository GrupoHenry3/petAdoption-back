import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { PetService } from './pets.service';
import { Prisma, Pet } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('pets')
@ApiTags('Pets - endpoinds / routes')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() data: Prisma.PetCreateInput): Promise<Pet> {
    return this.petService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mascotas activas' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas retornada.' })
  findAll(@Query('skip') skip?: number, @Query('take') take?: number): Promise<Pet[]> {
    return this.petService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }
  ///-----Admin---//
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las mascotas activas e inactivas' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas retornada.' })
  findAllWithInactive(@Query('skip') skip?: number, @Query('take') take?: number): Promise<Pet[]> {
    return this.petService.findAllWithInactive({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }
  //--admin--//
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Mascota encontrada.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  findOne(@Param('id') id: string): Promise<Pet> {
    return this.petService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Mascota actualizada.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  update(@Param('id') id: string, @Body() data: Prisma.PetUpdateInput): Promise<Pet> {
    return this.petService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar (soft delete) una mascota' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Mascota desactivada.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async remove(@Param('id') id: string): Promise<{ message: string; pet: Pet }> {
    const pet = await this.petService.remove(id);
    return { message: `Pet ${id} marked as inactive`, pet };
  }
}
