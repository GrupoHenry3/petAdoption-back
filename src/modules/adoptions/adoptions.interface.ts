import { AdoptionStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export default interface IAdoption {
  id: string;
  petID: string;
  userID: string;
  shelterID: string;
  dni: string;
  birthdate: Date;
  mainReason: string;
  expectations: string;
  previousExperience: string;
  housingType: string;
  homeOwnership: string;
  outerSpace: string;
  workSchedule: string;
  dailyRoutine: string;
  walkingCommitment: string;
  walkingDisposition: string;
  travelFrequency: string;
  householdMembers: number;
  agesChildren?: string[];
  petsQuantity: string;
  petHistory: string;
  additionalInformation: string;
  status: AdoptionStatus;
  RejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  rejectedAt?: Date;
}
