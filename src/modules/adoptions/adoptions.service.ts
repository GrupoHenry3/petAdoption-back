import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import IAdoption from './interfaces/adoptions.interface';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { EAdoptionStatus } from '@prisma/client'; // ✅ Usar el enum generado por Prisma
import { AdoptionsRepository } from './adoptions.repository';

@Injectable()
export class AdoptionsService {
  private readonly logger = new Logger(AdoptionsService.name);
  constructor(private readonly adoptionsRepository: AdoptionsRepository) {}

  // -------------------- CREATE --------------------
  async createAdoption(newAdoption: CreateAdoptionDto): Promise<IAdoption> {
    // 1️⃣ Verificar solicitudes pendientes
    const adoptions: IAdoption[] = await this.adoptionsRepository.getAllAdoption();
    const existingPending: IAdoption | null =
      adoptions.find(
        (adoption) =>
          (adoption.userID === newAdoption.userID || adoption.dni === newAdoption.dni) &&
          adoption.status === EAdoptionStatus.PENDING
      ) || null;

    if (existingPending) {
      throw new BadRequestException(
        'Ya existe una solicitud de adopción pendiente para este usuario.',
      );
    }

    // 2️⃣ Verificar rechazos recientes
    const now: Date = new Date();
    const sixMonthsAgo: Date = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const rejectionCount: number = adoptions.filter(
      (adoption) =>
        adoption.userID === newAdoption.userID &&
        adoption.status === EAdoptionStatus.REJECTED &&
        adoption.rejectedAt &&
        adoption.rejectedAt >= sixMonthsAgo,
    ).length;

    if (rejectionCount >= 3) {
      throw new BadRequestException(
        'Has alcanzado 3 rechazos en los últimos 6 meses. No puedes realizar nuevas solicitudes hasta que pase ese periodo.',
      );
    }

    // 3️⃣ Crear adopción
    return await this.adoptionsRepository.createAdoption(newAdoption);
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  async getAllAdoption(): Promise<IAdoption[]> {
    const allAdoptions: IAdoption[] = await this.adoptionsRepository.getAllAdoption();
    if (!allAdoptions || allAdoptions.length === 0) {
      throw new NotFoundException('No se encontraron solicitudes de adopción');
    }
    return allAdoptions;
  }

  async getByIdAdoption(id: string): Promise<IAdoption> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('El ID de adopción es requerido');
    }
    const adoption: IAdoption | null = await this.adoptionsRepository.getByIdAdoption(id);
    if (!adoption) {
      throw new NotFoundException(`No se encontró la adopción con el id: ${id}`);
    }
    return adoption;
  }
  // --------------------- READ ---------------------

  // ----------- UPDATE ADOPTION STATUS -------------
  async updateAdoptionStatus(
    id: string,
    status: EAdoptionStatus,
    rejectionReason?: string,
  ): Promise<IAdoption | null> {
    // 1️⃣ Verificar existencia
    const adoption: IAdoption | null = await this.adoptionsRepository.getByIdAdoption(id);
    if (!adoption) {
      throw new NotFoundException(`No se encontró la adopción con id ${id}`);
    }

    // 2️⃣ Validar transición de estado
    const validTransitions: Record<EAdoptionStatus, EAdoptionStatus[]> = {
      [EAdoptionStatus.PENDING]: [EAdoptionStatus.APPROVED, EAdoptionStatus.REJECTED, EAdoptionStatus.WITHDRAWN],
      [EAdoptionStatus.APPROVED]: [EAdoptionStatus.WITHDRAWN],
      [EAdoptionStatus.REJECTED]: [],
      [EAdoptionStatus.WITHDRAWN]: [],
    };

    const allowedNext: EAdoptionStatus[] = validTransitions[adoption.status] || [];
    if (!allowedNext.includes(status)) {
      throw new BadRequestException(`No es posible cambiar de estado "${adoption.status}" a "${status}"`);
    }

    // 3️⃣ Validar razón de rechazo
    if (status === EAdoptionStatus.REJECTED && !rejectionReason) {
      throw new BadRequestException('Debe proporcionar una razón de rechazo al rechazar la solicitud.');
    }

    // 4️⃣ Actualizar
    return await this.adoptionsRepository.updateAdoptionStatus(id, status, rejectionReason);
  }
  // ----------- UPDATE ADOPTION STATUS -------------

  // -------------------- UPDATE --------------------
  async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<IAdoption> {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
    }

    const updated: IAdoption | null = await this.adoptionsRepository.updateAdoption(id, updateData);
    if (!updated) {
      throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
    }
    return updated;
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  async deleteAdoption(id: string): Promise<object> {
    const deleted: boolean = await this.adoptionsRepository.deleteAdoption(id);
    if (!deleted) {
      throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
    }
    return { message: `La adopción con ID ${id} ha sido eliminada exitosamente` };
  }
  // -------------------- DELETE --------------------

  // ------------- ACTIVAR / DESACTIVAR -------------
  async adoptionIsActive(id: string): Promise<IAdoption> {
    const updated: IAdoption | null = await this.adoptionsRepository.adoptionIsActive(id);
    if (!updated) {
      throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
    }
    return updated;
  }
  // ------------- ACTIVAR / DESACTIVAR -------------
}





// import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
// import IAdoption from './interfaces/adoptions.interface';
// import { CreateAdoptionDto } from './dto/create-adoption.dto';
// import EAdoptionStatus from './enums/adoption-status.enum';
// import { AdoptionsRepository } from './adoptions.repository';
// import { AdoptionStatus } from '@prisma/client';


// @Injectable()
// export class AdoptionsService {
//   private readonly logger = new Logger(AdoptionsService.name);
//   constructor(private readonly adoptionsRepository: AdoptionsRepository) { }

//   // -------------------- CREATE --------------------
//   async createAdoption(newAdoption: CreateAdoptionDto): Promise<IAdoption> {
//     // 1️⃣ Verificar solicitudes pendientes
//     const adoptions: IAdoption[] = await this.adoptionsRepository.getAllAdoption();
//     const existingPending: IAdoption | null = (adoptions.find((adoption) => (adoption.userID === newAdoption.userID || adoption.dni === newAdoption.dni) && adoption.status === AdoptionStatus.Pending)) || null;
//     if (existingPending) {
//       throw new BadRequestException(
//         'Ya existe una solicitud de adopción pendiente para este usuario.',
//       );
//     }
//     // 2️⃣ Verificar rechazos recientes
//     const now: Date = new Date();
//     const sixMonthsAgo: Date = new Date();
//     sixMonthsAgo.setMonth(now.getMonth() - 6);
//     const rejectionCount: number = adoptions.filter(
//       (adoption) =>
//         adoption.userID === newAdoption.userID &&
//         adoption.status === AdoptionStatus.Rejected &&
//         adoption.rejectedAt && adoption.rejectedAt >= sixMonthsAgo,
//     ).length;
//     // const rejectionCount = await this.adoptionsRepository.countRecentRejections(newAdoption.userID);
//     if (rejectionCount >= 3) {
//       throw new BadRequestException(
//         'Has alcanzado 3 rechazos en los últimos 6 meses. No puedes realizar nuevas solicitudes hasta que pase ese periodo.',
//       );
//     }
//     // 3️⃣ Crear adopción
//     return await this.adoptionsRepository.createAdoption(newAdoption);
//   }
//   // -------------------- CREATE --------------------

//   // --------------------- READ ---------------------
//   async getAllAdoption(): Promise<IAdoption[]> {
//     const allAdoptions: IAdoption[] = await this.adoptionsRepository.getAllAdoption();
//     if (!allAdoptions || allAdoptions.length === 0) {
//       throw new NotFoundException('No se encontraron solicitudes de adopción');
//     }
//     return allAdoptions;
//   }

//   async getByIdAdoption(id: string): Promise<IAdoption> {
//     if (!id || id.trim() === '') {
//       throw new BadRequestException('El ID de adopción es requerido');
//     }
//     const adoption: IAdoption | null = await this.adoptionsRepository.getByIdAdoption(id);
//     if (!adoption) {
//       throw new NotFoundException(`No se encontró la adopción con el id: ${id}`);
//     }
//     return adoption;
//   }
//   // --------------------- READ ---------------------

//   // ----------- UPDATE ADOPTION STATUS -------------
//   async updateAdoptionStatus(id: string, status: EAdoptionStatus, rejectionReason?: string): Promise<IAdoption | null> {
//     // 1. Verificar existencia
//     const adoption: IAdoption | null = await this.adoptionsRepository.getByIdAdoption(id);
//     if (!adoption) {
//       throw new NotFoundException(`No se encontró la adopción con id ${id}`);
//     }
//     // 2. Validar transición de estado directamente aquí
//     const validTransitions: Record<EAdoptionStatus, EAdoptionStatus[]> = {
//       [EAdoptionStatus.PENDING]: [
//         EAdoptionStatus.APPROVED,
//         EAdoptionStatus.REJECTED,
//         EAdoptionStatus.WITHDRAWN,
//       ],
//       [EAdoptionStatus.APPROVED]: [EAdoptionStatus.WITHDRAWN],
//       [EAdoptionStatus.REJECTED]: [],
//       [EAdoptionStatus.WITHDRAWN]: [],
//     };
//     const allowedNext: EAdoptionStatus[] = validTransitions[adoption.status] || [];
//     if (!allowedNext.includes(status)) {
//       throw new BadRequestException(
//         `No es posible cambiar de estado "${adoption.status}" a "${status}"`,
//       );
//     }
//     // 3. Validar razón de rechazo
//     if (status === EAdoptionStatus.REJECTED && !rejectionReason) {
//       throw new BadRequestException(
//         'Debe proporcionar una razón de rechazo al rechazar la solicitud.',
//       );
//     }
//     // 4. Actualizar
//     return await this.adoptionsRepository.updateAdoptionStatus(id, status, rejectionReason);
//   }
//   // ----------- UPDATE ADOPTION STATUS -------------

//   // -------------------- UPDATE --------------------
//   async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<IAdoption> {
//     // Verificar que haya datos para actualizar
//     if (!updateData || Object.keys(updateData).length === 0) {
//       throw new BadRequestException('Debe enviar al menos un campo para actualizar.');
//     }
//     const updated: IAdoption | null = await this.adoptionsRepository.updateAdoption(id, updateData);
//     if (!updated) {
//       throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
//     }
//     return updated;
//   }
//   // -------------------- UPDATE --------------------

//   // -------------------- DELETE --------------------
//   async deleteAdoption(id: string): Promise<object> {
//     const deleted: boolean = await this.adoptionsRepository.deleteAdoption(id);
//     if (!deleted) {
//       throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
//     }
//     return { message: `La adopción con ID ${id} ha sido eliminada exitosamente` };
//   }
//   // -------------------- DELETE --------------------

//   // ------------- ACTIVAR / DESACTIVAR -------------
//   async adoptionIsActive(id: string): Promise<IAdoption> {
//     const updated: IAdoption | null = await this.adoptionsRepository.adoptionIsActive(id);
//     if (!updated) {
//       throw new NotFoundException(`No se encontró la adopción con ID ${id}`);
//     }
//     return updated;
//   }
//   // ------------- ACTIVAR / DESACTIVAR -------------
// }