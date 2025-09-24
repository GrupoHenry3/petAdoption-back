import { AdoptionStatus } from '@prisma/client';

// Convierte enum español a enum de Prisma
export const EAdoptionStatusMapper: Record<AdoptionStatus, AdoptionStatus> = {
  [AdoptionStatus.Pending]: AdoptionStatus.Pending,
  [AdoptionStatus.Approved]: AdoptionStatus.Approved,
  [AdoptionStatus.Rejected]: AdoptionStatus.Rejected,
  [AdoptionStatus.Withdrawn]: AdoptionStatus.Withdrawn,
};
