<template>
    <div>
        <!-- Title -->
        <div class="mb-6">
            <h1 class="mb-2 text-3xl font-bold">ASP.NET Core Web API</h1>
            <p class="text-lg text-muted">Guía completa de métodos CRUD para APIs RESTful</p>
        </div>

        <hr class="mb-12 border-line">

        <!-- GET Method -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">1</span>
                GET – Obtener Datos
            </h2>
            <p>Usa <strong>GET</strong> para recuperar datos del servidor.</p>

            <div class="my-4 rounded-lg bg-primary/10 p-4 text-primary" role="alert">
                <i class="bi bi-info-circle-fill mr-2"></i>
                <strong>Casos de uso:</strong> Listar todos los elementos o recuperar uno específico por ID
            </div>

            <div class="mb-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, getCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ getCode }}</code></pre>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-primary">
                        <i class="bi bi-arrow-return-right mr-2"></i>
                        Códigos de respuesta
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li><code>200 OK</code> - Datos encontrados</li>
                        <li><code>404 Not Found</code> - Recurso no existe</li>
                    </ul>
                </div>
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-primary">
                        <i class="bi bi-check-circle mr-2"></i>
                        Características
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Operación segura (no modifica datos)</li>
                        <li>Idempotente</li>
                        <li>Cacheable</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- POST Method -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-success text-sm font-semibold text-white">2</span>
                POST – Crear Datos
            </h2>
            <p><strong>POST</strong> se usa para enviar nuevos datos a la API y crear un elemento.</p>

            <div class="my-4 rounded-lg bg-success/10 p-4 text-success" role="alert">
                <i class="bi bi-plus-circle-fill mr-2"></i>
                <strong>Casos de uso:</strong> Crear un nuevo registro en la base de datos
            </div>

            <div class="mb-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, postCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ postCode }}</code></pre>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-success">
                        <i class="bi bi-arrow-return-right mr-2"></i>
                        Códigos de respuesta
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li><code>201 Created</code> - Recurso creado exitosamente</li>
                        <li><code>400 Bad Request</code> - Datos inválidos</li>
                    </ul>
                </div>
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-success">
                        <i class="bi bi-lightbulb mr-2"></i>
                        Buena práctica
                    </h6>
                    <p class="mt-2 text-sm">
                        Retorna <code>CreatedAtAction</code> con la URL del nuevo recurso en el header
                        <code>Location</code>
                    </p>
                </div>
            </div>
        </div>

        <!-- PUT Method -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-warning text-sm font-semibold text-gray-900">3</span>
                PUT – Actualizar Datos
            </h2>
            <p><strong>PUT</strong> reemplaza un recurso existente con una nueva versión completa.</p>

            <div class="my-4 rounded-lg bg-warning/10 p-4 text-yellow-700 dark:text-yellow-500" role="alert">
                <i class="bi bi-arrow-repeat mr-2"></i>
                <strong>Casos de uso:</strong> Actualizar completamente un registro existente
            </div>

            <div class="mb-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, putCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ putCode }}</code></pre>
            </div>

            <div class="rounded-lg border border-warning bg-warning/10 p-4">
                <h6 class="font-semibold text-yellow-700 dark:text-yellow-500">
                    <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                    PUT vs PATCH
                </h6>
                <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                    <li><strong>PUT</strong> - Reemplaza TODO el recurso (actualización completa)</li>
                    <li><strong>PATCH</strong> - Actualiza SOLO los campos especificados (actualización parcial)</li>
                </ul>
            </div>
        </div>

        <!-- DELETE Method -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-danger text-sm font-semibold text-white">4</span>
                DELETE – Eliminar Datos
            </h2>
            <p><strong>DELETE</strong> elimina un elemento existente de la base de datos.</p>

            <div class="my-4 rounded-lg bg-danger/10 p-4 text-danger" role="alert">
                <i class="bi bi-trash-fill mr-2"></i>
                <strong>Precaución:</strong> Esta operación suele ser irreversible
            </div>

            <div class="mb-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, deleteCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ deleteCode }}</code></pre>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-danger">
                        <i class="bi bi-arrow-return-right mr-2"></i>
                        Códigos de respuesta
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li><code>204 No Content</code> - Eliminado exitosamente</li>
                        <li><code>404 Not Found</code> - Recurso no existe</li>
                    </ul>
                </div>
                <div class="h-full rounded-lg bg-soft p-4">
                    <h6 class="font-semibold text-danger">
                        <i class="bi bi-shield-check mr-2"></i>
                        Consideraciones de seguridad
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Implementar autorización adecuada</li>
                        <li>Considerar soft-delete vs hard-delete</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Summary Table -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">5</span>
                Resumen de Métodos HTTP
            </h2>

            <div class="overflow-x-auto">
                <table class="w-full border border-line text-left">
                    <thead class="bg-gray-900 text-white">
                        <tr>
                            <th class="border border-line px-4 py-2">Método</th>
                            <th class="border border-line px-4 py-2">Operación</th>
                            <th class="border border-line px-4 py-2">Idempotente</th>
                            <th class="border border-line px-4 py-2">Código Éxito</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-line px-4 py-2"><span class="badge badge-primary">GET</span></td>
                            <td class="border border-line px-4 py-2">Obtener datos</td>
                            <td class="border border-line px-4 py-2"><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td class="border border-line px-4 py-2"><code>200 OK</code></td>
                        </tr>
                        <tr>
                            <td class="border border-line px-4 py-2"><span class="badge badge-success">POST</span></td>
                            <td class="border border-line px-4 py-2">Crear nuevo registro</td>
                            <td class="border border-line px-4 py-2"><i class="bi bi-x-circle-fill text-danger"></i> No</td>
                            <td class="border border-line px-4 py-2"><code>201 Created</code></td>
                        </tr>
                        <tr>
                            <td class="border border-line px-4 py-2"><span class="badge badge-warning">PUT</span></td>
                            <td class="border border-line px-4 py-2">Reemplazar registro completo</td>
                            <td class="border border-line px-4 py-2"><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td class="border border-line px-4 py-2"><code>204 No Content</code></td>
                        </tr>
                        <tr>
                            <td class="border border-line px-4 py-2"><span class="badge badge-info">PATCH</span></td>
                            <td class="border border-line px-4 py-2">Actualización parcial</td>
                            <td class="border border-line px-4 py-2"><i class="bi bi-x-circle-fill text-danger"></i> No</td>
                            <td class="border border-line px-4 py-2"><code>204 No Content</code></td>
                        </tr>
                        <tr>
                            <td class="border border-line px-4 py-2"><span class="badge badge-danger">DELETE</span></td>
                            <td class="border border-line px-4 py-2">Eliminar registro</td>
                            <td class="border border-line px-4 py-2"><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td class="border border-line px-4 py-2"><code>204 No Content</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Best Practices -->
        <div class="overflow-hidden rounded-lg border border-primary">
            <div class="bg-primary p-4 text-white">
                <i class="bi bi-star-fill mr-2"></i>
                Mejores Prácticas
            </div>
            <div class="p-4">
                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <h6 class="font-semibold text-success">
                            <i class="bi bi-check-circle-fill mr-2"></i>
                            Hacer
                        </h6>
                        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                            <li>Usar códigos de estado HTTP apropiados</li>
                            <li>Validar datos de entrada</li>
                            <li>Implementar manejo de errores</li>
                            <li>Documentar tu API (Swagger/OpenAPI)</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-semibold text-danger">
                            <i class="bi bi-x-circle-fill mr-2"></i>
                            Evitar
                        </h6>
                        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                            <li>Usar GET para operaciones que modifican datos</li>
                            <li>Exponer detalles internos de implementación</li>
                            <li>Ignorar la validación de modelos</li>
                            <li>Retornar información sensible en errores</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const getCode = `[HttpGet]
public IActionResult GetAll()
{
    return Ok(products);
}

[HttpGet("{id}")]
public IActionResult GetById(int id)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    return product == null ? NotFound() : Ok(product);
}`;

const postCode = `[HttpPost]
public IActionResult Create(Product product)
{
    products.Add(product);
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
}`;

const putCode = `[HttpPut("{id}")]
public IActionResult Update(int id, Product updated)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    if (product == null)
        return NotFound();

    product.Name = updated.Name;
    product.Price = updated.Price;

    return NoContent();
}`;

const deleteCode = `[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    if (product == null)
        return NotFound();

    products.Remove(product);
    return NoContent();
}`;

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
