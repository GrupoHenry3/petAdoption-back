import { EAdoptionStatus } from '@prisma/client';
import EHousingOwnership from "../enums/home-ownership.enum";
import EHousingType from "../enums/housing-Type.enum";
import EOuterSpace from "../enums/outer-space.enum";
import EPetQuantity from "../enums/pet-quantity.enum";
import EPetCareExperience from "../enums/petCare-experience.enum";
import ETravelFrequency from "../enums/travel-frequency.enum";
import EWalkingCommitment from "../enums/walking-commitment.enum";
import EWalkingDisposition from "../enums/walking-disposition.enum";
import EWorkSchedule from "../enums/work-schedule.enum";
import { JsonValue } from "@prisma/client/runtime/library";

interface IAdoption {
  // Identificadores
  id: string;                     // UUID único de la adopción
  petID: string;                  // UUID de la mascota que se desea adoptar
  userID: string;                 // UUID del usuario solicitante de la adopción
  shelterID: string;              // UUID del refugio o albergue donde se encuentra la mascota

  // Información básica del adoptante
  dni: string;                     // Documento de identidad del adoptante
  birthdate: Date;                 // Fecha de nacimiento del adoptante
  mainReason: string;              // Motivo principal por el que desea adoptar
  expectations: string;            // Expectativas del adoptante respecto a la mascota
  previousExperience: string; // Experiencia previa del adoptante cuidando mascotas
  // previousExperience: EPetCareExperience; // Experiencia previa del adoptante cuidando mascotas

  // Condiciones del hogar
  housingType: string;       // Tipo de vivienda (casa, departamento, finca, etc.)
  homeOwnership: string; // Propiedad de la vivienda (propia, alquilada, prestada, otro)
  outerSpace: string;         // Espacio exterior disponible en la vivienda (patio, terraza, jardín, etc.)

  // Estilo de vida
  workSchedule: string;     // Horario laboral del adoptante
  dailyRoutine: string;            // Rutina diaria y disponibilidad para cuidar la mascota
  walkingCommitment: string; // Nivel de compromiso para sacar a pasear a la mascota
  walkingDisposition: string; // Disposición real del adoptante para pasear a la mascota
  travelFrequency: string;     // Frecuencia con la que el adoptante realiza viajes

  // Familia y otras mascotas
  householdMembers: number;        // Número de personas que viven en el hogar
  agesChildren?: JsonValue;         // Edades de los hijos, si los hay
  currentPets?: JsonValue;          // IDs de mascotas actuales que posee el adoptante
  petsQuantity: string;      // Cantidad de mascotas actuales
  petHistory: string;              // Historial de tenencia de mascotas anteriores
  additionalInformation: string;   // Información adicional relevante para la adopción

  // Estado de la adopción
  status: EAdoptionStatus;         // Estado actual de la solicitud (pendiente, aprobada, rechazada)
  RejectionReason?: string | null;        // Motivo de rechazo si la adopción fue denegada
  isActive: boolean;               // Indica si la adopción está activa o cancelada

  // Tiempos
  createdAt: Date;                 // Fecha de creación de la solicitud
  updatedAt: Date                  // Fecha de última actualización de la solicitud
  rejectedAt?: Date | null;               // Fecha de rechazo opcional, solo si se rechazó
}

export default IAdoption;





// interface IAdoption {
//   id: string;
//   questions: string;
//   status: EAdoptionStatus;
//   pets: string;
//   RejectionReason?: string;
//   userID: string;
//   shelterID: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date
// }