<template>
    <div>
        <!-- Title -->
        <div class="mb-4">
            <h1 class="display-6 fw-bold mb-2">EF Core Migrations</h1>
            <p class="lead text-muted">Guía completa para gestionar migraciones en Entity Framework Core</p>
        </div>

        <hr class="mb-5">

        <!-- Section 1 -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">1</span>
                Cómo Funcionan las Migraciones
            </h2>
            <p>
                Entity Framework compara tu <strong>modelo de datos actual</strong> con la última snapshot y
                genera el SQL necesario para actualizar el esquema de la base de datos.
            </p>

            <div class="alert alert-info border-0" role="alert">
                <h6 class="alert-heading">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    Métodos principales
                </h6>
                <ul class="mb-0">
                    <li><strong>Up()</strong> – Aplica los cambios al esquema</li>
                    <li><strong>Down()</strong> – Revierte los cambios hechos en Up()</li>
                </ul>
            </div>
        </div>

        <!-- Section 2 -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">2</span>
                Crear una Migración
            </h2>
            <p>Usa la CLI de EF Core para generar y aplicar migraciones:</p>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">BASH</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, code1)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ code1 }}</code></pre>
                </div>
            </div>

            <div class="alert alert-warning border-0" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Nota:</strong> Asegúrate de estar en el directorio correcto del proyecto antes de ejecutar estos
                comandos.
            </div>
        </div>

        <!-- Section 3 -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">3</span>
                Revertir una Migración
            </h2>
            <p>Para revertir tu base de datos a una migración anterior:</p>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">BASH</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, code2)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ code2 }}</code></pre>
                </div>
            </div>

            <p>Para eliminar la última migración (no aplicada):</p>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">BASH</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, code3)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ code3 }}</code></pre>
                </div>
            </div>
        </div>

        <!-- Section 4 -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">4</span>
                Tabla de Historial de Migraciones
            </h2>
            <p>
                EF Core crea automáticamente una tabla llamada <code
                    class="bg-light px-2 py-1 rounded">__EFMigrationsHistory</code>
                que almacena información sobre las migraciones previamente aplicadas.
            </p>

            <div class="card border-0 bg-light">
                <div class="card-body">
                    <h6 class="card-title">
                        <i class="bi bi-table me-2"></i>
                        Estructura de la tabla
                    </h6>
                    <table class="table table-sm table-bordered bg-white mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>MigrationId</th>
                                <th>ProductVersion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>20240115_InitialCreate</code></td>
                                <td><code>8.0.0</code></td>
                            </tr>
                            <tr>
                                <td><code>20240120_AddUserTable</code></td>
                                <td><code>8.0.0</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Section 5 -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">5</span>
                Mejores Prácticas
            </h2>

            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card border-0 h-100 bg-success bg-opacity-10">
                        <div class="card-body">
                            <h6 class="card-title text-success">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                Hacer
                            </h6>
                            <ul class="mb-0 small">
                                <li>Usa nombres descriptivos (ej: <code>AddUserTable</code>)</li>
                                <li>Crea migraciones frecuentemente durante el desarrollo</li>
                                <li>Revisa el código generado antes de aplicar</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 h-100 bg-danger bg-opacity-10">
                        <div class="card-body">
                            <h6 class="card-title text-danger">
                                <i class="bi bi-x-circle-fill me-2"></i>
                                Evitar
                            </h6>
                            <ul class="mb-0 small">
                                <li>No ejecutar migraciones sin backup en producción</li>
                                <li>No editar migraciones ya aplicadas</li>
                                <li>No mezclar cambios de esquema con datos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="alert alert-primary border-0 mt-3" role="alert">
                <h6 class="alert-heading">
                    <i class="bi bi-lightbulb-fill me-2"></i>
                    Tip Pro
                </h6>
                <p class="mb-0">
                    Mantén tu DbContext y clases de modelo limpias y consistentes. Esto facilitará la generación
                    automática de migraciones correctas.
                </p>
            </div>
        </div>

        <!-- Resources -->
        <div class="card border-primary">
            <div class="card-header bg-primary text-white">
                <i class="bi bi-link-45deg me-2"></i>
                Recursos Adicionales
            </div>
            <div class="card-body">
                <ul class="list-unstyled mb-0">
                    <li class="mb-2">
                        <a href="https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/" target="_blank"
                            class="text-decoration-none">
                            <i class="bi bi-arrow-right-circle me-2"></i>
                            Documentación Oficial de Microsoft
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://learn.microsoft.com/en-us/ef/core/cli/dotnet" target="_blank"
                            class="text-decoration-none">
                            <i class="bi bi-arrow-right-circle me-2"></i>
                            EF Core CLI Reference
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const code1 = `dotnet ef migrations add <MigrationName>
dotnet ef database update`;

const code2 = `dotnet ef database update <PreviousMigrationName>`;

const code3 = `dotnet ef migrations remove`;

const copyCode = (event: Event, code: string) => {
    navigator.clipboard.writeText(code);
    const button = event.currentTarget as HTMLElement;
    const icon = button.querySelector('i');

    if (icon) {
        icon.className = 'bi bi-check';
        setTimeout(() => {
            icon.className = 'bi bi-clipboard';
        }, 2000);
    }
};
</script>

<style scoped>
pre {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    white-space: pre-wrap;
}

code {
    font-family: 'Courier New', monospace;
}
</style>