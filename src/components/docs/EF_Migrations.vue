<template>
    <div>
        <!-- Title -->
        <div class="mb-6">
            <h1 class="mb-2 text-3xl font-bold">EF Core Migrations</h1>
            <p class="text-lg text-muted">Guía completa para gestionar migraciones en Entity Framework Core</p>
        </div>

        <hr class="mb-12 border-line">

        <!-- Section 1 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">1</span>
                Cómo Funcionan las Migraciones
            </h2>
            <p>
                Entity Framework compara tu <strong>modelo de datos actual</strong> con la última snapshot y
                genera el SQL necesario para actualizar el esquema de la base de datos.
            </p>

            <div class="mt-4 rounded-lg bg-info/10 p-4 text-info" role="alert">
                <h6 class="font-semibold">
                    <i class="bi bi-info-circle-fill mr-2"></i>
                    Métodos principales
                </h6>
                <ul class="mt-2 list-disc space-y-1 pl-5">
                    <li><strong>Up()</strong> – Aplica los cambios al esquema</li>
                    <li><strong>Down()</strong> – Revierte los cambios hechos en Up()</li>
                </ul>
            </div>
        </div>

        <!-- Section 2 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">2</span>
                Crear una Migración
            </h2>
            <p>Usa la CLI de EF Core para generar y aplicar migraciones:</p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">BASH</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, code1)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ code1 }}</code></pre>
            </div>

            <div class="rounded-lg bg-warning/10 p-4 text-yellow-700 dark:text-yellow-500" role="alert">
                <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                <strong>Nota:</strong> Asegúrate de estar en el directorio correcto del proyecto antes de ejecutar estos
                comandos.
            </div>
        </div>

        <!-- Section 3 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">3</span>
                Revertir una Migración
            </h2>
            <p>Para revertir tu base de datos a una migración anterior:</p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">BASH</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, code2)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ code2 }}</code></pre>
            </div>

            <p>Para eliminar la última migración (no aplicada):</p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">BASH</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, code3)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ code3 }}</code></pre>
            </div>
        </div>

        <!-- Section 4 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">4</span>
                Tabla de Historial de Migraciones
            </h2>
            <p>
                EF Core crea automáticamente una tabla llamada <code>__EFMigrationsHistory</code>
                que almacena información sobre las migraciones previamente aplicadas.
            </p>

            <div class="mt-4 rounded-lg bg-soft p-4">
                <h6 class="font-semibold">
                    <i class="bi bi-table mr-2"></i>
                    Estructura de la tabla
                </h6>
                <table class="mt-2 w-full border border-line bg-surface text-left text-sm">
                    <thead class="bg-soft">
                        <tr>
                            <th class="border border-line px-3 py-2">MigrationId</th>
                            <th class="border border-line px-3 py-2">ProductVersion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-line px-3 py-2"><code>20240115_InitialCreate</code></td>
                            <td class="border border-line px-3 py-2"><code>8.0.0</code></td>
                        </tr>
                        <tr>
                            <td class="border border-line px-3 py-2"><code>20240120_AddUserTable</code></td>
                            <td class="border border-line px-3 py-2"><code>8.0.0</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 5 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">5</span>
                Mejores Prácticas
            </h2>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="h-full rounded-lg bg-success/10 p-4">
                    <h6 class="font-semibold text-success">
                        <i class="bi bi-check-circle-fill mr-2"></i>
                        Hacer
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Usa nombres descriptivos (ej: <code>AddUserTable</code>)</li>
                        <li>Crea migraciones frecuentemente durante el desarrollo</li>
                        <li>Revisa el código generado antes de aplicar</li>
                    </ul>
                </div>
                <div class="h-full rounded-lg bg-danger/10 p-4">
                    <h6 class="font-semibold text-danger">
                        <i class="bi bi-x-circle-fill mr-2"></i>
                        Evitar
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>No ejecutar migraciones sin backup en producción</li>
                        <li>No editar migraciones ya aplicadas</li>
                        <li>No mezclar cambios de esquema con datos</li>
                    </ul>
                </div>
            </div>

            <div class="mt-4 rounded-lg bg-primary/10 p-4 text-primary" role="alert">
                <h6 class="font-semibold">
                    <i class="bi bi-lightbulb-fill mr-2"></i>
                    Tip Pro
                </h6>
                <p class="mt-1">
                    Mantén tu DbContext y clases de modelo limpias y consistentes. Esto facilitará la generación
                    automática de migraciones correctas.
                </p>
            </div>
        </div>

        <!-- Resources -->
        <div class="overflow-hidden rounded-lg border border-primary">
            <div class="bg-primary p-4 text-white">
                <i class="bi bi-link-45deg mr-2"></i>
                Recursos Adicionales
            </div>
            <div class="p-4">
                <ul class="list-none">
                    <li class="mb-2">
                        <a href="https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/" target="_blank"
                            class="no-underline hover:underline">
                            <i class="bi bi-arrow-right-circle mr-2"></i>
                            Documentación Oficial de Microsoft
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://learn.microsoft.com/en-us/ef/core/cli/dotnet" target="_blank"
                            class="no-underline hover:underline">
                            <i class="bi bi-arrow-right-circle mr-2"></i>
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
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

pre code {
    background: transparent;
    color: inherit;
    padding: 0;
}
</style>
