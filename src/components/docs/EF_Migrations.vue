<template>
    <div class="container my-4">
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h1 class="card-title h3 mb-3">EF Core Migrations – Docs</h1>
                <hr />
                <!-- Section -->
                <h4 class="mb-3">
                    <span class="badge bg-card">1</span> How Migrations Work
                </h4>
                <p>
                    Entity Framework compares your <strong>current data model</strong> with the last snapshot and
                    generates the SQL needed to update the database schema.
                </p>
                <ul class="list-group mb-4">
                    <li class="list-group-item"><strong>Up()</strong> – Applies schema changes.</li>
                    <li class="list-group-item"><strong>Down()</strong> – Reverts the changes made in Up().</li>
                </ul>
                <h4 class="mb-3">
                    <span class="badge bg-card">2</span> Creating a Migration
                </h4>
                <p>Use the EF Core CLI to generate and apply migrations:</p>

                <pre class="bg-light p-3 rounded border">
                dotnet ef migrations add &lt;MigrationName&gt;
                dotnet ef database update
                </pre>

                <h4 class="mb-3">
                    <span class="badge bg-card">3</span> Rolling Back a Migration
                </h4>
                <p>To revert your database to a previous migration:</p>

                <pre class="bg-light p-3 rounded border">
                dotnet ef database update &lt;PreviousMigrationName&gt;
                </pre>

                <p>To remove the last (unapplied) migration:</p>
                <pre class="bg-light pt-2 pb-0 rounded border ">
                dotnet ef migrations remove
                </pre>

                <h4 class="mb-3">
                    <span class="badge bg-card">4</span> Migration History Table
                </h4>
                <p>
                    EF Core creates a table called <code>__EFMigrationsHistory</code>
                    that stores information about previously applied migrations.
                </p>

                <h4 class="mb-3">
                    <span class="badge bg-card">5</span> Best Practices
                </h4>

                <ul class="list-group mb-4">
                    <li class="list-group-item">Use descriptive migration names (e.g., <em>AddUserTable</em>).</li>
                    <li class="list-group-item">Create migrations frequently while developing.</li>
                    <li class="list-group-item">Review generated migration code before applying.</li>
                    <li class="list-group-item">Backup the database before running migrations in production.</li>
                    <li class="list-group-item">Keep your DbContext and model classes clean and consistent.</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
const doc = `
   


`;
</script>
<style scoped lang="scss">
@use "../../assets/custom.scss" as *;

.bg-card {
    background-color: $green-700;
}
</style>