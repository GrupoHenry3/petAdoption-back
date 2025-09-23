enum EWalkingDisposition {
  NEVER = 'Nunca',                   // No tiene disposición para pasear
  RARELY = 'Rara vez',               // Pasea 1-2 veces por semana
  OCCASIONALLY = 'Ocasionalmente',   // Pasea algunas veces por semana
  REGULARLY = 'Regularmente',        // Pasea casi todos los días
  DAILY = 'A diario',                // Pasea todos los días sin falta
  OTHER = 'Otro'                     // Otro tipo de disposición o frecuencia
}

export default EWalkingDisposition;