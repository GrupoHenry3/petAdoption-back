import { IsString, IsDate, IsEnum, IsOptional, IsNumber, IsArray, Length, Min, IsDateString } from 'class-validator';
import EHousingOwnership from "../enums/home-ownership.enum";
import EHousingType from "../enums/housing-Type.enum";
import EOuterSpace from "../enums/outer-space.enum";
import EPetCareExperience from "../enums/petCare-experience.enum";
import ETravelFrequency from "../enums/travel-frequency.enum";
import EWalkingCommitment from "../enums/walking-commitment.enum";
import EWorkSchedule from "../enums/work-schedule.enum";
import EWalkingDisposition from '../enums/walking-disposition.enum';
import EPetQuantity from '../enums/pet-quantity.enum';

export class CreateAdoptionDto {
  // Información básica
  @IsString()
  @Length(6, 20)
  dni: string;

  @IsDateString()
  birthdate: Date;

  @IsString()
  mainReason: string;

  @IsString()
  expectations: string;

  @IsEnum(EPetCareExperience, { message: 'La experiencia previa no es válida' })
  previousExperience: EPetCareExperience;

  // Condiciones del hogar
  @IsEnum(EHousingType, { message: 'El tipo de vivienda no es válido' })
  housingType: EHousingType;

  @IsEnum(EHousingOwnership, { message: 'La propiedad de la vivienda no es válida' })
  homeOwnership: EHousingOwnership;

  @IsEnum(EOuterSpace, { message: 'El espacio exterior no es válido' })
  outerSpace: EOuterSpace;

  // Estilo de vida
  @IsEnum(EWorkSchedule, { message: 'El horario laboral no es válido' })
  workSchedule: EWorkSchedule;

  @IsString()
  dailyRoutine: string;

  @IsEnum(EWalkingDisposition, { message: 'La disposición para pasear no es válida' })
  walkingDisposition: EWalkingDisposition;

  @IsEnum(EWalkingCommitment, { message: 'El compromiso de pasear no es válido' })
  walkingCommitment: EWalkingCommitment;

  @IsEnum(ETravelFrequency, { message: 'La frecuencia de viajes no es válida' })
  travelFrequency: ETravelFrequency;

  // Familia y otras mascotas
  @IsNumber()
  @Min(1)
  householdMembers: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  agesChildren?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currentPets?: string[];

  @IsEnum(EPetQuantity, { message: 'La cantidad de mascotas actuales no es válida' })
  petsQuantity: EPetQuantity;

  @IsString()
  petHistory: string;

  @IsString()
  additionalInformation: string;

  // Identificadores de relaciones
  @IsString()
  petID: string;

  @IsString()
  userID: string;

  @IsString()
  shelterID: string;
}



// export class CreateAdoptionDto {
//   @IsUUID()
//   userID: string;

//   @IsUUID()
//   shelterID: string;

//   @IsNotEmpty({ each: true })
//   pets: string;

//   @IsNotEmpty()
//   questions: string;
// }