import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import IAdoption from './interfaces/adoptions.interface';
import { EAdoptionStatus } from '@prisma/client';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) { }

  // -------------------- CREATE --------------------
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createAdoption(@Body() newAdoption: CreateAdoptionDto): Promise<object> {
    const adoption: IAdoption = await this.adoptionsService.createAdoption(newAdoption);
    return {
      message: 'Adopción creada exitosamente',
      data: adoption,
    };
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllAdoption(): Promise<object> {
    const adoptions: IAdoption[] = await this.adoptionsService.getAllAdoption();
    return {
      message: 'Lista de adopciones obtenida exitosamente',
      data: adoptions,
    };
  }

  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  async getByIdAdoption(@Param('id') id: string): Promise<object> {
    const adoption: IAdoption = await this.adoptionsService.getByIdAdoption(id);
    return {
      message: 'Adopción encontrada exitosamente',
      data: adoption,
    };
  }
  // --------------------- READ ---------------------

  // ---------------- UPDATE STATUS -----------------
  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  async updateAdoptionStatus(@Param('id') id: string, @Body('status') status: EAdoptionStatus, @Body('rejectionReason') rejectionReason?: string): Promise<object> {
    const adoption: IAdoption | null = await this.adoptionsService.updateAdoptionStatus(id, status, rejectionReason);
    return {
      message: `Estado de la adopción actualizado a "${status}"`,
      data: adoption,
    };
  }
  // ---------------- UPDATE STATUS -----------------

  // -------------------- UPDATE --------------------
  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateAdoption(@Param('id') id: string, @Body() updateData: Partial<IAdoption>): Promise<object> {
    const updated: IAdoption = await this.adoptionsService.updateAdoption(id, updateData);
    return {
      message: 'Adopción actualizada exitosamente',
      data: updated,
    };
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAdoption(@Param('id') id: string): Promise<object> {
    return await this.adoptionsService.deleteAdoption(id);
  }
  // -------------------- DELETE --------------------

  // ------------- ACTIVAR / DESACTIVAR -------------
  @Patch('active/:id')
  @HttpCode(HttpStatus.OK)
  async adoptionIsActive(@Param('id') id: string): Promise<object> {
    const adoption: IAdoption = await this.adoptionsService.adoptionIsActive(id);
    return {
      message: `El estado de la adopción con ID ${id} ha sido actualizado a ${adoption.isActive ? 'Activo' : 'Inactivo'}`,
      data: adoption,
    };
  }
  // ------------- ACTIVAR / DESACTIVAR -------------
}