# Crea un plan detallado

¡Buenísimo proyecto! 💪 Un sistema de agendamiento de citas bien diseñado te ahorra dolores de cabeza después.
Te dejo un plan documentado, claro y accionable, con foco especial en usuarios, roles (Admin / Staff) y cómo se crean y administran.

Voy de alto nivel → detalle técnico, para que puedas usarlo tanto para desarrollo como para documentación.

# PLAN DETALLADO – SISTEMA DE AGENDAMIENTO DE CITAS

1️⃣ Objetivo del sistema
Permitir a clientes agendar citas para servicios específicos, asignados a usuarios Staff, en horarios disponibles,
con una administración centralizada por Admin.

2️⃣ Actores del sistema
👤 Cliente
Agenda citas

    Selecciona servicio, fecha y hora

    Puede ver / cancelar sus citas (opcional)

👨‍💼 Staff
Atiende clientes

    Tiene servicios asignados

    Tiene horarios disponibles

    Ve y gestiona sus citas

👑 Admin
Control total del sistema

    Crea y administra usuarios (Admin y Staff)

    Define servicios

    Define horarios

    Ve reportes y métricas

3️⃣ Roles y permisos (RBAC – Role Based Access Control)
Acción | Admin | Staff
Crear usuarios | ✅ | ❌
Editar usuarios | ✅ | ❌
Asignar roles | ✅ | ❌
Crear servicios | ✅ | ❌
Asignar servicios a staff | ✅ | ❌
Definir horarios | ✅ | ❌
Ver todas las citas| ✅ | ❌
Ver sus propias citas | ✅ | ✅
Atender citas | ❌ | ✅
👉 Regla clave:

El Staff nunca administra usuarios ni estructura del sistema.

4️⃣ Modelo de usuarios  
📋 Entidad: User
Campos sugeridos

id
nombre
email
password_hash
rol (ADMIN | STAFF)
estado (ACTIVO | INACTIVO)
created_at
updated_at
📌 Notas

Usa roles como enum o tabla separada

Contraseñas siempre hasheadas (bcrypt / argon2)

5️⃣ Creación y gestión de usuarios

🧑‍💼 Creación de Admin
Se crea: - Manualmente (seed inicial) O desde un panel protegido

    - Solo Admins pueden crear otros Admins

Flujo - Admin crea usuario

    - Asigna rol = ADMIN

    - Usuario recibe credenciales

👨‍🔧 Creación de Staff
Flujo recomendado

- Admin crea usuario Staff

- Define:
  - Servicios que puede atender

  - Horario disponible

- Staff recibe acceso al sistema

📌 El Staff NO se registra solo

6️⃣ Servicios
📋 Entidad: Service
id
nombre
duracion_minutos
precio
estado
Relación
Un servicio puede ser atendido por varios Staff

- Un Staff puede atender varios servicios

📌 Relación muchos a muchos

staff_services

- staff_id
- service_id

7️⃣ Horarios del Staff
📋 Entidad: StaffSchedule
id
staff_id
dia_semana (Lunes-Domingo)
hora_inicio
hora_fin

📌 El Admin:

- Define horarios

- Puede modificarlos

📌 El sistema:
Genera slots disponibles automáticamente según duración del servicio

8️⃣ Citas
📋 Entidad: Appointment
id
cliente_nombre
cliente_email
staff_id
service_id
fecha
hora_inicio
hora_fin
estado (CONFIRMADA | CANCELADA | ATENDIDA)

9️⃣ Flujo de agendamiento (Cliente) - Cliente selecciona servicio

    - Sistema muestra Staff disponibles

    - Cliente elige fecha y hora

    - Sistema valida:

    - Horario disponible

    - Que no exista otra cita

    - Se crea la cita

    - Se notifica al Staff

🔐 Seguridad y control de acceso
Middleware por rol

- Tokens JWT o sesiones

- Rutas protegidas:

  /admin/\*

  /staff/\*

📌 Ejemplo:

/admin/users
/admin/services
/staff/appointments

0️⃣ Paneles del sistema

🎛 Panel Admin - Usuarios

    - Servicios

    - Horarios

    - Staff

Reportes

🛠 Panel Staff - Agenda personal

    - Detalle de citas

    - Estado de atención

1️⃣ Reglas de negocio importantes
✔ Un Staff no puede tener dos citas al mismo tiempo
✔ Un servicio respeta su duración
✔ Un Staff solo aparece si:

- Está activo

- Tiene el servicio asignado

- Tiene horario disponible

2️⃣ Escalabilidad futura
Opcional para más adelante:

- Clientes registrados

- Pagos online

- Notificaciones (email / WhatsApp)

- Roles adicionales (Supervisor)

- Multi-sucursal

3️⃣ Tecnologías sugeridas (opcional)
Backend: Node.js / Laravel / Spring

DB: PostgreSQL

Auth: JWT

Frontend: React / Vue

ORM: Prisma / Eloquent / Hibernate

🧠 Conclusión clave
👉 El Admin es el único que construye el ecosistema
👉 El Staff solo ejecuta (atiende)
👉 Los clientes solo reservan
