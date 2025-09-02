Claro, aquí tienes una explicación clara y detallada en formato Markdown (`.md`) para documentar cómo formatear las fechas `iat` y `exp` de un JWT en NestJS:

---

# 📘 Formateo de Fechas en JWT - NestJS

En esta guía aprenderás cómo extraer, decodificar y **formatear las fechas** `iat` (issued at) y `exp` (expiration time) de un **token JWT** en formato legible como:

```
"04/08/2025 19:09:49"
```

---

## 📌 ¿Por qué formatear las fechas?

Por defecto, los tokens JWT contienen las fechas `iat` y `exp` como **timestamps UNIX** (en segundos desde 1970-01-01). Esto puede lucir así:

```json
{
  "iat": 1722725389,
  "exp": 1722728989
}
```

Estas fechas no son legibles directamente por el usuario.

---

## ✅ Solución: Formatear al decodificar el token

### Paso 1: Instalar `moment`

Usaremos la librería `moment` para formatear las fechas fácilmente.

```bash
npm install moment
```

---

### Paso 2: Modificar `signIn()` para devolver fechas legibles

Edita tu método `signIn` en `auth.service.ts`:

```ts
import * as moment from 'moment'; // Importa moment

async signIn(credentials: SignInAuthDto) {
  const foundEmail = await this.userService.getUserByEmail(credentials.email);
  if (!foundEmail) {
    throw new HttpException('Email not Found', HttpStatus.NOT_FOUND);
  }

  const isPasswordMatching = await compare(credentials.password, foundEmail.password);
  if (!isPasswordMatching) {
    throw new HttpException('Wrong credentials provided', HttpStatus.UNAUTHORIZED);
  }

  // Crear token
  const token = await this.createToken(foundEmail);

  // Decodificar token
  const decoded = this.jwtService.decode(token) as any;

  // Función para formatear fechas
  const formatDate = (timestamp: number) =>
    moment(new Date(timestamp * 1000)).format('DD/MM/YYYY HH:mm:ss');

  // Retornar token y fechas formateadas
  return {
    token,
    issuedAt: formatDate(decoded.iat),
    expiresAt: formatDate(decoded.exp),
  };
}
```

---

### Resultado esperado

La respuesta al iniciar sesión será:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "issuedAt": "04/08/2025 19:09:49",
  "expiresAt": "04/08/2025 20:09:49"
}
```

---

## 🕒 ¿Cómo configurar la expiración del token?

Puedes personalizar la duración del token al crearlo en el método `createToken`:

```ts
this.jwtService.signAsync(payload, { expiresIn: '1h' }); // 1 hora
```

Formatos válidos:

* `'30m'` → 30 minutos
* `'2h'` → 2 horas
* `'1d'` → 1 día
* `'7d'` → 1 semana

---

## 💡 ¿Y si quiero que las fechas formateadas estén dentro del token?

Aunque es técnicamente posible agregar las fechas al `payload`, **no es recomendable** porque JWT ya incluye `iat` y `exp` como estándar. Lo ideal es **decodificar el token** y **formatearlas fuera del payload**, como se mostró.

---

## ✅ Conclusión

Este enfoque mantiene la seguridad y estructura estándar del JWT, y al mismo tiempo permite mostrar fechas legibles en la respuesta de autenticación.

---

¿Deseas que te genere este documento como archivo `.md` descargable?