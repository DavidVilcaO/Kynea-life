# Kynea — Funcionalidades y Tareas para Desarrollador

## Estado actual de la plataforma

Kynea es un marketplace de clases de baile en Perú (Lima) que conecta profesores y academias con alumnos. Stack: **Next.js 16 + Supabase + Tailwind CSS v4**, desplegado en Vercel (`https://kynea-life.vercel.app`).

### Lo que ya funciona (no tocar sin motivo)
- Registro / Login / Confirmación de email por código OTP de 6 dígitos
- Recuperación de contraseña (email → pantalla reset-password)
- Onboarding de 5 pasos para profesor/academia/colectivo
- Publicación de clases (formulario completo con media, horarios, precios, ubicación)
- Catálogo público: listado, filtros, detalle de clase, perfil del profesor
- Guardar clases como favorito (alumno)
- Dashboard del alumno: clases guardadas
- Dashboard del profesor/academia: métricas, mis clases, crear/editar/archivar/duplicar clase
- Middleware (`proxy.ts`) que protege `/dashboard` y `/onboarding`
- Tracking de contactos al hacer clic en WhatsApp/Instagram

### Archivos clave para el dev
| Archivo | Qué hace |
|---------|----------|
| `lib/supabase/server.ts` | Cliente Supabase para Server Components |
| `lib/supabase/client.ts` | Cliente Supabase para Client Components |
| `lib/queries/classes.ts` | Todas las lecturas de datos (fetch functions) |
| `lib/actions/classes.ts` | Mutaciones (server actions: crear, editar, borrar clases y perfil) |
| `lib/types.ts` | Todos los tipos TypeScript del proyecto |
| `supabase/schema.sql` | Schema completo de la DB |
| `proxy.ts` | Middleware de autenticación (rutas protegidas) |

---

## 1. SEGURIDAD Y AUTH

### 1.1 Google OAuth — código listo, falta configuración
- **Qué falta:** En Supabase > Authentication > Providers > Google: activar con Client ID y Client Secret de Google Cloud Console.
- **Archivos:** El botón ya existe en `app/registro/page.tsx` y `app/login/page.tsx` (llama `signInWithOAuth`). El callback `/auth/callback/route.ts` ya maneja el código.
- **Tarea:** Configurar las credenciales en Supabase + añadir el dominio de Vercel a los Authorized Redirect URIs en Google Console.

### 1.2 Protección de rutas por rol
- **Problema actual:** `proxy.ts` verifica "¿estás logueado?" pero NO verifica el rol. Un alumno puede navegar manualmente a `/dashboard/crear-clase` — el server component devuelve `null` en silencio, sin redirigir.
- **Tarea:** En cada server component del dashboard exclusivo de profesor/academia, añadir un check de rol y redirigir al alumno a `/dashboard/alumno` si accede a esas rutas.
- **Archivos a modificar:** `app/dashboard/mis-clases/page.tsx`, `app/dashboard/crear-clase/page.tsx`, `app/dashboard/contactos/page.tsx`, `app/dashboard/importar-csv/page.tsx`, `app/dashboard/profesores/page.tsx`.

### 1.3 Rate limiting
- **Problema:** No hay protección contra bots que creen cuentas en masa.
- **Tarea:** Supabase tiene rate limiting incorporado en Auth — verificar que está activo en el dashboard. Para protección adicional considerar Arcjet a nivel de Next.js.

### 1.4 Validación servidor en server actions
- **Problema:** `createClass` y `updateProfile` en `lib/actions/classes.ts` no validan los campos antes de insertarlos en la DB.
- **Tarea:** Añadir validación con Zod en cada server action. Campos mínimos: `price` positivo, `title` entre 5-100 caracteres, `email` con formato válido, `end_date` posterior a `start_date`.

### 1.5 Política de contraseñas
- **Tarea:** En la UI de registro (`app/registro/page.tsx`), añadir indicador de fortaleza de contraseña. En Supabase > Auth > Settings: subir el mínimo a 8 caracteres.

---

## 2. ONBOARDING — LOS 3 ROLES

### 2.1 Onboarding del Alumno (no existe)
- **Estado actual:** Los alumnos se registran y van directo a `/clases`. El perfil de alumno queda vacío (solo `name` y `role`).
- **Tarea:** Crear `app/onboarding-alumno/page.tsx` con 2-3 pasos:
  - Paso 1: ¿Qué estilos de baile te interesan? (multi-select de `DanceStyle`)
  - Paso 2: ¿En qué distrito de Lima estás?
  - Paso 3: ¿Cuál es tu nivel? (principiante / algo de experiencia / avanzado)
- **Cambio en registro:** En `app/registro/page.tsx`, redirigir al alumno a `/onboarding-alumno` en lugar de `/clases` tras registrarse.

### 2.2 Onboarding del Profesor — mejoras pendientes
- **Archivo:** `app/onboarding/page.tsx`
- **Problemas:**
  - Se puede avanzar entre pasos sin completar campos obligatorios.
  - La subida de foto no está implementada en el wizard (solo se puede subir desde `/dashboard/perfil`).
- **Tarea:** Añadir validación antes de cada `setStep(step + 1)`. Implementar el file upload de foto en el paso 2 (reutilizar el mismo componente de upload que usa el formulario de creación de clases).

### 2.3 Onboarding de la Academia — diferenciación
- **Estado actual:** Usa el mismo wizard de 5 pasos que el profesor, sin diferencias.
- **Diferencias que debería tener:**
  - Paso 2 (datos): añadir campo "Nombre comercial / Nombre del estudio".
  - Paso 4 (especialidad): campo opcional "¿Cuántos profesores trabajan contigo?".
  - Al finalizar: mostrar CTA para ir a `/dashboard/profesores` a agregar su equipo.
- **Archivos a modificar:** `app/onboarding/page.tsx` — bifurcar los pasos por `role` cuando `role === 'academia'`.

---

## 3. PERFIL — LOS 3 ROLES

### 3.1 Perfil del Alumno — pantalla incorrecta
- **Problema actual:** El alumno ve `/dashboard/perfil` con los mismos campos que el profesor (estilos que enseña, años de experiencia docente, redes sociales) — irrelevante para un alumno.
- **Tarea:** Crear `app/dashboard/perfil/PerfilAlumnoClient.tsx` con campos apropiados: nombre, foto, ciudad/distrito, estilos favoritos (como preferencias), nivel actual, bio corta.
- **En** `app/dashboard/perfil/page.tsx`: detectar role del usuario y renderizar `PerfilAlumnoClient` o el `PerfilClient` existente.

### 3.2 Perfil del Profesor — mejoras
- **Funciona bien.** Mejoras pendientes:
  - Cambiar el input de URL de foto por un file upload real a Supabase Storage (igual que en el formulario de clases).
  - `profiles.rating` siempre es null — esperar a que exista el sistema de reseñas (sección 7).
  - `profiles.total_classes` nunca se actualiza — añadir trigger SQL (ver sección 11).

### 3.3 Perfil de la Academia — campos adicionales
- **Campos que debería tener y no tiene:**
  - Nombre comercial del estudio (distinto del nombre del dueño)
  - Horario de atención
  - Dirección principal del estudio
  - Galería de fotos del espacio
- **Tarea:** Añadir columnas en la tabla `profiles` y actualizar `updateProfile()` en `lib/actions/classes.ts`.

---

## 4. CREACIÓN Y GESTIÓN DE CLASES

### 4.1 Validaciones faltantes en el formulario
- **Archivo:** `app/dashboard/crear-clase/CrearClaseForm.tsx`
- **Problemas:**
  - Se puede publicar una clase sin precio, sin descripción, sin horario.
  - No valida que `end_date` sea posterior a `start_date`.
- **Tarea:** Añadir validación Zod en el server action `createClass` (`lib/actions/classes.ts`) + mensajes de error inline en el form.

### 4.2 Google Maps para dirección de clase
- **Estado actual:** Hay un `// TODO: Google Places Autocomplete` en `CrearClaseForm.tsx` línea 623. Las columnas `lat` y `lng` ya existen en la tabla `classes` pero nunca se llenan.
- **Tarea:** Añadir `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` a Vercel, instalar `@googlemaps/js-api-loader`, agregar autocomplete en el campo de dirección. Guardar `lat`/`lng` en la DB.

### 4.3 Estado "finalizado" de clases pasadas
- **Problema:** Clases con `end_date` en el pasado siguen apareciendo como publicadas.
- **Tarea:** En `fetchPublishedClasses` en `lib/queries/classes.ts`, añadir filtro `or('end_date.is.null,end_date.gte.' + today)`. O crear un trigger SQL que cambie status a 'finished' cuando pase la fecha.

### 4.4 Importación CSV — implementar el parseo real
- **Archivo:** `app/dashboard/importar-csv/page.tsx`
- **Estado actual:** La UI existe pero no procesa el archivo.
- **Tarea:** Instalar PapaParse, parsear el CSV al subirlo, mapear columnas a campos de `DanceClass`, mostrar preview real, insertar en lote vía `createClass`.
- **Primero definir:** Las columnas requeridas del CSV y documentarlas en la UI.

---

## 5. DESCUBRIMIENTO Y BÚSQUEDA

### 5.1 Mapa de clases — datos reales
- **Archivo:** `app/mapa/page.tsx`
- **Problema:** Usa `mockClasses` (líneas 6 y 14) — no muestra clases reales.
- **Tarea:** Convertir a server component que llame `fetchPublishedClasses()`. Reemplazar el SVG estático de Lima por **Leaflet** (open source, sin API key) o Google Maps. Usar `lat`/`lng` de la DB para posicionar los pines.

### 5.2 Más filtros en la búsqueda
- **Archivos:** `lib/queries/classes.ts` y `app/buscar/page.tsx`
- **Filtros faltantes:**
  - Rango de precio (min/max)
  - Solo clases con prueba gratis (`is_trial_free = true`)
  - Ordenar por: más recientes / más baratas / más populares

### 5.3 Paginación del catálogo
- **Problema:** `fetchPublishedClasses` devuelve todas las clases sin límite — con 100+ clases la página se vuelve lenta.
- **Tarea:** Añadir `limit`/`offset` usando `.range()` de Supabase. Implementar botón "Cargar más" o paginación en `app/clases/page.tsx`.

### 5.4 SEO — metadata dinámica
- **Tarea:** Añadir `generateMetadata` en `app/clases/[id]/page.tsx` y `app/profesores/[id]/page.tsx` para que Google indexe título, descripción e imagen de cada clase y profesor.

---

## 6. SISTEMA DE INSCRIPCIONES

### 6.1 Inscripciones formales — el feature más importante
- **Estado actual:** El "contacto" es informal — clic en WhatsApp/Instagram → conversación directa. No hay registro en la app de quién se inscribió en qué.
- **Propuesta MVP:**
  1. Nueva tabla `enrollments` (ver SQL abajo)
  2. Botón "Me interesa / Quiero inscribirme" en la página de clase → inserta en enrollments
  3. Dashboard del profesor: lista de alumnos interesados por clase
  4. Dashboard del alumno: sección "Mis inscripciones" además de "Mis guardados"

```sql
create table public.enrollments (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status     text not null default 'interested'
             check (status in ('interested', 'enrolled', 'cancelled')),
  note       text,
  created_at timestamptz default now(),
  unique(class_id, student_id)
);
alter table public.enrollments enable row level security;
-- Alumno puede ver/crear/cancelar sus propias inscripciones
create policy "enrollments_student" on public.enrollments
  using (student_id = auth.uid()) with check (student_id = auth.uid());
-- Profesor puede ver los interesados en sus clases
create policy "enrollments_teacher_read" on public.enrollments for select
  using (class_id in (select id from public.classes where teacher_id = auth.uid()));
```

### 6.2 Notificación al profesor cuando un alumno se inscribe
- **Opción simple:** Supabase Database Webhook en la tabla `enrollments` → Next.js API route → envía email con Resend o Postmark.
- **Variable de entorno necesaria:** `RESEND_API_KEY`

### 6.3 Cupos disponibles — actualización automática
- **Problema:** `classes.available_spots` existe pero nunca se decrementa.
- **Tarea:** Al insertar en `enrollments`, decrementar `available_spots` con una función SQL atómica. Si llega a 0, mostrar "Clase completa" en el detalle.

---

## 7. SISTEMA DE RESEÑAS Y RATINGS

### 7.1 Reseñas de alumnos
- **Problema:** `profiles.rating` existe pero siempre es null.
- **Propuesta:**
  1. Nueva tabla `reviews` (ver SQL abajo)
  2. Solo alumnos con `enrollments.status = 'enrolled'` pueden dejar reseña
  3. Trigger SQL que recalcule `profiles.rating` automáticamente
  4. Mostrar estrellas en el perfil del profesor y en las cards de clase

```sql
create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz default now(),
  unique(class_id, student_id)
);
alter table public.reviews enable row level security;
create policy "reviews_read" on public.reviews for select using (true);
create policy "reviews_insert" on public.reviews for insert to authenticated
  with check (student_id = auth.uid());

-- Trigger: recalcula rating del profesor en cada reseña
create or replace function update_teacher_rating() returns trigger as $$
begin
  update public.profiles
  set rating = (
    select avg(rating)::numeric(3,2)
    from public.reviews where teacher_id = new.teacher_id
  )
  where id = new.teacher_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_review_created
  after insert or update on public.reviews
  for each row execute function update_teacher_rating();
```

---

## 8. GESTIÓN DE PROFESORES (Academia)

### 8.1 Roster de profesores de academia — implementar en DB
- **Archivo:** `app/dashboard/profesores/page.tsx`
- **Estado actual:** UI completamente mock — la lista de profesores es hardcodeada y no persiste.
- **Propuesta:**
  1. Nueva tabla `academy_teachers` (ver SQL abajo)
  2. Flow: academia ingresa email del profesor → email de invitación (Resend) → profesor acepta → aparece en el roster
  3. Las clases de la academia pueden asignarse a un profesor del roster

```sql
create table public.academy_teachers (
  academy_id  uuid not null references public.profiles(id) on delete cascade,
  teacher_id  uuid references public.profiles(id) on delete set null,
  email       text not null,
  status      text not null default 'invited'
              check (status in ('invited', 'active', 'inactive')),
  invited_at  timestamptz default now(),
  joined_at   timestamptz,
  primary key (academy_id, email)
);
alter table public.academy_teachers enable row level security;
create policy "academy_teachers_own" on public.academy_teachers
  using (academy_id = auth.uid()) with check (academy_id = auth.uid());
```

---

## 9. CONFIGURACIÓN DE CUENTA

### 9.1 Cambio de contraseña
- **Archivo:** `app/dashboard/configuracion/page.tsx`
- **Estado actual:** Todos los toggles son mock — no persisten ningún cambio.
- **Tarea mínima:** Implementar cambio de contraseña: campos "nueva contraseña" + "confirmar" → `supabase.auth.updateUser({ password })`.

### 9.2 Eliminar cuenta
- **No existe.** Tarea: Botón con modal de confirmación → server action que llame `supabase.auth.admin.deleteUser(userId)`. El CASCADE en la DB ya borra el profile y todas las clases.

### 9.3 Preferencias de visibilidad
- **Estado actual:** Los toggles "mostrar en búsqueda" etc. no tienen efecto.
- **Tarea:** Añadir columna `is_visible boolean default true` a `profiles`. Filtrar en `fetchFeaturedProfiles` y `fetchPublishedClasses`.

---

## 10. DASHBOARD — MEJORAS

### 10.1 Métricas avanzadas del profesor
- Gráfico de vistas en el tiempo (últimos 30 días) — necesita tabla `class_view_events(class_id, viewed_at)`.
- "Mejor clase del mes" (la con más contactos).

### 10.2 Dashboard del alumno — más utilidad
- "Mis inscripciones" (cuando exista la tabla `enrollments`).
- "Clases recomendadas" basadas en sus estilos favoritos (query simple contra `fetchPublishedClasses`).

### 10.3 Vista calendario
- Vista semanal de los horarios del profesor (de `time_slots` de sus clases publicadas). Útil para detectar conflictos.

---

## 11. DEUDA TÉCNICA

### 11.1 Mapa usa datos mock
Ver sección 5.1.

### 11.2 `profiles.total_classes` nunca se actualiza
```sql
create or replace function update_teacher_total_classes() returns trigger as $$
begin
  update public.profiles
  set total_classes = (
    select count(*) from public.classes
    where teacher_id = new.teacher_id and status = 'published'
  )
  where id = new.teacher_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_class_status_change
  after insert or update of status on public.classes
  for each row execute function update_teacher_total_classes();
```

### 11.3 `classes.views` nunca se incrementa
- **Fix:** En `app/clases/[id]/page.tsx` (server component), llamar una función `increment_class_views(class_id)` similar a la que ya existe para contactos. No hacerlo en el cliente para no inflar vistas del mismo usuario.

```sql
create or replace function increment_class_views(class_id uuid)
returns void language sql security definer as $$
  update public.classes set views = views + 1
  where id = class_id and status = 'published';
$$;
```

### 11.4 `app/dashboard/configuracion/page.tsx` — todo mock
- Al menos implementar cambio de contraseña. El resto puede quedar como placeholder con badge "Próximamente".

### 11.5 `lib/mockData.ts` en producción
- Verificar que ninguna ruta de producción lo importe. Solo para tests/desarrollo. Los únicos archivos que aún lo usan son `app/mapa/page.tsx` (ruta pública) y `app/dashboard/profesores/page.tsx` (roster de academia).

---

## 12. INFRAESTRUCTURA

### Variables de entorno requeridas en Vercel
| Variable | Cuándo |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya activa |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya activa |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Al implementar Maps |
| `RESEND_API_KEY` | Al implementar emails de notificación |

### Tests (no existen actualmente)
- Mínimo: tests de server actions con **Vitest**.
- Tests E2E del flujo registro + crear clase con **Playwright**.

### Monitoring
- Instalar **Sentry** para capturar errores en producción. Actualmente solo hay `console.error` en los catch de los server actions.

---

## Priorización sugerida

| # | Tarea | Esfuerzo | Impacto |
|---|-------|----------|---------|
| 🔴 1 | **6.1 Sistema de inscripciones** (tabla + UI) | Grande | Core del negocio |
| 🔴 2 | **4.1 Validaciones del formulario de clase** | Pequeño | Evita datos corruptos |
| 🔴 3 | **1.2 Protección de rutas por rol** | Pequeño | Seguridad |
| 🟡 4 | **5.1 Mapa con datos reales** (Leaflet) | Medio | UX descubrimiento |
| 🟡 5 | **7.1 Sistema de reseñas** (tabla + UI básica) | Grande | Confianza/conversión |
| 🟡 6 | **2.1 Onboarding del alumno** | Medio | Personalización |
| 🟡 7 | **8.1 Roster de profesores de academia** | Grande | Funcionalidad academia |
| 🟡 8 | **5.3 Paginación del catálogo** | Pequeño | Escalabilidad |
| 🟢 9 | **4.2 Google Maps en formulario** | Medio | UX creación |
| 🟢 10 | **6.2 Notificaciones por email** | Medio | Retención |
| 🟢 11 | **5.4 SEO metadata dinámico** | Pequeño | Tráfico orgánico |
| 🟢 12 | **9.1 Cambio de contraseña** | Pequeño | Completitud |
| 🟢 13 | **11.3 Tracking de vistas** | Pequeño | Métricas |
| 🟢 14 | **4.4 Importación CSV real** | Grande | Eficiencia academia |

---

## Guía de inicio rápido para el desarrollador

1. **Clonar el repo** y crear `.env.local` con las variables de Supabase (pedir al dueño del proyecto).
2. **Leer `supabase/schema.sql`** — modelo de datos completo (tablas, RLS, triggers, storage).
3. **Leer `lib/types.ts`** — todos los tipos TypeScript del proyecto.
4. **Ejecutar** `npm install && npm run dev` — debe correr sin errores en `localhost:3000`.
5. **Primera tarea recomendada:** Implementar la tabla `enrollments` y el botón "Inscribirme" en la página de clase — es el feature de mayor impacto y la base sobre la que se construirán reseñas, notificaciones y métricas.
