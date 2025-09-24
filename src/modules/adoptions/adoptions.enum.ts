export enum EHousingOwnership {
  OWNED = 'Propia',
  RENTED = 'Alquilada',
  BORROWED = 'Prestada',
  OTHER = 'Otro',
}

export enum EHousingType {
  HOUSE_WITH_YARD = 'Casa con patio/jardín',
  HOUSE_NO_YARD = 'Casa sin patio',
  APARTMENT = 'Departamento / Piso',
  FARM = 'Finca / Granja',
  OTHER = 'Otro',
}

export enum EOuterSpace {
  NONE = 'Sin espacio exterior',
  BALCONY_TERRACE = 'Balcón/Terraza',
  SMALL_PATIO = 'Patio pequeño',
  LARGE_YARD = 'Jardín amplio',
  OTHER = 'Otro',
}

export enum EPetQuantity {
  NONE = 'Ninguna',
  ONE = 'Una',
  TWO = 'Dos',
  THREE = 'Tres',
  FOUR_OR_MORE = 'Cuatro o más',
  OTHER = 'Otro',
}

export enum EPetCareExperience {
  NONE = 'Sin experiencia - Nunca ha cuidado mascotas',
  BASIC = 'Básica - Cuidó una mascota por poco tiempo',
  MODERATE = 'Intermedia - Ha cuidado varias mascotas con responsabilidad regular',
  ADVANCED = 'Avanzada - Experiencia amplia: múltiples mascotas durante años',
  PROFESSIONAL = 'Profesional - Veterinario, rescatista, voluntario en refugio, entrenador, etc.',
}

export enum ETravelFrequency {
  NEVER = 'Nunca',
  RARELY = 'Rara vez',
  OCCASIONALLY = 'Ocasionalmente',
  FREQUENT = 'Frecuente',
  VERY_FREQUENT = 'Muy frecuente',
  OTHER = 'Otro',
}

export enum EWalkingCommitment {
  LOW = 'Bajo',
  MODERATE = 'Moderado',
  HIGH = 'Alto',
  VERY_HIGH = 'Muy alto',
  OTHER = 'Otro',
}

export enum EWalkingDisposition {
  NEVER = 'Nunca',
  RARELY = 'Rara vez',
  OCCASIONALLY = 'Ocasionalmente',
  REGULARLY = 'Regularmente',
  DAILY = 'A diario',
  OTHER = 'Otro',
}

export enum EWorkSchedule {
  FULL_TIME = 'Jornada completa',
  PART_TIME = 'Medio tiempo',
  REMOTE = 'Trabajo remoto',
  SHIFT_WORK = 'Trabajo por turnos',
  FLEXIBLE = 'Horario flexible',
  UNEMPLOYED = 'Desempleado',
  OTHER = 'Otro',
}
