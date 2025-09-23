import { EAdoptionStatus } from '@prisma/client';

/**
 * Define las transiciones de estado válidas
 * Ejemplo:
 *  - Una solicitud en "Pending" puede pasar a "Approved", "Rejected" o "Withdrawn".
 *  - Una vez "Approved", ya no se puede modificar.
 */
const EAdoptionTransitions: Record<EAdoptionStatus, EAdoptionStatus[]> = {
  [EAdoptionStatus.PENDING]: [
    EAdoptionStatus.APPROVED,
    EAdoptionStatus.REJECTED,
    EAdoptionStatus.WITHDRAWN,
  ],
  [EAdoptionStatus.APPROVED]: [], // estado final
  [EAdoptionStatus.REJECTED]: [], // estado final
  [EAdoptionStatus.WITHDRAWN]: [], // estado final
};

export default EAdoptionTransitions;