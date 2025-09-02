# 🚀 Guía de Instalación y Configuración de un Proyecto NestJS desde Cero

Este documento explica paso a paso cómo instalar, configurar y ejecutar un proyecto básico con **NestJS**, el framework progresivo para construir aplicaciones de servidor eficientes y escalables con Node.js.

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* **Node.js** v16 o superior
  [https://nodejs.org](https://nodejs.org)

* **npm** (incluido con Node.js) o **Yarn**

* **Nest CLI** (se instalará más abajo)

---

## 🧰 Paso 1: Instalar el CLI de NestJS

 - Instalación Global:

```bash
npm isntall -g @nestjs/cli
```

 - Instalación Local:

```bash
npm install --save-dev @nestjs/cli
```
<br>

## Paso 2: Verificar la instalación

 - Verificación Global:

```bash
nest -v || nest --version
```

 - Verificación Local:

```bash
npx nest -v || npx nest --version
```
<br>

---

## 📦 Paso 3: Crear un nuevo proyecto con NestJS CLI

 - Para instalación Global:

```bash
nest new project-name
```

 - Para instalacióm Local:

```bash
npx nest new project-name
```

**NOTA:** Durante la instalación, te preguntará qué gestor de paquetes deseas usar (npm o yarn). Elige el que prefieras.

Esto creará una estructura de carpetas como la siguiente:

```
nombre-proyecto/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── tsconfig.json
└── ...
```

---

## 🛠️ Paso 4: Ejecutar el servidor en modo desarrollo

Accede a la carpeta del proyecto:

```bash
cd nombre-proyecto
```

Instalar dependencias del proyecto creado:

```bash
npm install
```

Inicia el servidor:

```bash
npm run start:dev
```

Esto compila el proyecto y recarga automáticamente cuando haces cambios.

Por defecto, el servidor corre en:

```
http://localhost:3000
```

---

## 🧱 Estructura básica del proyecto

| Archivo             | Función                                                 |
| ------------------- | ------------------------------------------------------- |
| `main.ts`           | Punto de entrada principal del servidor                 |
| `app.module.ts`     | Módulo raíz donde se importan controladores y servicios |
| `app.controller.ts` | Define las rutas y respuestas HTTP                      |
| `app.service.ts`    | Contiene la lógica del negocio                          |

---
---
---
---

## 🧩 Paso 5: Crear un nuevo módulo, controlador y servicio

Con el CLI de NestJS puedes generar componentes fácilmente:

```bash
nest generate module users
nest generate controller users
nest generate service users
```

Esto generará una carpeta `/users` con sus respectivos archivos.

---

## 🧪 Paso 6: Ejecutar pruebas (opcional)

NestJS incluye soporte para pruebas con Jest:

```bash
npm run test
```

---

## 📚 Recursos adicionales

* Documentación oficial: [https://docs.nestjs.com](https://docs.nestjs.com)
* NestJS GitHub: [https://github.com/nestjs/nest](https://github.com/nestjs/nest)

---

## ✅ Proyecto listo para trabajar

Tu entorno NestJS está listo. A partir de aquí puedes comenzar a desarrollar módulos, controladores, servicios, middlewares, pipes, y conectar con bases de datos.

---
---
---

# 🧪 Comando: `npx nest g res users`

Este documento explica qué hace el comando `npx nest g res users` en un proyecto NestJS, cómo funciona y qué estructura genera.

---

## 🧠 ¿Qué hace este comando?

El comando:

```bash
npx nest g res users
```

o su forma larga:

```bash
npx nest generate resource users
```

genera automáticamente un **recurso completo en NestJS** llamado `users`. Esto incluye módulo, controlador, servicio, DTOs y entidad, siguiendo la arquitectura recomendada por el framework.

---

## 🧱 Desglose del Comando

| Componente         | Función                                                        |
| ------------------ | -------------------------------------------------------------- |
| `npx`              | Ejecuta el CLI de Nest sin necesidad de instalarlo globalmente |
| `nest`             | Ejecuta el CLI de NestJS                                       |
| `g` o `generate`   | Comando para generar archivos automáticamente                  |
| `res` o `resource` | Tipo de estructura que se va a crear (recurso REST o GraphQL)  |
| `users`            | Nombre del recurso a generar                                   |

---

## 🚧 Proceso interactivo

Al ejecutar el comando, el CLI te preguntará:

```bash
? What transport layer do you use? (Use arrow keys)
❯ REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice
  WebSockets
```

Selecciona **REST API** si estás creando un servicio CRUD tradicional.

También te preguntará si deseas generar un CRUD básico de forma automática.

---

## 📂 Estructura generada

Al ejecutar este comando, se crea una carpeta `src/users/` con la siguiente estructura:

```
src/
└── users/
    ├── dto/
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    ├── entities/
    │   └── user.entity.ts
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts
```

---

## ⚙️ Archivos generados

| Archivo                   | Descripción                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `users.module.ts`         | Módulo que agrupa el controlador y servicio                        |
| `users.controller.ts`     | Define las rutas REST (`GET`, `POST`, etc.)                        |
| `users.service.ts`        | Lógica de negocio (crear, listar, actualizar, eliminar)            |
| `dto/create-user.dto.ts`  | Estructura de datos para crear un usuario                          |
| `dto/update-user.dto.ts`  | Estructura de datos para actualizar un usuario                     |
| `entities/user.entity.ts` | Representación del modelo `User`, útil si se usa una base de datos |

---

## 📌 Ejemplo de rutas generadas

```ts
// users.controller.ts

@Post()
create(@Body() createUserDto: CreateUserDto) {}

@Get()
findAll() {}

@Get(':id')
findOne(@Param('id') id: string) {}

@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {}

@Delete(':id')
remove(@Param('id') id: string) {}
```

---

## ✅ ¿Cuándo usar este comando?

Este comando es útil cuando deseas:

* Crear una funcionalidad nueva (como `users`, `products`, `orders`, etc.)
* Implementar rápidamente una API REST con NestJS
* Seguir una estructura modular limpia y escalable

---

## 🧩 Recomendaciones

* Complementa este recurso con validación usando `class-validator`
* Conecta el servicio con una base de datos usando TypeORM o Prisma
* Aplica control de errores y autenticación con middleware o guards

---

## 📚 Recursos adicionales

* [Documentación oficial de NestJS](https://docs.nestjs.com/cli/usages#generate)
* [Guía de módulos y controladores](https://docs.nestjs.com/controllers)
* [CLI de NestJS](https://docs.nestjs.com/cli/overview)

---
---
---

# 🧪 Comando: `npx nest g mi logger`

Este documento explica el propósito y uso del comando `npx nest g mi logger` dentro de un proyecto NestJS, qué significa cada parte del comando y qué estructura genera.

---

## 🧠 ¿Qué hace este comando?

El comando:

```bash
npx nest g mi logger
```

es una abreviación del comando largo:

```bash
npx nest generate middleware logger
```

Este comando **genera un middleware llamado `logger`**, utilizando el CLI de NestJS.

---

## 🧱 Desglose del comando

| Parte               | Significado                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `npx`               | Ejecuta el CLI de Nest sin instalarlo globalmente                      |
| `nest`              | Ejecuta el comando del CLI de NestJS                                   |
| `g` o `generate`    | Genera un nuevo artefacto                                              |
| `mi` o `middleware` | Indica que se va a generar un **middleware**                           |
| `logger`            | Es el **nombre del middleware** (Nest generará `logger.middleware.ts`) |

---

## 📁 Estructura generada

```bash
src/
└── logger/
    └── logger.middleware.ts
```

Este archivo contiene una clase básica de middleware, que puedes personalizar según tus necesidades.

---

## 📄 Contenido generado por defecto

```ts
// src/logger/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

---

## 🧩 ¿Qué es un middleware en NestJS?

Un **middleware** es una función que se ejecuta **antes de que una solicitud llegue al controlador**. Es útil para:

* Registrar logs
* Verificar autenticación
* Validar tokens
* Medir tiempos de respuesta
* Modificar objetos `req` o `res`

---

## 🛠️ ¿Cómo se usa este middleware?

Para aplicarlo en un módulo específico:

```ts
// src/app.module.ts o cualquier otro módulo

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
```

---

## ✅ ¿Cuándo usar este comando?

Utiliza este comando cuando necesites crear lógica que se ejecute:

* Antes de que entren las solicitudes a los controladores
* De forma global o por ruta/módulo
* Para aplicar lógica transversal como logging, verificación o formateo de cabeceras

---

## 📚 Recursos recomendados

* [Documentación oficial de Middlewares en NestJS](https://docs.nestjs.com/middleware)
* [Nest CLI - Comandos disponibles](https://docs.nestjs.com/cli/overview)

---
---
---

# 📘 Aplicar un Middleware a un Módulo Específico en NestJS

En NestJS, puedes aplicar un middleware solo a un **módulo específico** en lugar de toda la aplicación. Esto es útil cuando deseas que el middleware solo afecte ciertas rutas o recursos (por ejemplo, solo `/users`).

---

## 🛠️ Paso 1: Crear el Middleware

```ts
// src/middleware/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Estás ejecutando un método ${req.method} en la ruta ${req.originalUrl}`);
    next();
  }
}
```

---

## 🧱 Paso 2: Aplicar el Middleware en el Módulo Deseado

Por ejemplo, si tienes un módulo llamado `UsersModule`:

```ts
// src/users/users.module.ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Se aplica solo a rutas definidas en este módulo
  }
}
```

> 📝 **Nota:** `.forRoutes('*')` aplica el middleware a todas las rutas del módulo. Puedes ser más específico si lo necesitas.

---

## ✅ Resultado Esperado

Al hacer una petición como:

```bash
GET /users
```

La consola mostrará:

```
Estás ejecutando un método GET en la ruta /users
```

Pero si accedes a otra ruta definida en otro módulo (por ejemplo, `/auth/login`), **el middleware no se ejecutará**.

---

## 🧩 Extras

Puedes aplicar el middleware solo a rutas específicas del módulo:

```ts
consumer
  .apply(LoggerMiddleware)
  .forRoutes('users', 'users/:id');
```

O usar `RequestMethod` para restringir por método HTTP:

```ts
import { RequestMethod } from '@nestjs/common';

consumer
  .apply(LoggerMiddleware)
  .forRoutes({ path: 'users', method: RequestMethod.POST });
```

---
---
---

# 🌐 Aplicar Middleware de Forma Global en NestJS

En esta guía aprenderás cómo registrar y aplicar un **middleware global** en una aplicación NestJS. Esto es útil cuando deseas ejecutar lógica **antes de que cualquier controlador maneje una petición**, como por ejemplo:

* Registro de logs
* Validación de tokens
* Seguimiento de IPs
* Configuración de cabeceras

---

## 🧱 ¿Qué es un Middleware en NestJS?

Un middleware en NestJS es una función que se ejecuta entre la solicitud del cliente y el controlador. Se basa en el middleware de Express (por defecto), y permite acceder al `Request`, `Response` y a una función `next()`.

---

## 🛠️ Método 1: Middleware global desde `main.ts` (función estilo Express)

### ✅ Paso 1: Crear el middleware

```ts
// src/middleware/logger.middleware.ts

import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Estás ejecutando un método ${req.method} en la ruta ${req.originalUrl}`);
  next();
}
```

### ✅ Paso 2: Usarlo globalmente en `main.ts`

```ts
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(logger); // Middleware global
  
  await app.listen(3000);
}
bootstrap();
```

> 📝 Este método **no usa inyección de dependencias**, pero es ideal para middlewares simples o de terceros como `helmet`, `cors`, etc.

---

## 🛠️ Método 2: Middleware global usando clase con `@Injectable()`

### ✅ Paso 1: Crear el middleware como clase

```ts
// src/middleware/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Estás ejecutando un método ${req.method} en la ruta ${req.originalUrl}`);
    next();
  }
}
```

### ✅ Paso 2: Registrar el middleware en `AppModule`

```ts
// src/app.module.ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Aplica a todas las rutas
  }
}
```

> 📝 Este enfoque **permite usar dependencias del sistema**, útil si tu middleware necesita servicios de NestJS.

---

## ✅ Resultado esperado

Cuando accedes a cualquier ruta, por ejemplo:

```bash
GET http://localhost:3000/users
```

Verás en la consola:

```
Estás ejecutando un método GET en la ruta /users
```

---

## 🧩 Diferencias entre los dos métodos

| Método                         | Soporta inyección de dependencias | Ideal para...                          |
| ------------------------------ | --------------------------------- | -------------------------------------- |
| `app.use()` en `main.ts`       | ❌                                 | Middlewares simples o externos         |
| `MiddlewareConsumer` en módulo | ✅                                 | Middlewares que usan lógica de negocio |

---

## 🧠 Consejo adicional

Puedes combinar middlewares globales con middlewares específicos por módulo o ruta para tener un control más fino sobre la lógica de entrada.

---
---
---

# 📦 Cómo Crear un Módulo Completo en NestJS

Este documento explica cómo crear un módulo funcional en NestJS que incluya:
✅ Módulo (`.module.ts`)
✅ Controlador (`.controller.ts`)
✅ Servicio (`.service.ts`)
✅ DTOs (opcional)
✅ Inyección de dependencias

---

## 🧱 Paso 1: Generar el módulo, controlador y servicio

Usa el CLI de NestJS para generar los archivos base:

```bash
nest g module users
nest g controller users
nest g service users
```

Esto creará la estructura:

```
src/
└── users/
    ├── users.controller.ts
    ├── users.module.ts
    ├── users.service.ts
```

---

## 🧾 Paso 2: Crear el DTO (opcional pero recomendado)

Los DTO (Data Transfer Objects) se usan para definir la forma de los datos entrantes.

```ts
// src/users/dto/create-user.dto.ts

export class CreateUserDto {
  name: string;
  email: string;
}
```

---

## 🧑‍💻 Paso 3: Implementar el Servicio (`users.service.ts`)

```ts
// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [];

  create(userDto: CreateUserDto) {
    const newUser = { id: Date.now(), ...userDto };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }
}
```

---

## 🌐 Paso 4: Implementar el Controlador (`users.controller.ts`)

```ts
// src/users/users.controller.ts

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }
}
```

---

## 🧩 Paso 5: Configurar el Módulo (`users.module.ts`)

```ts
// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

## 🔌 Paso 6: Importar el módulo en `AppModule`

```ts
// src/app.module.ts

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

---

## 🚀 Resultado Final

Con esto, tienes un módulo llamado `Users` que:

* Responde a `GET /users` → devuelve todos los usuarios.
* Responde a `GET /users/:id` → devuelve un usuario por ID.
* Responde a `POST /users` → crea un usuario (requiere `name` y `email`).

---

## ✅ Buenas prácticas adicionales

* Usa `DTOs` y `Pipes` para validar datos (`class-validator` y `ValidationPipe`).
* Usa interfaces o clases para los modelos de datos.
* Separa los DTOs en una carpeta `/dto`.
* Considera usar una base de datos y un ORM como Prisma o TypeORM.

---
---
---

# 🧩 `useValue` en NestJS

## 📘 ¿Qué es `useValue`?

En NestJS, `useValue` es una de las formas de **proporcionar un valor personalizado** (como objetos, funciones o mocks) a través del sistema de **inyección de dependencias**.

Se usa dentro de la propiedad `providers` de un módulo para **reemplazar una implementación concreta** con un valor estático o simulado.

---

## 🧠 ¿Para qué sirve?

* Para crear **mocks en pruebas unitarias**
* Para **inyectar objetos simples** sin necesidad de clases o servicios
* Para reemplazar implementaciones reales en entornos de desarrollo o pruebas

---

## 🧱 Sintaxis básica

```ts
{
  provide: Token,
  useValue: valor
}
```

* `provide`: Identificador del servicio o token que se está inyectando
* `useValue`: El valor que será inyectado en lugar del servicio real

---

## ✅ Ejemplo simple

```ts
const mockUsersService = {
  getUsers: () => ['Juan', 'Ana'],
};

@Module({
  providers: [
    {
      provide: UsersService,
      useValue: mockUsersService,
    },
  ],
})
export class AppModule {}
```

### ¿Qué pasa aquí?

* Cuando alguien inyecte `UsersService`, NestJS **no inyectará la clase real**, sino el objeto `mockUsersService`.
* Ideal para pruebas donde no quieres que el servicio acceda a base de datos u otros recursos.

---

## 🧪 Ejemplo en pruebas unitarias

```ts
const mockService = {
  findAll: () => ['dato1', 'dato2'],
};

describe('MiComponente', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MiServicio,
          useValue: mockService,
        },
      ],
    }).compile();

    const servicio = moduleRef.get<MiServicio>(MiServicio);
    expect(servicio.findAll()).toEqual(['dato1', 'dato2']);
  });
});
```

---

## 🆚 Comparación con otras estrategias

| Estrategia    | ¿Qué inyecta?                     | ¿Cuándo usarla?                             |
| ------------- | --------------------------------- | ------------------------------------------- |
| `useClass`    | Una clase                         | Implementaciones completas                  |
| `useExisting` | Una referencia a otra clase       | Reutilizar un servicio existente            |
| `useFactory`  | Resultado de una función factory  | Cuando necesitas lógica para generar valor  |
| `useValue`    | Un valor simple, mock o constante | Ideal para mocks, configuraciones o pruebas |

---

## 🎯 Cuándo usar `useValue`

* Cuando tienes un **mock o stub**
* Cuando quieres usar una **configuración estática**
* Cuando el valor no necesita lógica interna
* Para pruebas con `jest` u otro framework

---

## 📚 Recursos recomendados

* [Proveedores personalizados en la documentación oficial](https://docs.nestjs.com/fundamentals/custom-providers)
* [Testing en NestJS](https://docs.nestjs.com/fundamentals/testing)

---
---
---

¡Perfecto! Aquí tienes una **explicación ampliada** en formato `.md` que incluye el uso de `useValue`, `useClass`, `useFactory` y `useExisting` en NestJS, con ejemplos prácticos y cuándo usar cada uno. Ideal para documentarlo como:
📄 `providers-en-nestjs.md`

---

# 🧩 Proveedores personalizados en NestJS

NestJS permite diferentes formas de proporcionar dependencias usando el sistema de **Inyección de Dependencias (DI)**. Estos métodos se configuran mediante la propiedad `providers` en los módulos.

---

## 📘 ¿Qué es un proveedor?

Un **proveedor** es cualquier cosa que pueda ser **inyectada** en una clase mediante el sistema de DI. Puede ser:

* Una clase (`useClass`)
* Una instancia u objeto (`useValue`)
* El resultado de una función (`useFactory`)
* Un alias hacia otro proveedor (`useExisting`)

---

## 🔸 1. `useClass`: Inyecta una clase

```ts
class MiServicio {}

@Module({
  providers: [
    {
      provide: 'SERVICIO',
      useClass: MiServicio,
    },
  ],
})
```

### ✅ ¿Cuándo usarlo?

* Cuando quieres usar una clase concreta como implementación.
* Ideal para producción o implementaciones reales.

---

## 🔸 2. `useValue`: Inyecta un valor u objeto

```ts
const mockServicio = {
  saludar: () => 'Hola desde el mock!',
};

@Module({
  providers: [
    {
      provide: 'SERVICIO',
      useValue: mockServicio,
    },
  ],
})
```

### ✅ ¿Cuándo usarlo?

* En pruebas unitarias (mocks).
* Para inyectar valores estáticos o constantes.

---

## 🔸 3. `useFactory`: Usa una función para generar el proveedor

```ts
@Module({
  providers: [
    {
      provide: 'SERVICIO',
      useFactory: () => {
        const activo = process.env.NODE_ENV !== 'production';
        return {
          saludar: () => activo ? 'Modo desarrollo' : 'Modo producción',
        };
      },
    },
  ],
})
```

### ✅ ¿Cuándo usarlo?

* Cuando el valor depende de lógica, condiciones o inyecciones dinámicas.
* Puedes inyectar otros servicios en la función `useFactory`.

---

## 🔸 4. `useExisting`: Alias hacia otro proveedor

```ts
@Injectable()
class ServicioReal {}

@Module({
  providers: [
    ServicioReal,
    {
      provide: 'SERVICIO',
      useExisting: ServicioReal,
    },
  ],
})
```

### ✅ ¿Cuándo usarlo?

* Cuando quieres inyectar el mismo objeto bajo distintos nombres.
* Evitas múltiples instancias de la misma clase.

---

## 🧪 Comparación rápida

| Estrategia    | ¿Qué inyecta?                    | ¿Casos comunes?                               |
| ------------- | -------------------------------- | --------------------------------------------- |
| `useClass`    | Una clase concreta               | Implementaciones reales                       |
| `useValue`    | Un valor u objeto fijo           | Mocks, constantes, configuración estática     |
| `useFactory`  | Resultado de una función factory | Configuración dinámica, dependencias externas |
| `useExisting` | Referencia a otro provider       | Aliases, evitar instancias duplicadas         |

---

## 📦 Ejemplo completo combinando todos

```ts
const mockService = {
  sayHello: () => 'Soy un mock',
};

@Injectable()
class RealService {
  sayHello() {
    return 'Hola desde el real';
  }
}

@Module({
  providers: [
    {
      provide: 'MOCK',
      useValue: mockService,
    },
    {
      provide: 'FACTORY',
      useFactory: () => {
        const isDev = process.env.NODE_ENV !== 'production';
        return {
          mode: isDev ? 'dev' : 'prod',
        };
      },
    },
    RealService,
    {
      provide: 'ALIAS',
      useExisting: RealService,
    },
  ],
})
export class AppModule {}
```

---

## 📚 Recursos útiles

* [NestJS – Proveedores personalizados](https://docs.nestjs.com/fundamentals/custom-providers)
* [Inyección de dependencias avanzada](https://docs.nestjs.com/fundamentals/dependency-injection)
* [Pruebas unitarias en NestJS](https://docs.nestjs.com/fundamentals/testing)

---
---
---

````markdown
# Conexión a Base de Datos PostgreSQL en NestJS usando ConfigModule

Este documento explica cómo configurar la conexión a una base de datos PostgreSQL en un proyecto NestJS, utilizando el `@nestjs/config` para manejar variables de entorno y evitar exponer datos sensibles en el código.

---

## 📦 Instalación de dependencias necesarias

Ejecuta el siguiente comando para instalar los paquetes requeridos:

```bash
npm install @nestjs/typeorm @nestjs/config typeorm pg
````

* `@nestjs/config`: Permite trabajar con variables de entorno.
* `@nestjs/typeorm`: Módulo oficial de integración de TypeORM con NestJS.
* `typeorm`: ORM para trabajar con PostgreSQL.
* `pg`: Driver para PostgreSQL.

---

## ⚙️ Configuración del archivo `.env`

Crea un archivo `.env` en la raíz del proyecto y agrega las variables de conexión:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=demo_db
```

---

## 🔑 Configuración del ConfigModule

En el archivo `app.module.ts` importa el `ConfigModule` y el `TypeOrmModule`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hace que las variables de entorno estén disponibles globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,  // Solo para desarrollo
      }),
    }),
  ],
})
export class AppModule {}
```

---

## 🏦 Creación de la base de datos en PostgreSQL

Desde el **SQL Shell (psql)** ejecuta:

```sql
CREATE DATABASE demo_db;
```

> ⚠️ Evita usar guiones medios (`-`) en los nombres de bases de datos.

---

## 📋 Recomendaciones finales

* Usa el archivo `.env` para proteger las credenciales.
* No uses `synchronize: true` en producción.
* Evita guiones en nombres de bases o tablas.

---

## ✅ Resultado

Tu aplicación NestJS ahora podrá conectarse a PostgreSQL usando las variables del archivo `.env` a través de `ConfigModule` y gestionará la conexión usando TypeORM.

---
---
---

````markdown
# Creación del Modelo y Entidades en NestJS con UUID

Este documento explica cómo crear un modelo de entidad usando TypeORM en un proyecto NestJS, incorporando UUID como identificador único de cada registro.

---

## 📁 Paso 1: Instalar la libreria UUID

```bash
npm install uuid
```

## 📁 Paso 2: Crear la entidad

Crea un archivo llamado `user.entity.ts` dentro de tu carpeta de entidades.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  county?: string;

  @Column({ nullable: true })
  city?: string;
}
````

### Explicación:

* `@Entity('users')`: Define que esta clase será una tabla en la base de datos llamada `users`.
* `@PrimaryGeneratedColumn('uuid')`: Genera un identificador único de tipo UUID automáticamente.
* `@Column()`: Define las columnas normales.
* `{ unique: true }`: La columna debe ser única (por ejemplo, el email).
* `{ nullable: true }`: Permite que esa columna sea opcional.

---

## 📦 Paso 3: Registrar la entidad en TypeORM

En el módulo principal o módulo correspondiente (ej. `UsersModule`), importa el `TypeOrmModule` y registra la entidad:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 🛠️ Paso 4: Usar la entidad en un servicio

Dentro del servicio puedes usar el repositorio como inyección de dependencias para gestionar la entidad:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.usersRepository.create(data);
    return await this.usersRepository.save(newUser);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
```

---

## 🔑 Ventajas de usar UUID

* Mejora la seguridad ocultando patrones secuenciales de IDs.
* Facilita replicación entre bases de datos.
* Evita colisiones al crear registros distribuidos.

---

## ✅ Resultado

Cada usuario creado tendrá un ID único generado automáticamente por la base de datos en formato UUID, facilitando la gestión y seguridad de los datos en tu proyecto NestJS con TypeORM.

```
```
