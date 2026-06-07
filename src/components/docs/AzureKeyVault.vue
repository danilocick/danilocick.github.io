<template>
    <div>
        <!-- Title -->
        <div class="mb-6">
            <h1 class="mb-2 text-3xl font-bold">Azure Key Vault</h1>
            <p class="text-lg text-muted">Cómo conectar Key Vault a tu app ASP.NET Core y consumir un secreto</p>
        </div>

        <hr class="mb-12 border-line">

        <!-- Section 1 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">1</span>
                ¿Qué es y por qué usarlo?
            </h2>
            <p>
                <strong>Azure Key Vault</strong> es un servicio gestionado para guardar <strong>secretos</strong>
                (cadenas de conexión, claves de API, certificados) fuera de tu código y de tus archivos de
                configuración. Tu aplicación los lee en tiempo de ejecución mediante una identidad autorizada.
            </p>

            <div class="my-4 rounded-lg bg-primary/10 p-4 text-primary" role="alert">
                <i class="bi bi-shield-check mr-2"></i>
                <strong>Ventaja clave:</strong> nunca commiteas secretos al repositorio y puedes rotarlos sin volver a desplegar.
            </div>
        </div>

        <!-- Section 2 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">2</span>
                Instalar los paquetes
            </h2>
            <p>Necesitas <code>Azure.Identity</code> para autenticarte y la extensión de configuración:</p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">BASH</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, packagesCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ packagesCode }}</code></pre>
            </div>
        </div>

        <!-- Section 3 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">3</span>
                Conectar Key Vault en Program.cs
            </h2>
            <p>
                Añade Key Vault como una fuente más de configuración. <code>DefaultAzureCredential</code> usa tu
                login local (<code>az login</code> / Visual Studio) en desarrollo y la <strong>Managed Identity</strong>
                en producción, sin cambiar el código.
            </p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, programCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ programCode }}</code></pre>
            </div>

            <div class="rounded-lg bg-warning/10 p-4 text-yellow-700 dark:text-yellow-500" role="alert">
                <i class="bi bi-exclamation-triangle-fill mr-2"></i>
                <strong>Nota:</strong> los nombres de secreto no admiten <code>:</code>. Usa doble guion
                <code>--</code> para representar la jerarquía: <code>ConnectionStrings--Default</code> se lee
                en la app como <code>ConnectionStrings:Default</code>.
            </div>
        </div>

        <!-- Section 4 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">4</span>
                Crear un secreto
            </h2>
            <p>Desde la CLI de Azure (o el portal) guarda el valor en tu Key Vault:</p>

            <div class="my-4 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">BASH</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, setSecretCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ setSecretCode }}</code></pre>
            </div>
        </div>

        <!-- Section 5 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-success text-sm font-semibold text-white">5</span>
                Usar un valor
            </h2>
            <p>
                Como Key Vault es una fuente de <code>IConfiguration</code>, lees el secreto exactamente igual que
                cualquier otra opción de configuración. Tienes tres formas habituales:
            </p>

            <h6 class="mb-2 mt-4 font-semibold text-success">
                <i class="bi bi-arrow-return-right mr-2"></i>A) Directo desde IConfiguration
            </h6>
            <div class="my-3 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, useConfigCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ useConfigCode }}</code></pre>
            </div>

            <h6 class="mb-2 mt-4 font-semibold text-success">
                <i class="bi bi-arrow-return-right mr-2"></i>B) Con el patrón Options (recomendado)
            </h6>
            <div class="my-3 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, optionsCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ optionsCode }}</code></pre>
            </div>

            <h6 class="mb-2 mt-4 font-semibold text-success">
                <i class="bi bi-arrow-return-right mr-2"></i>C) Acceso puntual con SecretClient
            </h6>
            <div class="my-3 rounded-lg bg-gray-900 p-4 text-white">
                <div class="mb-2 flex items-center justify-between">
                    <small class="text-sm text-gray-400">C#</small>
                    <button class="rounded border border-white/40 px-2 py-1 text-sm transition hover:bg-white hover:text-gray-900"
                        @click="copyCode($event, secretClientCode)">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
                <pre class="mb-0"><code>{{ secretClientCode }}</code></pre>
            </div>
        </div>

        <!-- Section 6 -->
        <div class="mb-12">
            <h2 class="mb-4 flex items-center text-xl font-semibold">
                <span class="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">6</span>
                Mejores Prácticas
            </h2>

            <div class="grid gap-4 md:grid-cols-2">
                <div class="h-full rounded-lg bg-success/10 p-4">
                    <h6 class="font-semibold text-success">
                        <i class="bi bi-check-circle-fill mr-2"></i>
                        Hacer
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Usar <strong>Managed Identity</strong> en producción (cero credenciales en el código)</li>
                        <li>Conceder permisos con RBAC y el rol <em>Key Vault Secrets User</em></li>
                        <li>Cachear los valores; evitar leer Key Vault en cada petición</li>
                        <li>Rotar secretos periódicamente</li>
                    </ul>
                </div>
                <div class="h-full rounded-lg bg-danger/10 p-4">
                    <h6 class="font-semibold text-danger">
                        <i class="bi bi-x-circle-fill mr-2"></i>
                        Evitar
                    </h6>
                    <ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
                        <li>Guardar secretos en <code>appsettings.json</code> o en el repositorio</li>
                        <li>Loguear el valor de un secreto</li>
                        <li>Compartir una sola identidad para todos los entornos</li>
                        <li>Hardcodear la URL del vault (mejor por configuración)</li>
                    </ul>
                </div>
            </div>

            <div class="mt-3 rounded-lg bg-primary/10 p-4 text-primary" role="alert">
                <h6 class="font-semibold">
                    <i class="bi bi-lightbulb-fill mr-2"></i>
                    Tip Pro
                </h6>
                <p class="mt-1">
                    En desarrollo puedes prescindir de Key Vault y usar <strong>User Secrets</strong>
                    (<code>dotnet user-secrets</code>); ambos alimentan el mismo <code>IConfiguration</code>,
                    así que tu código para leer el valor no cambia.
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
                        <a href="https://learn.microsoft.com/en-us/aspnet/core/security/key-vault-configuration"
                            target="_blank" class="no-underline hover:underline">
                            <i class="bi bi-arrow-right-circle mr-2"></i>
                            Key Vault configuration provider en ASP.NET Core
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://learn.microsoft.com/en-us/dotnet/api/overview/azure/identity-readme"
                            target="_blank" class="no-underline hover:underline">
                            <i class="bi bi-arrow-right-circle mr-2"></i>
                            Azure.Identity — DefaultAzureCredential
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const packagesCode = `dotnet add package Azure.Identity
dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets`;

const programCode = `using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// El nombre del vault vive en appsettings (no es secreto)
var vaultName = builder.Configuration["KeyVault:Name"];
var vaultUri = new Uri($"https://{vaultName}.vault.azure.net/");

// Añade Key Vault como fuente de configuración
builder.Configuration.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());

var app = builder.Build();`;

const setSecretCode = `az keyvault secret set \\
  --vault-name mi-keyvault \\
  --name "ConnectionStrings--Default" \\
  --value "Server=tcp:db;Database=app;User Id=...;Password=...;"`;

const useConfigCode = `[ApiController]
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
}`;

const optionsCode = `// 1) Clase de opciones
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
}`;

const secretClientCode = `using Azure.Security.KeyVault.Secrets;
using Azure.Identity;

var client = new SecretClient(
    new Uri("https://mi-keyvault.vault.azure.net/"),
    new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync("MiSecreto");
string value = secret.Value;`;

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
