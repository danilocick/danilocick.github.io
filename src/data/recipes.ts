// ============================================================
//  RECETARIO — tus recetas
// ============================================================
// Para añadir una receta, copia un bloque { ... } y rellénalo.
//
//  · id         → identificador único (sin espacios), ej: 'lentejas'
//  · name       → nombre de la receta
//  · description→ (opcional) frase corta
//  · image      → (opcional) foto. Si la omites, se usa la foto por defecto.
//                 Pon la imagen en la carpeta  public/recipes/  y referénciala
//                 como  '/recipes/mi-foto.jpg'  (también vale una URL https://…)
//  · time       → (opcional) tiempo, ej: '30 min'
//  · servings   → (opcional) nº de raciones
//  · ingredients→ lista de ingredientes
//  · steps      → lista de pasos (en orden)
// ============================================================

export interface Recipe {
    id: string
    name: string
    description?: string
    image?: string
    time?: string
    servings?: number
    ingredients: string[]
    steps: string[]
}

export const recipes: Recipe[] = [
    {
        id: 'tortilla-patatas',
        name: 'Tortilla de patatas',
        description: 'El clásico español, jugosa por dentro.',
        // image: '/recipes/tortilla.jpg',
        time: '40 min',
        servings: 4,
        ingredients: [
            '5 patatas medianas',
            '6 huevos',
            '1 cebolla (opcional)',
            'Aceite de oliva virgen extra',
            'Sal',
        ],
        steps: [
            'Pela y corta las patatas en láminas finas. Sala.',
            'Fríelas a fuego medio en abundante aceite hasta que estén tiernas.',
            'Bate los huevos en un bol grande y añade las patatas escurridas.',
            'Cuaja la mezcla en una sartén con un poco de aceite, 3-4 min por cada lado.',
            'Dale la vuelta con ayuda de un plato y sirve templada.',
        ],
    },
    {
        id: 'guacamole',
        name: 'Guacamole',
        description: 'Fresco, rápido y para mojar.',
        // image: '/recipes/guacamole.jpg',
        time: '10 min',
        servings: 2,
        ingredients: [
            '2 aguacates maduros',
            '1/2 cebolla picada',
            '1 tomate picado',
            'Zumo de 1 lima',
            'Cilantro al gusto',
            'Sal y pimienta',
        ],
        steps: [
            'Abre los aguacates y aplasta la pulpa con un tenedor.',
            'Añade la cebolla, el tomate y el cilantro picados.',
            'Riega con el zumo de lima y salpimienta.',
            'Mezcla y sirve al momento con nachos.',
        ],
    },
]
