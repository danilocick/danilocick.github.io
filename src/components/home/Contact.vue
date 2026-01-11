<template>
    <section id="contacto" class="py-5">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-5">Contacto</h2>
            <div class="row">
                <div class="col-lg-6 mx-auto">
                    <div class="card border-0 shadow">
                        <div class="card-body p-5">
                            <form>
                                <div class="mb-3">
                                    <label for="nombre" class="form-label">Nombre</label>
                                    <BFormInput type="text" class="form-control" id="nombre" placeholder="Tu nombre"
                                        disabled />
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <BFormInput type="email" class="form-control" id="email" placeholder="tu@email.com"
                                        disabled />
                                </div>
                                <div class="mb-3">
                                    <label for="mensaje" class="form-label">Mensaje</label>
                                    <BFormTextarea class="form-control" id="mensaje" rows="5"
                                        placeholder="¿En qué puedo ayudarte?" disabled />
                                </div>
                                <BButton class="btn btn-primary w-100" disabled>
                                    <i class="bi bi-send me-2"></i>Enviar Mensaje
                                </BButton>
                            </form>

                            <hr class="my-4">

                            <div class="text-center">
                                <h5 class="mb-3">Encuéntrame también en:</h5>
                                <div class="d-flex gap-3 justify-content-center">
                                    <a href="https://github.com/danilocick" class="btn btn-outline-dark btn-lg">
                                        <i class="bi bi-github"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/in/danilocick"
                                        class="btn btn-outline-primary btn-lg">
                                        <i class="bi bi-linkedin"></i>
                                    </a>
                                    <a href="mailto:danidevhdez@gmail.com" class="btn btn-outline-danger btn-lg">
                                        <i class="bi bi-envelope"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>