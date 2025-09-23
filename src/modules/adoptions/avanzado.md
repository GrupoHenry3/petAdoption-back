Perfecto, César. Aquí te genero **la documentación avanzada estilo GitBook**, incluyendo **diagrama de base de datos** y relaciones entre **Usuarios, Refugios y Adopciones**, lista para ser integrada a tu `.md` o GitBook.

---

# Módulo de Adopciones (NestJS) – Documentación Avanzada

Este módulo gestiona **solicitudes de adopción de mascotas**, permitiendo registrar preguntas, controlar el estado de cada adopción y relacionarlas con **usuarios** y **refugios**.

---

## 1. Estructura de carpetas

```text
src/
└── adoptions/
    ├── adoptions.module.ts
    ├── adoptions.controller.ts
    ├── adoptions.service.ts
    ├── dto/
    │   ├── create-adoption.dto.ts
    │   └── update-adoption.dto.ts
    ├── enums/
    │   └── adoption-status.enum.ts
    └── interfaces/
        └── adoption.interface.ts
```

---

## 2. Diagrama de flujo de la lógica de adopción

```mermaid
flowchart TD
    A[Usuario crea solicitud de adopción] --> B{Validar datos}
    B -->|Correcto| C[Crear registro con status PENDING]
    C --> D[Lista de adopciones disponibles para revisión]
    D --> E{Evaluar adopción}
    E -->|Aprobada| F[Actualizar status a APPROVED]
    E -->|Rechazada| G[Actualizar status a REJECTED y registrar motivo]
    F --> H[Notificar usuario]
    G --> H[Notificar usuario]
```

---

## 3. Diagrama de base de datos

```mermaid
erDiagram
    USERS {
        UUID id PK
        VARCHAR name
        VARCHAR email
    }

    SHELTERS {
        UUID id PK
        VARCHAR name
        VARCHAR location
    }

    ADOPTIONS {
        UUID id PK
        TEXT questions
        VARCHAR status
        TEXT rejectionStatus
        UUID userID FK
        UUID shelterID FK
    }

    USERS ||--o{ ADOPTIONS : "realiza"
    SHELTERS ||--o{ ADOPTIONS : "recibe"
```

> **Explicación de relaciones:**
>
> * Un **usuario** puede realizar muchas adopciones.
> * Un **refugio** puede recibir muchas solicitudes de adopción.
> * Cada **adopción** pertenece a un usuario y a un refugio.

---

## 4. Enum `EAdoptionStatus`

```ts
enum EAdoptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export default EAdoptionStatus;
```

---

## 5. Interfaz `IAdoption`

```ts
import EAdoptionStatus from "../enums/adoption-status.enum";

export interface IAdoption {
  id: string;
  questions: string;
  status: EAdoptionStatus;
  pets: string[];
  rejectionStatus?: string;
  userID: string;
  shelterID: string;
}
```

---

## 6. DTOs

### a) `CreateAdoptionDto`

```ts
import { IsString, IsUUID, IsArray } from 'class-validator';

export class CreateAdoptionDto {
  @IsString()
  questions: string;

  @IsArray()
  @IsString({ each: true })
  pets: string[];

  @IsUUID()
  userID: string;

  @IsUUID()
  shelterID: string;
}
```

### b) `UpdateAdoptionDto`

```ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAdoptionDto } from './create-adoption.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import EAdoptionStatus from '../enums/adoption-status.enum';

export class UpdateAdoptionDto extends PartialType(CreateAdoptionDto) {
  @IsOptional()
  @IsEnum(EAdoptionStatus)
  status?: EAdoptionStatus;

  @IsOptional()
  @IsString()
  rejectionStatus?: string;
}
```

---

## 7. Servicio `AdoptionsService`

Gestiona la lógica de negocio:

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IAdoption } from './interfaces/adoption.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';
import EAdoptionStatus from './enums/adoption-status.enum';

@Injectable()
export class AdoptionsService {
  private adoptions: IAdoption[] = [];

  create(createAdoptionDto: CreateAdoptionDto): IAdoption {
    const newAdoption: IAdoption = {
      id: uuidv4(),
      status: EAdoptionStatus.PENDING,
      ...createAdoptionDto,
    };
    this.adoptions.push(newAdoption);
    return newAdoption;
  }

  findAll(): IAdoption[] {
    return this.adoptions;
  }

  findOne(id: string): IAdoption {
    const adoption = this.adoptions.find(a => a.id === id);
    if (!adoption) throw new NotFoundException(`Adoption with ID ${id} not found`);
    return adoption;
  }

  update(id: string, updateData: UpdateAdoptionDto): IAdoption {
    const adoption = this.findOne(id);
    Object.assign(adoption, updateData);
    return adoption;
  }

  remove(id: string): void {
    const index = this.adoptions.findIndex(a => a.id === id);
    if (index === -1) throw new NotFoundException(`Adoption with ID ${id} not found`);
    this.adoptions.splice(index, 1);
  }
}
```

---

## 8. Controlador `AdoptionsController`

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { UpdateAdoptionDto } from './dto/update-adoption.dto';

@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Post()
  create(@Body() createAdoptionDto: CreateAdoptionDto) {
    return this.adoptionsService.create(createAdoptionDto);
  }

  @Get()
  findAll() {
    return this.adoptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionDto: UpdateAdoptionDto) {
    return this.adoptionsService.update(id, updateAdoptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionsService.remove(id);
  }
}
```

---

## 9. Módulo `AdoptionsModule`

```ts
import { Module } from '@nestjs/common';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsController } from './adoptions.controller';

@Module({
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}
```

---

## 10. Ejemplos de uso (API REST)

| Método | Ruta             | Descripción                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/adoptions`     | Crear nueva adopción        |
| GET    | `/adoptions`     | Listar todas las adopciones |
| GET    | `/adoptions/:id` | Obtener adopción por ID     |
| PATCH  | `/adoptions/:id` | Actualizar adopción         |
| DELETE | `/adoptions/:id` | Eliminar adopción           |

**Body de ejemplo para crear adopción:**

```json
{
  "questions": "Tengo experiencia con perros pequeños y un patio amplio",
  "pets": ["dog-uuid-1", "dog-uuid-2"],
  "userID": "user-uuid-123",
  "shelterID": "shelter-uuid-456"
}
```

---

Si quieres, puedo **hacer una versión con diagrama visual tipo UML de clases y relaciones entre servicios y controladores**, que quedaría perfecta para GitBook o presentación profesional.

¿Quieres que haga ese diagrama UML también?
