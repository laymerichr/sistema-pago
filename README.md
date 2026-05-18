# Sistema de Pagos - Prueba Tecnica Backend

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| API REST | NestJS 11 + TypeScript |
| Base de Datos | PostgreSQL 16 |
| ORM | TypeORM 0.3 |
| Procesador de Pagos | Python 3.12 + FastAPI |
| HTTP Client | Axios (via @nestjs/axios) |
| Validacion | class-validator + class-transformer |
| Contenerizacion | Docker + Docker Compose |

## Arquitectura

```
Cliente (Postman/Navegador)
         |
         v
  NestJS API (3000) <-> PostgreSQL (5432)
         |
         v
  Python Service (8000)
```

## Requisitos Previos

### Para Windows Local (sin Docker)
- Node.js 24+
- Python 3.12+ (con pip)
- PostgreSQL 16+ (instalado y corriendo como servicio de Windows)
- Git Bash, PowerShell o CMD

### Para Docker
- Docker Desktop (Windows/Mac/Linux)
- Docker Compose v2+

---


## Opcion 1: Windows Local (sin Docker)

Sigue estos pasos en orden. Necesitas 3 terminales abiertas simultaneamente.

### Paso 1: PostgreSQL

1. Instala PostgreSQL desde https://www.postgresql.org/download/windows/
2. Durante la instalacion anota tu password del usuario `postgres`
3. Abre **pgAdmin** o **psql** y crea la base de datos:

```sql
CREATE DATABASE payments_db;
```

4. Ejecuta los scripts SQL (desde PowerShell o Git Bash):

```powershell
cd D:\PROYECTOS\sistema_pagos\database

# Desde psql (si esta en PATH)
psql -U postgres -d payments_db -f schema.sql
psql -U postgres -d payments_db -f seed.sql

# O desde pgAdmin: abre los archivos .sql y ejecuta con F5
```

5. Verifica que PostgreSQL este corriendo en el puerto 5432.

---

### Paso 2: Python Service

Abre una **nueva terminal** (PowerShell o CMD). No uses la misma que PostgreSQL.

```powershell
cd D:\PROYECTOS\sistema_pagos\python-service

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
venv\Scripts\activate

# Instalar dependencias
pip install fastapi uvicorn pydantic

# Levantar servicio
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Deja esta terminal abierta.**

Para verificar que funciona, abre el navegador en:
```
http://localhost:8000/health
```
Debe retornar `{"status": "ok"}`.

---

### Paso 3: Backend NestJS

Abre **otra terminal nueva** (puede ser la terminal integrada de VS Code).

```powershell
cd D:\PROYECTOS\sistema_pagos\backend-nest

# Crear archivo de variables de entorno
copy .env.example .env
```

Edita el archivo `.env` con tu editor (VS Code, Notepad, etc.) y configura la conexion a PostgreSQL con tu password real:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/payments_db?schema=public
PYTHON_SERVICE_URL=http://localhost:8000
```

> **Importante:** Reemplaza `TU_PASSWORD_AQUI` por la password que configuraste al instalar PostgreSQL.

```powershell
# Instalar dependencias (solo la primera vez)
npm install

# Levantar backend en modo desarrollo
npm run start:dev
```

Debe mostrar:
```
API corriendo en http://localhost:3000/api
```

**Deja esta terminal abierta.**

---

### Paso 4: Verificar que todo funciona

Abre el navegador o Postman y prueba:

```
GET http://localhost:3000/api/users
```

Debe retornar los 4 usuarios del seed:
```json
[
  { "id": 1, "firstName": "Juan", "lastName": "Perez", ... },
  ...
]
```

---

## Opcion 2: Docker Compose (Recomendado)

Levanta toda la infraestructura en un solo comando.

```bash
cd payment-system
docker-compose up --build
```

Servicios disponibles:
- API NestJS: http://localhost:3000/api
- Python Service: http://localhost:8000
- PostgreSQL: localhost:5432 (user: postgres, pass: postgres, db: payments_db)

La base de datos se inicializa automaticamente con el schema y seed al levantar el contenedor de Postgres.

Para detener:
```bash
docker-compose down
```
---

## Endpoints API

### Usuarios
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/users | Crear usuario |
| GET | /api/users | Listar usuarios |
| GET | /api/users/:id | Obtener usuario |

### Tarjetas
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/cards | Registrar tarjeta |
| GET | /api/cards/user/:userId | Listar tarjetas del usuario |

### Pagos
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/payments | Crear pago (llama al Python Service) |
| GET | /api/payments/user/:userId | Historial de pagos |
| GET | /api/payments/:id | Detalle de pago |

### Health Checks
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /api/health | Estado del backend |
| GET | /health | Estado del Python Service|

---

## Flujo de Prueba con Postman

Importa la coleccion: `Postman_Collection.json`

Variables preconfiguradas:
- `base_url`: http://localhost:3000/api
- `python_service_url`: http://localhost:8000

Flujo recomendado:
1. Crear usuario (POST /users)
2. Registrar tarjeta (POST /cards)
3. Crear pago (POST /payments) -> 80% aprobado, 20% rechazado
4. Ver historial (GET /payments/user/:id)

---

## Decisiones Tecnicas

1. **NestJS 11**: Framework enterprise de Node.js con inyeccion de dependencias nativa, modulos y validacion automatica via pipes.
2. **TypeORM**: Repository pattern para separar logica de negocio del acceso a datos. Soporta migraciones para produccion.
3. **Soft-delete en tarjetas**: Preserva integridad referencial con pagos historicos. Se usa `is_active = false` en lugar de DELETE fisico.
4. **Comunicacion HTTP sincrona**: El flujo de pago requiere respuesta inmediata (aprobado/rechazado). Timeout de 5s protege contra bloqueos.
5. **Datos ficticios**: Numeros de test estandar (4111111111111111 de Stripe, etc.). En produccion se tokenizan via pasarelas PCI DSS.
6. **Filtro global de excepciones**: Estandariza TODAS las respuestas de error en formato JSON consistente.

---

## Estructura del Proyecto

```
payment-system/
├── backend-nest/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.ts
│   │   ├── database/
│   │   │   └── seeder.ts
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   └── create-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── cards/
│   │   │   ├── dto/
│   │   │   │   └── create-card.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── card.entity.ts
│   │   │   ├── cards.controller.ts
│   │   │   ├── cards.service.ts
│   │   │   └── cards.module.ts
│   │   ├── payments/
│   │   │   ├── dto/
│   │   │   │   └── create-payment.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── payment.entity.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.module.ts
│   │   ├── common/
│   │   │   ├── payment-processor.client.ts
│   │   │   └── http-exception.filter.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── Dockerfile
├── python-service/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── database/
│   ├── 01_schema.sql
│   └── 02_seed.sql
├── docker-compose.yml
├── Payment_System_API_Postman_Collection.json
└── README.md
```
