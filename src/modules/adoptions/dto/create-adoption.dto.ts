import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  Length,
  Min,
  IsDateString,
} from 'class-validator';
import {
  EHousingOwnership,
  EHousingType,
  EOuterSpace,
  EPetCareExperience,
  EPetQuantity,
  ETravelFrequency,
  EWalkingCommitment,
  EWalkingDisposition,
  EWorkSchedule,
} from '../adoptions.enum';

export class CreateAdoptionDto {
  @IsString()
  @Length(6, 20)
  dni: string;

  @IsDateString()
  birthate: Date;

  @IsString()
  mainReason: string;

  @IsString()
  expectations: string;

  @IsEnum(EPetCareExperience, { message: 'La experiencia previa no es válida' })
  previousExperience: EPetCareExperience;

  @IsEnum(EHousingType, { message: 'El tipo de vivienda no es válido' })
  housingType: EHousingType;

  @IsEnum(EHousingOwnership, { message: 'La propiedad de la vivienda no es válida' })
  homeOwnership: EHousingOwnership;

  @IsEnum(EOuterSpace, { message: 'El espacio exterior no es válido' })
  outerSpace: EOuterSpace;

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

  @IsString()
  petID: string;

  @IsString()
  userID: string;

  @IsString()
  shelterID: string;
}
