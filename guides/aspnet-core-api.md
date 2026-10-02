# ASP.NET Core Web API

Guía completa de métodos CRUD para APIs RESTful

---

## 1. GET – Obtener Datos

Usa **GET** para recuperar datos del servidor.

> **Casos de uso:** Listar todos los elementos o recuperar uno específico por ID

```csharp
[HttpGet]
public IActionResult GetAll()
{
    return Ok(products);
}

[HttpGet("{id}")]
public IActionResult GetById(int id)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    return product == null ? NotFound() : Ok(product);
}
```

### Códigos de respuesta

- `200 OK` - Datos encontrados
- `404 Not Found` - Recurso no existe

### Características

- Operación segura (no modifica datos)
- Idempotente
- Cacheable

## 2. POST – Crear Datos

**POST** se usa para enviar nuevos datos a la API y crear un elemento.

> **Casos de uso:** Crear un nuevo registro en la base de datos

```csharp
[HttpPost]
public IActionResult Create(Product product)
{
    products.Add(product);
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
}
```

### Códigos de respuesta

- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos

### Buena práctica

Retorna `CreatedAtAction` con la URL del nuevo recurso en el header `Location`

## 3. PUT – Actualizar Datos

**PUT** reemplaza un recurso existente con una nueva versión completa.

> **Casos de uso:** Actualizar completamente un registro existente

```csharp
[HttpPut("{id}")]
public IActionResult Update(int id, Product updated)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    if (product == null)
        return NotFound();

    product.Name = updated.Name;
    product.Price = updated.Price;

    return NoContent();
}
```

> ### PUT vs PATCH
>
> - **PUT** - Reemplaza TODO el recurso (actualización completa)
> - **PATCH** - Actualiza SOLO los campos especificados (actualización parcial)

## 4. DELETE – Eliminar Datos

**DELETE** elimina un elemento existente de la base de datos.

> **Precaución:** Esta operación suele ser irreversible

```csharp
[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    if (product == null)
        return NotFound();

    products.Remove(product);
    return NoContent();
}
```

### Códigos de respuesta

- `204 No Content` - Eliminado exitosamente
- `404 Not Found` - Recurso no existe

### Consideraciones de seguridad

- Implementar autorización adecuada
- Considerar soft-delete vs hard-delete

## 5. Resumen de Métodos HTTP

| Método | Operación | Idempotente | Código Éxito |
| --- | --- | --- | --- |
| **GET** | Obtener datos | Sí | `200 OK` |
| **POST** | Crear nuevo registro | No | `201 Created` |
| **PUT** | Reemplazar registro completo | Sí | `204 No Content` |
| **PATCH** | Actualización parcial | No | `204 No Content` |
| **DELETE** | Eliminar registro | Sí | `204 No Content` |

## Mejores Prácticas

### Hacer

- Usar códigos de estado HTTP apropiados
- Validar datos de entrada
- Implementar manejo de errores
- Documentar tu API (Swagger/OpenAPI)

### Evitar

- Usar GET para operaciones que modifican datos
- Exponer detalles internos de implementación
- Ignorar la validación de modelos
- Retornar información sensible en errores
