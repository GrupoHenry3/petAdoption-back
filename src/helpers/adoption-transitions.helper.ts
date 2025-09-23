// adoption-transitions.helper.ts
import { EAdoptionStatus } from '@prisma/client';
import EAdoptionTransitions from 'src/modules/adoptions/enums/adoption-transitions.enum';

/**
 * Verifica si una transición de estado es válida
 */
export function canTransition(
  current: EAdoptionStatus,
  next: EAdoptionStatus,
): boolean {
  return EAdoptionTransitions[current].includes(next);
}
