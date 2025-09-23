/**
 * Convierte un Date a hora local sin cambiar el tipo Date
 * @param date Fecha a convertir
 * @returns Nuevo Date ajustado a hora local
 */
export function toLocalDate(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}