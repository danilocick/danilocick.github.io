<template>
    <div class="container my-4">
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h1 class="card-title h3 mb-3">ASP.NET Core Web API – CRUD Methods</h1>
                <hr />

                <div v-html="doc"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const doc = `
    <h4 class="mb-3">
        <span class="badge bg-primary">1</span> GET – Retrieve Data
    </h4>

    <p>Use <strong>GET</strong> to fetch data from the server.</p>

    <pre class="bg-light p-3 rounded border">
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
    </pre>

    <hr />

    <h4 class="mb-3">
        <span class="badge bg-success">2</span> POST – Create New Data
    </h4>

    <p><strong>POST</strong> is used to send new data to the API to create an item.</p>

    <pre class="bg-light p-3 rounded border">
[HttpPost]
public IActionResult Create(Product product)
{
    products.Add(product);
    return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
}
    </pre>

    <hr />

    <h4 class="mb-3">
        <span class="badge bg-warning text-dark">3</span> PUT – Update Existing Data
    </h4>

    <p><strong>PUT</strong> replaces an existing resource with a new version.</p>

    <pre class="bg-light p-3 rounded border">
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
    </pre>

    <hr />

    <h4 class="mb-3">
        <span class="badge bg-danger">4</span> DELETE – Remove Data
    </h4>

    <p><strong>DELETE</strong> removes an existing item from the database.</p>

    <pre class="bg-light p-3 rounded border">
[HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var product = products.FirstOrDefault(x => x.Id == id);
    if (product == null)
        return NotFound();

    products.Remove(product);
    return NoContent();
}
    </pre>

    <hr />

    <h4 class="mb-3">
        <span class="badge bg-dark">5</span> Quick Summary of HTTP Methods
    </h4>

    <ul class="list-group">
        <li class="list-group-item"><strong>GET</strong> → Fetch data</li>
        <li class="list-group-item"><strong>POST</strong> → Create a new record</li>
        <li class="list-group-item"><strong>PUT</strong> → Replace an existing record</li>
        <li class="list-group-item"><strong>PATCH</strong> → Partial update</li>
        <li class="list-group-item"><strong>DELETE</strong> → Remove a record</li>
    </ul>
`;
</script>
