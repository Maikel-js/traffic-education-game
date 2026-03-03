# Juego de Educación Vial

Un juego educativo interactivo de educación vial desarrollado con SvelteKit 5, donde los jugadores conducen un autobús escolar y responden preguntas de trivia sobre educación vial.

## Características

- Más de 50 preguntas de educación vial específicas para República Dominicana
- Sistema de vidas con detección de colisiones
- Vista superior (top-down) del autobús escolar
- Otros vehículos circulando por la carretera
- Controles táctiles para dispositivos móviles
- Música de fondo y efectos de sonido de colisión
- Sistema de pausa y reinicio
- Diseño responsivo con Tailwind CSS

## Requisitos previos

- Node.js 18.x o superior
- npm, pnpm o yarn

## Instalación

1. Clona o descarga este proyecto

2. Instala las dependencias:

\`\`\`bash
npm install
\`\`\`

O si usas pnpm:

\`\`\`bash
pnpm install
\`\`\`

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

El juego estará disponible en: **http://localhost:5173**

Para abrir automáticamente en el navegador:

\`\`\`bash
npm run dev -- --open
\`\`\`

## Compilación para producción

Para crear una versión optimizada de producción:

\`\`\`bash
npm run build
\`\`\`

Para previsualizar la versión de producción:

\`\`\`bash
npm run preview
\`\`\`

## Cómo jugar

1. Haz clic en "Iniciar Juego" en la pantalla de inicio
2. Usa las **flechas izquierda/derecha** del teclado para mover el autobús entre los carriles
3. En dispositivos móviles, usa los **botones táctiles** en pantalla
4. Evita chocar con otros vehículos para no perder vidas
5. Responde correctamente las preguntas de trivia que aparecen periódicamente
6. El juego termina cuando pierdes todas las vidas

## Controles

- **Teclado**: Flechas izquierda/derecha para cambiar de carril
- **Móvil**: Botones táctiles izquierda/derecha
- **Pausa**: Presiona ESC o el botón de pausa en pantalla

## Estructura del proyecto

\`\`\`
src/
├── routes/
│   └── +page.svelte         # Página principal del juego
├── lib/
│   ├── components/          # Componentes Svelte
│   │   ├── game-canvas.svelte
│   │   ├── game-hud.svelte
│   │   ├── trivia-modal.svelte
│   │   └── ...
│   ├── stores/
│   │   └── game-state.ts    # Estado global del juego
│   ├── utils/
│   │   ├── game-renderer.ts # Renderizado del canvas
│   │   ├── spawn-manager.ts # Generación de vehículos
│   │   ├── input-handler.ts # Manejo de controles
│   │   └── sound-manager.ts # Efectos de sonido
│   └── data/
│       └── trivia-questions.ts # 50+ preguntas de trivia
└── app.css                  # Estilos globales con Tailwind
\`\`\`

## Tecnologías utilizadas

- **SvelteKit 5** - Framework con runes reactivos
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utilitarios
- **Canvas API** - Renderizado del juego
- **Web Audio API** - Música y efectos de sonido
- **Vite** - Herramienta de construcción

## Despliegue

Para desplegar tu aplicación, puedes necesitar instalar un adaptador para tu entorno objetivo. Consulta la [documentación de adaptadores de SvelteKit](https://svelte.dev/docs/kit/adapters).

## Licencia

Proyecto educativo desarrollado para enseñanza de educación vial en República Dominicana.
