import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdoptionDto } from "./dto/create-adoption.dto";
import IAdoption from "./interfaces/adoptions.interface";
import { EAdoptionStatusMapper } from "./mappers/adoption-status.mapper";
import { Prisma, EAdoptionStatus } from '@prisma/client';


@Injectable()
export class AdoptionsRepository {
  constructor(private prisma: PrismaService) { }

  // -------------------- CREATE --------------------
  async createAdoption(newAdoption: CreateAdoptionDto): Promise<IAdoption> {
    const adoption = await this.prisma.adoption.create({
      data: {
        petID: newAdoption.petID,
        userID: newAdoption.userID,
        shelterID: newAdoption.shelterID,
        dni: newAdoption.dni,
        birthdate: new Date(newAdoption.birthdate),
        mainReason: newAdoption.mainReason,
        expectations: newAdoption.expectations,
        previousExperience: newAdoption.previousExperience,
        housingType: newAdoption.housingType,
        homeOwnership: newAdoption.homeOwnership,
        outerSpace: newAdoption.outerSpace,
        workSchedule: newAdoption.workSchedule,
        dailyRoutine: newAdoption.dailyRoutine,
        walkingCommitment: newAdoption.walkingCommitment,
        walkingDisposition: newAdoption.walkingDisposition,
        travelFrequency: newAdoption.travelFrequency,
        householdMembers: newAdoption.householdMembers,
        agesChildren: newAdoption.agesChildren as any,
        currentPets: newAdoption.currentPets as any,
        petsQuantity: newAdoption.petsQuantity,
        petHistory: newAdoption.petHistory,
        additionalInformation: newAdoption.additionalInformation,
        status: EAdoptionStatusMapper[EAdoptionStatus.PENDING], // ✅ Mapper
        isActive: true,
      },
    });
    return adoption as IAdoption;
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  async getAllAdoption(): Promise<IAdoption[]> {
    return this.prisma.adoption.findMany();
  }

  async getByIdAdoption(id: string): Promise<IAdoption | null> {
    return this.prisma.adoption.findUnique({ where: { id } });
  }

  // ---------------- UPDATE STATUS -----------------
  async updateAdoptionStatus(
    id: string,
    status: EAdoptionStatus,
    rejectionReason?: string
  ): Promise<IAdoption | null> {
    const adoption = await this.prisma.adoption.findUnique({ where: { id } });
    if (!adoption) return null;

    return this.prisma.adoption.update({
      where: { id },
      data: {
        status: EAdoptionStatusMapper[status],
        updatedAt: new Date(),
        rejectedAt: status === EAdoptionStatus.REJECTED ? new Date() : null,
        RejectionReason:
          status === EAdoptionStatus.REJECTED
            ? rejectionReason || "Sin motivo especificado"
            : null,
      },
    });
  }

  // -------------------- UPDATE --------------------
  async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<IAdoption | null> {
    try {
      // Ignorar campos que no se pueden actualizar
      const { id: _, petID: __, userID: ___, shelterID: ____, ...rest } = updateData;

      // Mapear campos JSON
      const updatableData: Prisma.AdoptionUpdateInput = {
        ...rest,
        agesChildren: rest.agesChildren ?? undefined, // number[] -> JsonValue
        currentPets: rest.currentPets ?? undefined,   // string[] -> JsonValue
        updatedAt: new Date(),
        RejectionReason: rest.RejectionReason ?? undefined,
        rejectedAt: rest.rejectedAt ?? undefined,
      };

      const updated = await this.prisma.adoption.update({
        where: { id },
        data: updatableData,
      });

      return updated;
    } catch {
      return null;
    }
  }


  // -------------------- DELETE --------------------
  async deleteAdoption(id: string): Promise<boolean> {
    try {
      await this.prisma.adoption.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // ------------- ACTIVAR / DESACTIVAR -------------
  async adoptionIsActive(id: string): Promise<IAdoption | null> {
    const adoption = await this.prisma.adoption.findUnique({ where: { id } });
    if (!adoption) return null;

    return this.prisma.adoption.update({
      where: { id },
      data: {
        isActive: !adoption.isActive,
        updatedAt: new Date(),
      },
    });
  }
}








// import { Injectable } from "@nestjs/common";
// import { v4 as uuidv4 } from 'uuid';
// import EAdoptionStatus from "./enums/adoption-status.enum";
// import { CreateAdoptionDto } from "./dto/create-adoption.dto";
// import IAdoption from "./interfaces/adoptions.interface";
// import { toLocalDate } from "src/utils/dateUtils";

// @Injectable()
// export class AdoptionsRepository {
//   private adoptions: IAdoption[] = [];

//   // -------------------- CREATE --------------------
//   async createAdoption(newAdoption: CreateAdoptionDto): Promise<IAdoption> {
//     const adoption: IAdoption = {
//       id: uuidv4(),
//       petID: newAdoption.petID,
//       userID: newAdoption.userID,
//       shelterID: newAdoption.shelterID,
//       // Información adoptante
//       dni: newAdoption.dni,
//       birthdate: newAdoption.birthdate,
//       mainReason: newAdoption.mainReason,
//       expectations: newAdoption.expectations,
//       previousExperience: newAdoption.previousExperience,
//       // Condiciones del hogar
//       housingType: newAdoption.housingType,
//       homeOwnership: newAdoption.homeOwnership,
//       outerSpace: newAdoption.outerSpace,
//       // Estilo de vida
//       workSchedule: newAdoption.workSchedule,
//       dailyRoutine: newAdoption.dailyRoutine,
//       walkingCommitment: newAdoption.walkingCommitment,
//       walkingDisposition: newAdoption.walkingDisposition,
//       travelFrequency: newAdoption.travelFrequency,
//       // Familia y otras mascotas
//       householdMembers: newAdoption.householdMembers,
//       agesChildren: newAdoption.agesChildren,
//       currentPets: newAdoption.currentPets,
//       petsQuantity: newAdoption.petsQuantity,
//       petHistory: newAdoption.petHistory,
//       additionalInformation: newAdoption.additionalInformation,
//       // Estado
//       status: EAdoptionStatus.PENDING,
//       RejectionReason: "",
//       isActive: true,
//       // Fechas
//       createdAt: toLocalDate(new Date()),
//       updatedAt: toLocalDate(new Date()),
//     };
//     this.adoptions.push(adoption);
//     return adoption;
//   }
//   // -------------------- CREATE --------------------

//   // --------------------- READ ---------------------
//   async getAllAdoption(): Promise<IAdoption[]> {
//     return this.adoptions;
//   }

//   async getByIdAdoption(id: string): Promise<IAdoption | null> {
//     const adoption = this.adoptions.find((adoption) => adoption.id === id);
//     return adoption ?? null;
//   }
//   // --------------------- READ ---------------------

//   // ---------------- UPDATE STATUS -----------------
//   async updateAdoptionStatus(id: string, status: EAdoptionStatus, rejectionReason?: string): Promise<IAdoption | null> {
//     const adoption: IAdoption | null = await this.getByIdAdoption(id);
//     if (!adoption) return null;
//     adoption.status = status;
//     adoption.updatedAt = toLocalDate(new Date());
//     if (status === EAdoptionStatus.REJECTED) {
//       adoption.rejectedAt = new Date(); // 👈 guardamos cuándo se rechazó
//       adoption.RejectionReason = rejectionReason || 'Sin motivo especificado';
//     }
//     if (status !== EAdoptionStatus.REJECTED) {
//       adoption.RejectionReason = '';
//     }
//     return adoption;
//   }
//   // ---------------- UPDATE STATUS -----------------

//   // -------------------- UPDATE --------------------
//   async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<IAdoption | null> {
//     const adoptionIndex = this.adoptions.findIndex((adoption) => adoption.id === id);
//     if (adoptionIndex === -1) {
//       return null; // dejamos que el service maneje el error
//     }
//     // Mezclar datos anteriores con los nuevos
//     this.adoptions[adoptionIndex] = {
//       ...this.adoptions[adoptionIndex],
//       ...updateData,
//       updatedAt: toLocalDate(new Date()), // siempre refrescamos la fecha
//     };
//     return this.adoptions[adoptionIndex];
//   }
//   // -------------------- UPDATE --------------------

//   // -------------------- DELETE --------------------
//   async deleteAdoption(id: string): Promise<boolean> {
//     const adoptionIndex: number = this.adoptions.findIndex((adoption) => adoption.id === id);
//     if (adoptionIndex === -1) {
//       return false;
//     }
//     this.adoptions.splice(adoptionIndex, 1);
//     return true;
//   }
//   // -------------------- DELETE --------------------

//   // ------------- ACTIVAR / DESACTIVAR -------------
//   async adoptionIsActive(id: string): Promise<IAdoption | null> {
//     const adoptionIndex: number = this.adoptions.findIndex((adoption) => adoption.id === id);
//     if (adoptionIndex === -1) {
//       return null; // lo maneja el service
//     }
//     // Alternar valor actual de isActive
//     this.adoptions[adoptionIndex].isActive = !this.adoptions[adoptionIndex].isActive;
//     this.adoptions[adoptionIndex].updatedAt = new Date();
//     return this.adoptions[adoptionIndex];
//   }
//   // ------------- ACTIVAR / DESACTIVAR -------------
// }

















// // import { Injectable } from "@nestjs/common";
// // import { PrismaService } from "src/prisma/prisma.service";
// // import { CreateAdoptionDto } from "./dto/create-adoption.dto";
// // import IAdoption from "./interfaces/adoptions.interface";
// // import EAdoptionStatus from "./enums/adoption-status.enum";

// // @Injectable()
// // export class AdoptionsRepository {
// //   constructor(private readonly prisma: PrismaService) {}

// //   // -------------------- CREATE --------------------
// //   async createAdoption(newAdoption: CreateAdoptionDto): Promise<object> {
// //     return this.prisma.adoption.create({
// //       data: {
// //         petID: newAdoption.petID,
// //         userID: newAdoption.userID,
// //         shelterID: newAdoption.shelterID,
// //         dni: newAdoption.dni,
// //         birthdate: new Date(newAdoption.birthdate),
// //         mainReason: newAdoption.mainReason,
// //         expectations: newAdoption.expectations,
// //         previousExperience: newAdoption.previousExperience,
// //         housingType: newAdoption.housingType,
// //         homeOwnership: newAdoption.homeOwnership,
// //         outerSpace: newAdoption.outerSpace,
// //         workSchedule: newAdoption.workSchedule,
// //         dailyRoutine: newAdoption.dailyRoutine,
// //         walkingCommitment: newAdoption.walkingCommitment,
// //         walkingDisposition: newAdoption.walkingDisposition,
// //         travelFrequency: newAdoption.travelFrequency,
// //         householdMembers: newAdoption.householdMembers,
// //         agesChildren: newAdoption.agesChildren,
// //         currentPets: newAdoption.currentPets,
// //         petsQuantity: newAdoption.petsQuantity,
// //         petHistory: newAdoption.petHistory,
// //         additionalInformation: newAdoption.additionalInformation,
// //         status: EAdoptionStatus.PENDING,
// //         RejectionReason: "",
// //         isActive: true,
// //       },
// //     });
// //   }

// //   // --------------------- READ ---------------------
// //   async getAllAdoption(): Promise<object> {
// //     return this.prisma.adoption.findMany();
// //   }

// //   async getByIdAdoption(id: string): Promise<object | null> {
// //     return this.prisma.adoption.findUnique({
// //       where: { id },
// //     });
// //   }

// //   // ---------------- UPDATE STATUS -----------------
// //   async updateAdoptionStatus(id: string, status: EAdoptionStatus, rejectionReason?: string): Promise<object | null> {
// //     return this.prisma.adoption.update({
// //       where: { id },
// //       data: {
// //         status,
// //         RejectionReason:
// //           status === EAdoptionStatus.REJECTED
// //             ? rejectionReason || "Sin motivo especificado"
// //             : "",
// //         rejectedAt: status === EAdoptionStatus.REJECTED ? new Date() : null,
// //       },
// //     });
// //   }

// //   // -------------------- UPDATE --------------------
// //   async updateAdoption(id: string, updateData: Partial<IAdoption>): Promise<object> {
// //     return this.prisma.adoption.update({
// //       where: { id },
// //       data: {
// //         ...updateData,
// //         updatedAt: new Date(),
// //       },
// //     });
// //   }

// //   // -------------------- DELETE --------------------
// //   async deleteAdoption(id: string): Promise<boolean> {
// //     try {
// //       await this.prisma.adoption.delete({
// //         where: { id },
// //       });
// //       return true;
// //     } catch {
// //       return false;
// //     }
// //   }

// //   // ------------- ACTIVAR / DESACTIVAR -------------
// //   async adoptionIsActive(id: string): Promise<object | null> {
// //     const adoption = await this.getByIdAdoption(id);
// //     if (!adoption) return null;

// //     return this.prisma.adoption.update({
// //       where: { id },
// //       data: {
// //         isActive: !adoption.isActive,
// //         updatedAt: new Date(),
// //       },
// //     });
// //   }
// // }