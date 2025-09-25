import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdoptionDTO, UpdateAdoptionDTO } from './adoptions.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdoptionStatus } from '@prisma/client';

@Injectable()
export class AdoptionsService {
  private readonly logger = new Logger(AdoptionsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, payload: AdoptionDTO) {
    const hasAdoptionOpen = await this.prisma.adoption.findFirst({
      where: { status: AdoptionStatus.Pending, userID: userId },
    });

    if (hasAdoptionOpen) {
      throw new ConflictException('User has already opened an adoption application.');
    }

    try {
      const newAdoption = await this.prisma.adoption.create({
        data: {
          userID: userId,
          ...payload,
        },
      });

      this.logger.log('Adoption application created successfully.');

      return {
        statusCode: HttpStatus.CREATED,
        data: newAdoption,
      };
    } catch (error) {
      this.logger.error('Error creating adoption application.');
    }
  }

  async updateStatus(id: string, payload: UpdateAdoptionDTO) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const updatedAdoption = await this.prisma.adoption.update({
        where: { id: id },
        data: {
          ...payload,
        },
      });

      this.logger.log('Adoption status updated successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: updatedAdoption,
      };
    } catch (error) {
      this.logger.error('Error updating adoption status');
    }
  }

  async delete(id: string) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const deletedAdoption = await this.prisma.adoption.update({
        where: { id: id },
        data: {
          isActive: false,
        },
      });

      this.logger.log('Adoption has been deleted successfully.');

      return {
        statusCode: HttpStatus.OK,
        message: 'Adoption deleted sucessfully',
      };
    } catch (error) {
      this.logger.error('Error deleting adoption');
    }
  }

  async findAll() {
    try {
      const adoptions = await this.prisma.adoption.findMany();

      this.logger.log('Adoptions fetched successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: adoptions,
      };
    } catch (error) {
      this.logger.error('Error fetching adoptions.');
    }
  }

  async findOne(id: string) {
    const isAdoptionValid = await this.prisma.adoption.findUnique({
      where: { id: id },
      select: { id: true },
    });

    if (!isAdoptionValid) {
      throw new NotFoundException('Adoption not found');
    }

    try {
      const adoption = await this.prisma.adoption.findUnique({
        where: { id: isAdoptionValid.id },
      });

      this.logger.log('Adoptions fetched successfully.');

      return {
        statusCode: HttpStatus.OK,
        data: adoption,
      };
    } catch (error) {
      this.logger.error('Error fetching adoptions.');
    }
  }

  // async createAdoption(newAdoption: CreateAdoptionDto): Promise<IAdoption> {
  //   const adoptions: IAdoption[] = await this.adoptionsRepository.getAllAdoption();
  //   const existingPending: IAdoption | null =
  //     adoptions.find(
  //       (adoption) =>
  //         (adoption.userID === newAdoption.userID || adoption.dni === newAdoption.dni) &&
  //         adoption.status === AdoptionStatus.Pending,
  //     ) || null;

  //   if (existingPending) {
  //     throw new BadRequestException(
  //       'Ya existe una solicitud de adopción pendiente para este usuario.',
  //     );
  //   }

  //   const now: Date = new Date();
  //   const sixMonthsAgo: Date = new Date();
  //   sixMonthsAgo.setMonth(now.getMonth() - 6);

  //   const rejectionCount: number = adoptions.filter(
  //     (adoption) =>
  //       adoption.userID === newAdoption.userID &&
  //       adoption.status === AdoptionStatus.Rejected &&
  //       adoption.rejectedAt &&
  //       adoption.rejectedAt >= sixMonthsAgo,
  //   ).length;

  //   if (rejectionCount >= 3) {
  //     throw new BadRequestException(
  //       'Has alcanzado 3 rechazos en los últimos 6 meses. No puedes realizar nuevas solicitudes hasta que pase ese periodo.',
  //     );
  //   }

  //   return await this.adoptionsRepository.createAdoption(newAdoption);
  // }

  // async updateAdoptionStatus(
  //   id: string,
  //   status: AdoptionStatus,
  //   rejectionReason?: string,
  // ): Promise<IAdoption | null> {
  //   // 1️⃣ Verificar existencia
  //   const adoption: IAdoption | null = await this.adoptionsRepository.getByIdAdoption(id);
  //   if (!adoption) {
  //     throw new NotFoundException(`No se encontró la adopción con id ${id}`);
  //   }

  //   // 2️⃣ Validar transición de estado
  //   const validTransitions: Record<EAdoptionStatus, EAdoptionStatus[]> = {
  //     [EAdoptionStatus.PENDING]: [EAdoptionStatus.APPROVED, EAdoptionStatus.REJECTED, EAdoptionStatus.WITHDRAWN],
  //     [EAdoptionStatus.APPROVED]: [EAdoptionStatus.WITHDRAWN],
  //     [EAdoptionStatus.REJECTED]: [],
  //     [EAdoptionStatus.WITHDRAWN]: [],
  //   };

  //   const allowedNext: EAdoptionStatus[] = validTransitions[adoption.status] || [];
  //   if (!allowedNext.includes(status)) {
  //     throw new BadRequestException(`No es posible cambiar de estado "${adoption.status}" a "${status}"`);
  //   }

  //   // 3️⃣ Validar razón de rechazo
  //   if (status === EAdoptionStatus.REJECTED && !rejectionReason) {
  //     throw new BadRequestException('Debe proporcionar una razón de rechazo al rechazar la solicitud.');
  //   }

  //   // 4️⃣ Actualizar
  //   return await this.adoptionsRepository.updateAdoptionStatus(id, status, rejectionReason);
  // }

  // async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<IAdoption> {
  //   if (!updateData || Object.keys(updateData).length === 0) {
  //     throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
  //   }

  //   const updated: IAdoption | null = await this.adoptionsRepository.updateAdoption(id, updateData);
  //   if (!updated) {
  //     throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
  //   }
  //   return updated;
  // }

  // async deleteAdoption(id: string): Promise<object> {
  //   const deleted: boolean = await this.adoptionsRepository.deleteAdoption(id);
  //   if (!deleted) {
  //     throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
  //   }
  //   return { message: `La adopción con ID ${id} ha sido eliminada exitosamente` };
  // }

  // async adoptionIsActive(id: string): Promise<IAdoption> {
  //   const updated: IAdoption | null = await this.adoptionsRepository.adoptionIsActive(id);
  //   if (!updated) {
  //     throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
  //   }
  //   return updated;
  // }
}
