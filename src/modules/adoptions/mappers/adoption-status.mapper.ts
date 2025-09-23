import { EAdoptionStatus } from '@prisma/client';

// Convierte enum español a enum de Prisma
export const EAdoptionStatusMapper: Record<EAdoptionStatus, EAdoptionStatus> = {
  [EAdoptionStatus.PENDING]: EAdoptionStatus.PENDING,
  [EAdoptionStatus.APPROVED]: EAdoptionStatus.APPROVED,
  [EAdoptionStatus.REJECTED]: EAdoptionStatus.REJECTED,
  [EAdoptionStatus.WITHDRAWN]: EAdoptionStatus.WITHDRAWN,
};