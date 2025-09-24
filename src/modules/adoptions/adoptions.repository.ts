import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdoptionDto } from "./dto/create-adoption.dto";
import IAdoption from "./adoptions.interface";
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