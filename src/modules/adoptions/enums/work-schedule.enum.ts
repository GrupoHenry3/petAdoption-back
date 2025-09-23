enum EWorkSchedule {
  FULL_TIME = 'Jornada completa',     // Trabajo de tiempo completo (ej. 8h diarias)
  PART_TIME = 'Medio tiempo',         // Trabajo de medio tiempo
  REMOTE = 'Trabajo remoto',          // Home office o teletrabajo
  SHIFT_WORK = 'Trabajo por turnos',  // Jornadas rotativas (día/noche)
  FLEXIBLE = 'Horario flexible',      // Horario adaptable según el día
  UNEMPLOYED = 'Desempleado',         // Actualmente sin empleo
  OTHER = 'Otro'                      // Otro tipo de horario
}

export default EWorkSchedule;