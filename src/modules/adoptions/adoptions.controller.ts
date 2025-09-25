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
import { AdoptionDTO, UpdateAdoptionDTO } from './adoptions.dto';
import { AdoptionStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('adoptions')
// @UseGuards(JwtAuthGuard)
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() payload: AdoptionDTO) {
    const { id } = req.user;

    await this.adoptionsService.create(id, payload);
  }

  @Patch(':id')
  async patch(@Param('id') id: string, payload: UpdateAdoptionDTO) {
    return await this.adoptionsService.updateStatus(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.adoptionsService.delete(id);
  }

  @Get()
  async findAll() {
    return await this.adoptionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adoptionsService.findOne(id);
  }

  // @Get('all')
  // @HttpCode(HttpStatus.OK)
  // async getAllAdoption(): Promise<object> {
  //   const adoptions: IAdoption[] = await this.adoptionsService.getAllAdoption();
  //   return {
  //     message: 'Lista de adopciones obtenida exitosamente',
  //     data: adoptions,
  //   };
  // }

  // @Get('by-id/:id')
  // @HttpCode(HttpStatus.OK)
  // async getByIdAdoption(@Param('id') id: string): Promise<object> {
  //   const adoption: IAdoption = await this.adoptionsService.getByIdAdoption(id);
  //   return {
  //     message: 'Adopción encontrada exitosamente',
  //     data: adoption,
  //   };
  // }

  // @Patch('status/:id')
  // @HttpCode(HttpStatus.OK)
  // async updateAdoptionStatus(
  //   @Param('id') id: string,
  //   @Body('status') status: AdoptionStatus,
  //   @Body('rejectionReason') rejectionReason?: string,
  // ): Promise<object> {
  //   const adoption: IAdoption | null = await this.adoptionsService.updateAdoptionStatus(
  //     id,
  //     status,
  //     rejectionReason,
  //   );
  //   return {
  //     message: `Estado de la adopción actualizado a "${status}"`,
  //     data: adoption,
  //   };
  // }

  // @Patch('update/:id')
  // @HttpCode(HttpStatus.OK)
  // async updateAdoption(
  //   @Param('id') id: string,
  //   @Body() updateData: Partial<IAdoption>,
  // ): Promise<object> {
  //   const updated: IAdoption = await this.adoptionsService.updateAdoption(id, updateData);
  //   return {
  //     message: 'Adopción actualizada exitosamente',
  //     data: updated,
  //   };
  // }

  // @Delete('delete/:id')
  // @HttpCode(HttpStatus.OK)
  // async deleteAdoption(@Param('id') id: string): Promise<object> {
  //   return await this.adoptionsService.deleteAdoption(id);
  // }

  // @Patch('active/:id')
  // @HttpCode(HttpStatus.OK)
  // async adoptionIsActive(@Param('id') id: string): Promise<object> {
  //   const adoption: IAdoption = await this.adoptionsService.adoptionIsActive(id);
  //   return {
  //     message: `El estado de la adopción con ID ${id} ha sido actualizado a ${adoption.isActive ? 'Activo' : 'Inactivo'}`,
  //     data: adoption,
  //   };
  // }
}
