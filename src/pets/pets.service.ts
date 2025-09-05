import { Injectable } from '@nestjs/common';

@Injectable()
export class PetsService {
  getAll() {
    return 'This action returns all pets';
  }
}
