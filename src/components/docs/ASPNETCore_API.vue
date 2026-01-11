<template>
    <div>
        <!-- Title -->
        <div class="mb-4">
            <h1 class="display-6 fw-bold mb-2">ASP.NET Core Web API</h1>
            <p class="lead text-muted">Guía completa de métodos CRUD para APIs RESTful</p>
        </div>

        <hr class="mb-5">

        <!-- GET Method -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-primary rounded-circle me-2">1</span>
                GET – Obtener Datos
            </h2>
            <p>Usa <strong>GET</strong> para recuperar datos del servidor.</p>

            <div class="alert alert-primary border-0" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>Casos de uso:</strong> Listar todos los elementos o recuperar uno específico por ID
            </div>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">C#</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, getCode)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ getCode }}</code></pre>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-primary">
                                <i class="bi bi-arrow-return-right me-2"></i>
                                Códigos de respuesta
                            </h6>
                            <ul class="small mb-0">
                                <li><code>200 OK</code> - Datos encontrados</li>
                                <li><code>404 Not Found</code> - Recurso no existe</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-primary">
                                <i class="bi bi-check-circle me-2"></i>
                                Características
                            </h6>
                            <ul class="small mb-0">
                                <li>Operación segura (no modifica datos)</li>
                                <li>Idempotente</li>
                                <li>Cacheable</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- POST Method -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-success rounded-circle me-2">2</span>
                POST – Crear Datos
            </h2>
            <p><strong>POST</strong> se usa para enviar nuevos datos a la API y crear un elemento.</p>

            <div class="alert alert-success border-0" role="alert">
                <i class="bi bi-plus-circle-fill me-2"></i>
                <strong>Casos de uso:</strong> Crear un nuevo registro en la base de datos
            </div>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">C#</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, postCode)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ postCode }}</code></pre>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-success">
                                <i class="bi bi-arrow-return-right me-2"></i>
                                Códigos de respuesta
                            </h6>
                            <ul class="small mb-0">
                                <li><code>201 Created</code> - Recurso creado exitosamente</li>
                                <li><code>400 Bad Request</code> - Datos inválidos</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-success">
                                <i class="bi bi-lightbulb me-2"></i>
                                Buena práctica
                            </h6>
                            <p class="small mb-0">
                                Retorna <code>CreatedAtAction</code> con la URL del nuevo recurso en el header
                                <code>Location</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- PUT Method -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-warning text-dark rounded-circle me-2">3</span>
                PUT – Actualizar Datos
            </h2>
            <p><strong>PUT</strong> reemplaza un recurso existente con una nueva versión completa.</p>

            <div class="alert alert-warning border-0" role="alert">
                <i class="bi bi-arrow-repeat me-2"></i>
                <strong>Casos de uso:</strong> Actualizar completamente un registro existente
            </div>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">C#</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, putCode)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ putCode }}</code></pre>
                </div>
            </div>

            <div class="card border-warning bg-warning bg-opacity-10">
                <div class="card-body">
                    <h6 class="text-warning">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        PUT vs PATCH
                    </h6>
                    <ul class="small mb-0">
                        <li><strong>PUT</strong> - Reemplaza TODO el recurso (actualización completa)</li>
                        <li><strong>PATCH</strong> - Actualiza SOLO los campos especificados (actualización parcial)
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- DELETE Method -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-danger rounded-circle me-2">4</span>
                DELETE – Eliminar Datos
            </h2>
            <p><strong>DELETE</strong> elimina un elemento existente de la base de datos.</p>

            <div class="alert alert-danger border-0" role="alert">
                <i class="bi bi-trash-fill me-2"></i>
                <strong>Precaución:</strong> Esta operación suele ser irreversible
            </div>

            <div class="card bg-dark text-white mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">C#</small>
                        <button class="btn btn-sm btn-outline-light" @click="copyCode($event, deleteCode)">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <pre class="mb-0"><code>{{ deleteCode }}</code></pre>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-danger">
                                <i class="bi bi-arrow-return-right me-2"></i>
                                Códigos de respuesta
                            </h6>
                            <ul class="small mb-0">
                                <li><code>204 No Content</code> - Eliminado exitosamente</li>
                                <li><code>404 Not Found</code> - Recurso no existe</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 bg-light h-100">
                        <div class="card-body">
                            <h6 class="text-danger">
                                <i class="bi bi-shield-check me-2"></i>
                                Consideraciones de seguridad
                            </h6>
                            <ul class="small mb-0">
                                <li>Implementar autorización adecuada</li>
                                <li>Considerar soft-delete vs hard-delete</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Table -->
        <div class="mb-5">
            <h2 class="h4 mb-3">
                <span class="badge bg-dark rounded-circle me-2">5</span>
                Resumen de Métodos HTTP
            </h2>

            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Método</th>
                            <th>Operación</th>
                            <th>Idempotente</th>
                            <th>Código Éxito</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="badge bg-primary">GET</span></td>
                            <td>Obtener datos</td>
                            <td><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td><code>200 OK</code></td>
                        </tr>
                        <tr>
                            <td><span class="badge bg-success">POST</span></td>
                            <td>Crear nuevo registro</td>
                            <td><i class="bi bi-x-circle-fill text-danger"></i> No</td>
                            <td><code>201 Created</code></td>
                        </tr>
                        <tr>
                            <td><span class="badge bg-warning text-dark">PUT</span></td>
                            <td>Reemplazar registro completo</td>
                            <td><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td><code>204 No Content</code></td>
                        </tr>
                        <tr>
                            <td><span class="badge bg-info text-dark">PATCH</span></td>
                            <td>Actualización parcial</td>
                            <td><i class="bi bi-x-circle-fill text-danger"></i> No</td>
                            <td><code>204 No Content</code></td>
                        </tr>
                        <tr>
                            <td><span class="badge bg-danger">DELETE</span></td>
                            <td>Eliminar registro</td>
                            <td><i class="bi bi-check-circle-fill text-success"></i> Sí</td>
                            <td><code>204 No Content</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Best Practices -->
        <div class="card border-primary">
            <div class="card-header bg-primary text-white">
                <i class="bi bi-star-fill me-2"></i>
                Mejores Prácticas
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <h6 class="text-success">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            Hacer
                        </h6>
                        <ul class="small">
                            <li>Usar códigos de estado HTTP apropiados</li>
                            <li>Validar datos de entrada</li>
                            <li>Implementar manejo de errores</li>
                            <li>Documentar tu API (Swagger/OpenAPI)</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-danger">
                            <i class="bi bi-x-circle-fill me-2"></i>
                            Evitar
                        </h6>
                        <ul class="small">
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
}
</style>