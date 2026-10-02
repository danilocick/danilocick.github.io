# Azure Key Vault

Cómo conectar Key Vault a tu app ASP.NET Core y consumir un secreto

---

## 1. ¿Qué es y por qué usarlo?

**Azure Key Vault** es un servicio gestionado para guardar **secretos** (cadenas de conexión, claves de API, certificados) fuera de tu código y de tus archivos de configuración. Tu aplicación los lee en tiempo de ejecución mediante una identidad autorizada.

> **Ventaja clave:** nunca commiteas secretos al repositorio y puedes rotarlos sin volver a desplegar.

## 2. Instalar los paquetes

Necesitas `Azure.Identity` para autenticarte y la extensión de configuración:

```bash
dotnet add package Azure.Identity
dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets
```

## 3. Conectar Key Vault en Program.cs

Añade Key Vault como una fuente más de configuración. `DefaultAzureCredential` usa tu login local (`az login` / Visual Studio) en desarrollo y la **Managed Identity** en producción, sin cambiar el código.

```csharp
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// El nombre del vault vive en appsettings (no es secreto)
var vaultName = builder.Configuration["KeyVault:Name"];
var vaultUri = new Uri($"https://{vaultName}.vault.azure.net/");

// Añade Key Vault como fuente de configuración
builder.Configuration.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());

var app = builder.Build();
```

> **Nota:** los nombres de secreto no admiten `:`. Usa doble guion `--` para representar la jerarquía: `ConnectionStrings--Default` se lee en la app como `ConnectionStrings:Default`.

## 4. Crear un secreto

Desde la CLI de Azure (o el portal) guarda el valor en tu Key Vault:

```bash
az keyvault secret set \
  --vault-name mi-keyvault \
  --name "ConnectionStrings--Default" \
  --value "Server=tcp:db;Database=app;User Id=...;Password=...;"
```

## 5. Usar un valor

Como Key Vault es una fuente de `IConfiguration`, lees el secreto exactamente igual que cualquier otra opción de configuración. Tienes tres formas habituales:

### A) Directo desde IConfiguration

```csharp
[ApiController]
[Route("[controller]")]
public class StatusController(IConfiguration config) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        // Se lee igual que cualquier configuración
        string? conn = config["ConnectionStrings:Default"];
        string? apiKey = config["ExternalApi:Key"];

        return Ok(new { connected = !string.IsNullOrEmpty(conn) });
    }
}
```

### B) Con el patrón Options (recomendado)

```csharp
// 1) Clase de opciones
public class ExternalApiOptions
{
    public string Url { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}

// 2) Registro en Program.cs (lee la sección "ExternalApi")
builder.Services.Configure<ExternalApiOptions>(
    builder.Configuration.GetSection("ExternalApi"));

// 3) Inyección tipada donde la necesites
public class ApiClient(IOptions<ExternalApiOptions> options)
{
    private readonly ExternalApiOptions _opt = options.Value;

    public string BuildUrl() => $"{_opt.Url}?key={_opt.Key}";
}
```

### C) Acceso puntual con SecretClient

```csharp
using Azure.Security.KeyVault.Secrets;
using Azure.Identity;

var client = new SecretClient(
    new Uri("https://mi-keyvault.vault.azure.net/"),
    new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync("MiSecreto");
string value = secret.Value;
```

## 6. Mejores Prácticas

### Hacer

- Usar **Managed Identity** en producción (cero credenciales en el código)
- Conceder permisos con RBAC y el rol *Key Vault Secrets User*
- Cachear los valores; evitar leer Key Vault en cada petición
- Rotar secretos periódicamente

### Evitar

- Guardar secretos en `appsettings.json` o en el repositorio
- Loguear el valor de un secreto
- Compartir una sola identidad para todos los entornos
- Hardcodear la URL del vault (mejor por configuración)

> ### Tip Pro
>
> En desarrollo puedes prescindir de Key Vault y usar **User Secrets** (`dotnet user-secrets`); ambos alimentan el mismo `IConfiguration`, así que tu código para leer el valor no cambia.

## Recursos Adicionales

- [Key Vault configuration provider en ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/key-vault-configuration)
- [Azure.Identity — DefaultAzureCredential](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/identity-readme)
