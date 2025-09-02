````markdown
# 📚 Introducción a las Relaciones de Entidades en Bases de Datos (NestJS + TypeORM)

En una base de datos, las **relaciones** permiten conectar diferentes tablas entre sí. Esto es esencial cuando los datos están relacionados de forma lógica. En proyectos **NestJS** usando **TypeORM**, las relaciones se definen dentro de las **entidades**, que son las clases que representan las tablas de la base de datos.

---

## 🏛️ ¿Qué es una Entidad?

Una **entidad** es una clase que representa una tabla en la base de datos. Por ejemplo, una entidad `User` representa la tabla de usuarios.

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
````

---

## 📊 ¿Qué es una Relación?

Es la forma de conectar registros entre diferentes tablas. Por ejemplo:

* Un usuario puede tener varios pedidos.
* Un producto puede pertenecer a varias categorías.

---

## 🔗 Tipos de Relaciones en TypeORM

### 1️⃣ Relación Uno a Uno (1:1)

Cada registro de una tabla se relaciona con un único registro de otra tabla.

**Ejemplo:** Un `User` tiene un solo `Profile`.

```typescript
@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bio: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()  // Define qué lado posee la relación (dueño)
  profile: Profile;
}
```

---

### 2️⃣ Relación Uno a Muchos / Muchos a Uno (1\:N / N:1)

* **Uno a Muchos:** Un registro se relaciona con varios registros de otra tabla.
* **Muchos a Uno:** Varios registros apuntan a uno solo.

**Ejemplo:** Un `User` tiene varios `Post`.

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
```

---

### 3️⃣ Relación Muchos a Muchos (N\:N)

Varios registros de una tabla pueden estar relacionados con varios registros de otra.

**Ejemplo:** Un `Student` puede estar en varios `Course` y un `Course` puede tener varios `Student`.

```typescript
@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Course, (course) => course.students)
  @JoinTable()  // Esta tabla es la dueña de la relación
  courses: Course[];
}

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];
}
```

---

## ⚙️ Decoradores Principales

| Decorador                 | Descripción                                   |
| ------------------------- | --------------------------------------------- |
| @Entity()                 | Marca la clase como tabla de base de datos    |
| @PrimaryGeneratedColumn() | Crea una columna con ID autogenerado          |
| @Column()                 | Define una columna simple                     |
| @OneToOne()               | Define una relación uno a uno                 |
| @OneToMany()              | Define una relación uno a muchos              |
| @ManyToOne()              | Define una relación muchos a uno              |
| @ManyToMany()             | Define una relación muchos a muchos           |
| @JoinColumn()             | Marca el lado dueño de una relación uno a uno |
| @JoinTable()              | Define la tabla intermedia en relación N\:N   |

---

## 📌 Conclusión

Las relaciones permiten organizar los datos correctamente en diferentes tablas. En proyectos NestJS con TypeORM, estas relaciones se definen fácilmente usando decoradores en las clases.

Esto facilita:

* Realizar búsquedas relacionadas.
* Mantener los datos organizados.
* Respetar las reglas del negocio.

---

```
```

---
---
---

Aquí tienes la explicación en **formato `.md`** lista para documentar:

````markdown
## Explicación del fragmento

```typescript
type: 'varchar',
length: 50,
nullable: false,
unique: true
````

### Descripción

Este fragmento define las características de una **columna de base de datos**, comúnmente en el contexto de un ORM como **TypeORM** en Node.js. A continuación, se detalla cada propiedad:

| Propiedad         | Descripción                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| `type: 'varchar'` | Define que la columna será de tipo **VARCHAR**, es decir, texto de longitud variable. |
| `length: 50`      | Establece que el texto puede tener un máximo de **50 caracteres**.                    |
| `nullable: false` | Indica que **no se permiten valores nulos**. El campo es obligatorio.                 |
| `unique: true`    | Indica que **los valores de esta columna no pueden repetirse**. Garantiza unicidad.   |

### Ejemplo completo en TypeORM

```typescript
@Column({
  type: 'varchar',
  length: 50,
  nullable: false,
  unique: true,
})
username: string;
```

En este ejemplo:

* Se crea una columna llamada `username`.
* Solo admite texto de hasta 50 caracteres.
* No puede quedar vacía.
* Cada valor registrado debe ser único en esa columna (no se permiten duplicados).

### Aplicación práctica

Este tipo de configuración es ideal para campos como:

* Correos electrónicos (`email`)
* Nombres de usuario (`username`)
* Códigos únicos (`codigo_cliente`)

Ya que son campos que deben ser **obligatorios y no repetirse** dentro de la tabla.

```

Si deseas, puedo incluir una representación visual o diagrama de la tabla. ¿Te gustaría agregar algo más?
```

