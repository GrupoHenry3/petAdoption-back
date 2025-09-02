
- ***\l*** = Ver un listado de las bases de datos que tengo en mi computadora.
<br>

- ***CREATE DATABASE nombre_de_bdd;*** = Crea una nueva Base de Datos.
<br>

- ***DROP DATABASE nombre_de_bdd;*** = Elimina una base de datos.
<br>

- ***\c nombre_de_bdd;*** = Conecta a la base de datos.
<br>

- ***CREATE TABLE nombre_tabla (Propiedades de la tabla);***
<br>

- ***DROP TABLE nombre_tabla;*** || ***DROP TABLE IF EXISTS "nombre_tabla";*** = Elimina una tabla de la base de datos.
<br>

- ***\dt;*** = Muestra las tablas dentro de mi base de datos.
<br>

````markdown
# 📊 Comandos para Limpiar una Base de Datos PostgreSQL

## 🔥 Opción 1: Eliminar y Recrear la Base de Datos

```bash
psql -U tu_usuario -d postgres -c "DROP DATABASE IF EXISTS nombre_base_datos;"
psql -U tu_usuario -d postgres -c "CREATE DATABASE nombre_base_datos;"
````

* **tu\_usuario**: usuario de PostgreSQL.
* **nombre\_base\_datos**: nombre de la base de datos que quieres limpiar y recrear.

---

## 🔥 Opción 2: Vaciar Todas las Tablas de la Base de Datos (Sin Eliminarla)

```sql
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Desactivar restricciones
    EXECUTE 'SET session_replication_role = replica';

    -- Eliminar todas las tablas
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Restaurar restricciones
    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;
```

### Ejecución desde la terminal:

```bash
psql -U tu_usuario -d nombre_base_datos -c "$(cat script.sql)"
```

---

## 🚀 Opción 3: Usar TypeORM CLI (si aplica)

```bash
npm run typeorm schema:drop
```

> Elimina todas las tablas según la configuración de TypeORM.

---

## ⚡ Recomendación Rápida

```bash
psql -U tu_usuario -d postgres -c "DROP DATABASE IF EXISTS ecommerce;"
psql -U tu_usuario -d postgres -c "CREATE DATABASE ecommerce;"
```

> Elimina y recrea la base de datos **ecommerce** desde cero.

---

```
```


---
---
---
---
---
---
---
---
---
---



   


   

   

   

   

   - ***SELECT * FROM nombre_tabla;*** = Muestra los registros que teiene una tabla de una Base de Datos.

---

## Sentencia para crear una tabla en la base de datos con las 4 siguientes propiedades

Aquí tienes la sentencia SQL para crear la tabla de **películas** en PostgreSQL:

CREATE TABLE movies (
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   year INTEGER NOT NULL,
   duration INTEGER NOT NULL
);

### Explicación:
   - ***id SERIAL PRIMARY KEY,***: Crea un campo autoincremental único.
   - ***title VARCHAR(255) NOT NULL,***: Almacena el nombre de la película con un límite de 255 caracteres y no permite valores nulos.
   - ***year INTEGER NOT NULL,***: Almacena el año de lanzamiento como un número entero y no permite valores nulos.
   - ***duration INTEGER NOT NULL***: Guarda la duración en minutos como un número entero y no permite valores nulos.

---

Aquí tienes la sentencia SQL para crear la tabla de **directores** en PostgreSQL:
CREATE TABLE directors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    since DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL
);

### Explicación:
***id SERIAL PRIMARY KEY,***: Genera un identificador único autoincremental.
***name VARCHAR(255) NOT NULL,***: Almacena el nombre del director con un límite de 255 caracteres, sin valores nulos.
***since DATE NOT NULL,***: Guarda la fecha en la que el director comenzó su carrera.
***nationality VARCHAR(100) NOT NULL***: Almacena la nacionalidad del director, con un límite de 100 caracteres.

---

## Sentencias o query para incertar datos a una tabla

Aquí tienes la query para insertar la **película Titanic** en la tabla **movies**:
***INSERT INTO movies (title, year, duration)***
***VALUES ('Titanic', 1997, 195);***

### Explicación:
   - ***title:*** 'Titanic' (nombre de la película).
   - ***year:*** 1997 (año de lanzamiento).
   - ***duration:*** 195 (duración en minutos).

Dado que el campo id es autoincremental, no es necesario incluirlo en la consulta.

---

#### Resgistra mas de uno en las tabalas de base de datos

INSERT INTO movies (title, year, duration) VALUES
('The Godfather', 1972, 175),
('The Dark Knight', 2008, 152),
('Pulp Fiction', 1994, 154),
('Forrest Gump', 1994, 142),
('Inception', 2010, 148),
('The Matrix', 1999, 136),
('The Lord of the Rings: The Fellowship of the Ring', 2001, 178),
('The Lord of the Rings: The Two Towers', 2002, 179),
('The Lord of the Rings: The Return of the King', 2003, 201),
('Interstellar', 2014, 169);

---

Aquí tienes una query para insertar registros de directores que correspondan a las películas que hemos agregado, sin establecer aún relaciones con la tabla movies:

INSERT INTO directors (name, since, nationality) VALUES
('Francis Ford Coppola', '1963-01-01', 'American'),
('Christopher Nolan', '1998-01-01', 'British-American'),
('Quentin Tarantino', '1987-01-01', 'American'),
('Robert Zemeckis', '1972-01-01', 'American'),
('James Cameron', '1978-01-01', 'Canadian'),
('Lana Wachowski', '1996-01-01', 'American'),
('Peter Jackson', '1976-01-01', 'New Zealander'),
('Peter Jackson', '1976-01-01', 'New Zealander'),
('Peter Jackson', '1976-01-01', 'New Zealander'),
('Christopher Nolan', '1998-01-01', 'British-American');

---

Creamos tabla de generos y insertamos datos

1. Creamos tabla de generos

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

2. Insertamos los generos

INSERT INTO genres (name) VALUES
('Action'),
('Comedy'),
('Drama'),
('Fantasy'),
('Horror'),
('Mystery'),
('Romance'),
('Science Fiction'),
('Thriller'),
('Animation');

### Explicación:
   - ***id SERIAL PRIMARY KEY***: Crea un identificador único autoincremental.
   - ***name VARCHAR(100) NOT NULL UNIQUE***: Almacena el nombre del género, sin permitir valores duplicados ni nulos.
   
Se insertan 10 géneros populares para películas.




---

# Sentencia para obtener todas las peliculas solo de un dato especifico

### En este ejemplo muestra solo las peliculas que fueron lanzadas en el año 1994
SELECT * FROM movies WHERE year = 1994;

### Explicación:
   - ***SELECT \****: Recupera todos los campos de la tabla.
   - ***FROM movies***: Indica la tabla de donde se extraerán los datos.
   - ***WHERE year = 1994***: Filtra únicamente las películas cuyo año de lanzamiento sea 1994.

---

### En este otro ejemplo ordenara las peliculas por su duración
Aquí tienes la query para obtener todas las películas ordenadas por su duración:

SELECT * FROM movies ORDER BY duration;

### Explicación:
   - ***SELECT \****: Recupera todos los campos de la tabla.
   - ***FROM movies***: Indica la tabla de la que se extraen los datos.
   - ***ORDER BY duration***: Ordena los resultados según la duración de menor a mayor.

---

Si deseas ordenarlas de mayor a menor duración, puedes usar:

SELECT * FROM movies ORDER BY duration DESC;

---

### En este ejemplo muestra solo las peliculas que fueron lanzadas en el año 1994 y duración
Aquí tienes la query para obtener todas las películas del año 1994 ordenadas por su duración:

SELECT * FROM movies WHERE year = 1994 ORDER BY duration;

### Explicación:
   - ***SELECT \****: Recupera todos los campos de la tabla.
   - ***FROM movies***: Consulta a la tabla movies.
   - ***WHERE year = 1994***: Filtra solo las películas estrenadas en 1994.
   - ***ORDER BY duration***: Ordena los resultados por duración en orden ascendente.

---

Si prefieres que las películas se ordenen de mayor a menor duración, puedes usar:

SELECT * FROM movies WHERE year = 1994 ORDER BY duration DESC;

---

## Sentencia para modificar un dato estecifico de un registro

### En este ejemplo se modificara el año del id 6 a 1994
Aquí tienes la query para actualizar el año de la película con id 6 a 1994:

UPDATE movies SET year = 1994 WHERE id = 6;

### Explicación:
   - ***UPDATE movies***: Especifica la tabla a actualizar.
   - ***SET year = 1994***: Modifica el valor de la columna year a 1994.
   - ***WHERE id = 6***: Asegura que solo se actualice la película con el id 6.

---

## Sentencia para eliminar un registro especifico

### En este ejemplo se eliminara el id 3
quí tienes la query para eliminar la película con id 3:

DELETE FROM movies WHERE id = 3;

### Explicación:
   - ***DELETE FROM movies***: Indica que se eliminarán registros de la tabla movies.
   - ***WHERE id = 3***: Especifica que solo se eliminará la película con el id 3, evitando borrar toda la tabla accidentalmente.

---

# Reniciar un id serial a 1 o valor deseado

Para reiniciar el valor de la columna id en la tabla movies y hacer que la secuencia comience desde 1 (o desde otro valor específico), puedes usar la siguiente query:

ALTER SEQUENCE movies_id_seq RESTART WITH 1;

### Explicación:
   - ***ALTER SEQUENCE movies_id_seq***: Modifica la secuencia de la columna id de la tabla movies.
   - ***RESTART WITH 1***: Reinicia la secuencia para que el próximo valor asignado sea 1.

### Consideraciones:
   - Si ya tienes registros en la tabla, podrías encontrarte con conflictos de claves duplicadas. Para evitarlo, puedes ajustar el valor de reinicio al número máximo de id existente más uno:

SELECT setval('movies_id_seq', (SELECT MAX(id) FROM movies) + 1);

   - Si deseas eliminar todos los registros y reiniciar el contador, puedes hacer lo siguiente:

TRUNCATE TABLE movies RESTART IDENTITY;
TRUNCATE TABLE users RESTART IDENTITY;
TRUNCATE TABLE vehicles RESTART IDENTITY;

---
---

# Relaciones en MySQL

## Agregar a la tabla el campo id de la otra tabla  con que lo vamos a relacionar que sera una clave foranea de la tabla relacionada

Para lograr relacionar movies con directors hacemos lo siguiente:

1. Primero agregamos el campo director_id

ALTER TABLE movies ADD COLUMN director_id INTEGER;

### Explicación:
   - ***ALTER TABLE movies***: Modifica la tabla movies.
   - ***ADD COLUMN director_id INTEGER***: Agrega una nueva columna para almacenar la referencia al director.

2. Segundo establecer la restriccion de clave foranea

ALTER TABLE movies ADD CONSTRAINT fk_director FOREIGN KEY (director_id) REFERENCES directors(id);

### Explicación:
   - ***ALTER TABLE movies***: Modifica la tabla movies.
   - ***ADD CONSTRAINT fk_director***: Define una restricción de clave foránea con el nombre fk_director.
   - ***FOREIGN KEY (director_id) REFERENCES directors(id)***: Establece la relación con la tabla directors en la columna id.

---

Tambien se puede hacer todo en una sola instruccion de la siguiente forma

ALTER TABLE movies 
ADD COLUMN director_id INTEGER,
ADD CONSTRAINT fk_director
FOREIGN KEY (director_id) 
REFERENCES directors(id)
ON DELETE CASCADE;

### Explicación:
   - ***ALTER TABLE movies***: Modifica la tabla movies.
   - ***ADD COLUMN director_id INTEGER***: Agrega una nueva columna para almacenar la referencia al director.
   - ***ADD CONSTRAINT fk_director***: Define una restricción de clave foránea con el nombre fk_director.
   - ***FOREIGN KEY (director_id) REFERENCES directors(id)***: Establece la relación con la tabla directors en la columna id.
   - ***ON DELETE CASCADE***: Si se elimina un director, también se eliminarán sus películas automáticamente.

Si prefieres evitar la eliminación en cascada, puedes omitir ON DELETE CASCADE o usar ON DELETE SET NULL para dejar el valor en NULL cuando se elimine un director.

---

# Actualizar una tabla y relacionarla con otra

En esta oportunidad vamos a relacionar las movies de 1, 2, 3, 7, 8, 9 con las id de directors 1, 7, 2 6, 6, 6

UPDATE movies SET director_id = 1 WHERE id = 1;
UPDATE movies SET director_id = 7 WHERE id = 2;
UPDATE movies SET director_id = 2 WHERE id = 3;
UPDATE movies SET director_id = 6 WHERE id = 7;
UPDATE movies SET director_id = 6 WHERE id = 8;
UPDATE movies SET director_id = 6 WHERE id = 9;

### Explicación:
   - ***UPDATE movies SET director_id = X WHERE id = Y;***: Actualiza la película con el id = Y asignándole el director correspondiente con director_id = X.

Si quieres asegurarte de que los cambios se realizaron correctamente, puedes verificar con:

SELECT id, title, director_id FROM movies WHERE id IN (1, 2, 3, 7, 8, 9);

---

### Obtener peliculas con el nombre del director

SELECT 
    movies.id, 
    movies.title, 
    movies.year, 
    movies.duration, 
    directors.name AS director_name
FROM movies
JOIN directors ON movies.director_id = directors.id;

### Explicación:
   - ***SELECT movies.id, movies.title, movies.year, movies.duration, directors.name AS director_name***: Selecciona los campos de la tabla movies y el nombre del director de la tabla directors.
   - ***FROM movies***: Se especifica la tabla principal.
   - ***JOIN directors ON movies.director_id = directors.id***: Se realiza la unión entre la tabla de películas y directores a través de la clave foránea director_id.





<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

\dt = Muestra las tablas dentro de mi base de datos

**CREA TABLAS EN LA BASE DE DATOS**

CREATE TABLE peliculas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  year INTEGER,
  duration INTEGER
);

CREATE TABLE directores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  since DATE,
  nationality VARCHAR(100)
);


INSERT INTO peliculas (title, year, duration)
VALUES ('Titanic', 1997, 195);

INSERT INTO directores (name, since, nationality)
VALUES ('James Cameron', '1997-01-01', 'Canada');

SELECT * FROM peliculas; = Me trae todos los datos de la tabla
SELECT title FROM peliculas; Me trae solo los títulos de la tabla
SELECT title, id FROM peliculas; Muestra títulos e id de las peliculas
SELECT * FROM peliculas WERE year =1994 => Me muestra todas las peliculas del año 1994
SELECT * FROM peliculas ORDER BY duration = Me muestra las peliculas ordenadas por duración
SELECT * FROM peliculas WERE year = 1994 ORDEN BY duration => Filtra peliculas por un mismo año y orden de duración
UPDATE peliculas SET year = 1994 WHERE id = 6 => Actualiza o modifica el año del id 6
DELETE FROM peliculas WHERE id = 3 => Elimina de peliculas el registro del id 3



**AGREGAR UNA COLUMNA A UNA TABLA PARA MOSTRAR LOS DIRECTORES**

*Paso 1: Agregar la columna director_id a la tabla peliculas*
ALTER TABLE peliculas
ADD COLUMN director_id INTEGER;

*Paso 2: Establecer la restricción de clave foránea*
ALTER TABLE peliculas
ADD CONSTRAINT fk_director
FOREIGN KEY (director_id)
REFERENCES directores(id);



**Relacionar las tablas Peliculas con sus directores**

*Plicula Pelicula de ID 1 con director 1*
UPDATE peliculas
SET director_id = 1
WHERE id = 1;

*Listado de pelicular con el nombre del director de cada pelicula*
SELECT p.title AS pelicula, d.name AS director
FROM peliculas p
JOIN directores d ON p.director_id = d.id;


**Crear tabla géneros**
*Paso 1: Crear la tabla de géneros de pelicula*
CREATE TABLE generos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);


*Paso 2: Insertar los géneros en la tabla*
INSERT INTO generos (nombre) VALUES
  ('Romance'),
  ('Catástrofe'),
  ('Drama');


**Crear una tabla intermedia que establezca la relación muchos a muchos entre la tabla de película y género.**

CREATE TABLE pelicula_genero (
  pelicula_id INTEGER REFERENCES peliculas(id),
  genero_id INTEGER REFERENCES generos(id),
  PRIMARY KEY (pelicula_id, genero_id)
);


**Relación para la película con ID 1 y los géneros 1, 2 y 3**

INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3);


**Mostrar tabla con peliculas, director y generos**

SELECT p.title AS pelicula, d.name AS director, COALESCE(STRING_AGG(g.nombre, ', '), 'Sin género') AS generos
FROM peliculas p
LEFT JOIN directores d ON p.director_id = d.id
LEFT JOIN pelicula_genero pg ON p.id = pg.pelicula_id
LEFT JOIN generos g ON pg.genero_id = g.id
GROUP BY p.id, p.title, d.name;






**Nuestro chat con IA
En este enlace te compartimos el chat con GPT que hemos utilizado a lo largo de la clase.**

https://chatgpt.com/share/fedf71ca-7c00-4e74-9526-6c76d10864fd
