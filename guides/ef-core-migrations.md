# EF Core Migrations

Guía completa para gestionar migraciones en Entity Framework Core

---

## 1. Cómo Funcionan las Migraciones

Entity Framework compara tu **modelo de datos actual** con la última snapshot y genera el SQL necesario para actualizar el esquema de la base de datos.

> ### Métodos principales
>
> - **Up()** – Aplica los cambios al esquema
> - **Down()** – Revierte los cambios hechos en Up()

## 2. Crear una Migración

Usa la CLI de EF Core para generar y aplicar migraciones:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

> **Nota:** Asegúrate de estar en el directorio correcto del proyecto antes de ejecutar estos comandos.

## 3. Revertir una Migración

Para revertir tu base de datos a una migración anterior:

```bash
dotnet ef database update <PreviousMigrationName>
```

Para eliminar la última migración (no aplicada):

```bash
dotnet ef migrations remove
```

## 4. Tabla de Historial de Migraciones

EF Core crea automáticamente una tabla llamada `__EFMigrationsHistory` que almacena información sobre las migraciones previamente aplicadas.

### Estructura de la tabla

| MigrationId | ProductVersion |
| --- | --- |
| `20240115_InitialCreate` | `8.0.0` |
| `20240120_AddUserTable` | `8.0.0` |

## 5. Mejores Prácticas

### Hacer

- Usa nombres descriptivos (ej: `AddUserTable`)
- Crea migraciones frecuentemente durante el desarrollo
- Revisa el código generado antes de aplicar

### Evitar

- No ejecutar migraciones sin backup en producción
- No editar migraciones ya aplicadas
- No mezclar cambios de esquema con datos

> ### Tip Pro
>
> Mantén tu DbContext y clases de modelo limpias y consistentes. Esto facilitará la generación automática de migraciones correctas.

## Recursos Adicionales

- [Documentación Oficial de Microsoft](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [EF Core CLI Reference](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)
