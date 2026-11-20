# Bitácora de desarrollo

Proyecto: UI Component Library (Angular + TypeScript + Tailwind v3) y demo con la Rick and Morty API.

## Resumen del proceso

1. Configuración del entorno (Node, Git, Angular CLI, GitHub) y creación del workspace con `ui-lib` y `demo-app`.
2. Instalación y prueba de Tailwind CSS v3.
3. Construcción de los cuatro componentes de la librería, uno por uno, probando cada uno en la demo antes de hacer su commit: Button, Card, Select y Table.
4. Modelos (`Character`, `Episode`, `Location`) y servicio con signals (`RickMortyState`).
5. Demo final: selects, tabla con datos reales, modal con `ui-card` y confirmación al eliminar.
6. Tema visual inspirado en Rick & Morty, README y esta bitácora.

## Decisiones tomadas

- **Estado en un servicio con signals.** Las señales son privadas y se exponen con `asReadonly()`, así solo el servicio puede cambiarlas.
- **Cancelar la petición anterior** (`unsubscribe`) al cambiar de recurso o filtro, para que una respuesta vieja no sobrescriba a la nueva.
- **Error 404 tratado como lista vacía.** La API responde 404 cuando un filtro no encuentra resultados; eso es un estado vacío, no un error de red.
- **Filtro por status solo en Characters.** La API solo lo admite en ese recurso, por eso el select de filtro se deshabilita en Episodes y Locations y se reinicia al cambiar de recurso.
- **Tabla genérica** (`Table<T extends object>`): lee las celdas con `Record<string, unknown>` para no usar `any`, y no conoce el dominio. Solo emite `{ action, row }`.
- **El padre interpreta las acciones:** la tabla emite `view` y `delete`; la demo abre el modal o pide confirmación.
- **Eliminar solo en el estado local** (la eliminación real era opcional), con confirmación previa.
- **Datos en inglés, interfaz en español.** Los valores de la API se muestran tal cual; los textos de la interfaz son propios.
- **Inspiración visual:** referencias de paleta y ambiente en Pinterest (verde portal, fondo oscuro, brillo). No se usaron imágenes ni assets con derechos de la serie.

## Uso de herramientas de IA

Usé Claude como guía paso a paso durante todo el proyecto. Lo que sigue resume el uso, qué acepté y qué cambié o rechacé.

### 1. Planeación y configuración
- **Prompt:** pegué el enunciado de la prueba y pedí que me guiara paso a paso, explicando cada cosa como si no supiera nada.
- **Aceptado:** el orden de trabajo (workspace, Tailwind, componentes, servicio, demo) y los comandos de instalación. Sirve porque permite probar cada pieza antes de seguir.
- **Modificado:** en la creación del workspace Angular preguntó cosas que no estaban en la guía (analítica, herramientas de IA, SSR). Las respondí que no, por no ser necesarias.

### 2. Componentes de la librería (Button, Card, Select, Table)
- **Prompt:** pedí cada componente con la API exacta del enunciado (inputs, outputs y `model()`), standalone y OnPush.
- **Aceptado:** `input()`, `output()`, `model()`, `computed()` para las clases de Tailwind, y `Record<Variant, string>` para tipar los estilos sin `any`.
- **Modificado:** al probar vi que "Ver detalle" y "Eliminar" parecían no funcionar. Después de revisar el flujo completo (tabla, evento, padre, texto de resultado) entendí que solo cambiaban un texto de prueba y que había que reconstruir la librería con `ng build ui-lib` para que la demo viera los cambios.

### 3. Modelos y servicio con signals
- **Prompt:** pedí un servicio que guardara en signals el recurso, el filtro, los registros, el loading y el error, sin llamadas HTTP en los componentes.
- **Aceptado:** `asReadonly()`, cancelación de peticiones y tratamiento del 404 como lista vacía.
- **Revisado:** entendí por qué el filtro solo aplica a `character` (limitación de la API) y lo reflejé en la interfaz.

### 4. Demo final (selects, tabla, modal, confirmación)
- **Prompt:** pedí conectar los selects al servicio, columnas distintas por recurso, modal con `ui-card` y aviso antes de eliminar.
- **Aceptado:** `computed` con `'species' in r` para reconocer cada tipo de registro sin `any`, y proyección de contenido con `ng-content` por recurso.

### 5. Diseño visual
- **Prompt:** busqué ideas en Pinterest y pedí convertir las referencias en una paleta y clases de Tailwind, además de una maqueta visual.
- **Aceptado:** paleta verde portal sobre negro verdoso, glow, fuente *Bangers* para el título.
- **Rechazado:** del diseño de referencia más grande (menú lateral, banner con imágenes de la serie, paginación, botón de editar) dejé fuera todo lo que no pedía la prueba, por tiempo y por los derechos de las imágenes.

## Retos y soluciones

| Reto | Solución |
|---|---|
| Se respondió un comando en una pregunta de Angular que solo aceptaba Yes/No | Responder `N` y continuar |
| Dos comandos pegados en una sola línea (`git commit ... git log`) | Escribirlos uno por uno |
| Puerto 4200/4300 ocupado por un servidor viejo | Cerrar el servidor anterior o usar `--port` con otro número |
| Avisos amarillos `Unknown at rule @tailwind` en VS Code | Son solo advertencias del editor, no errores; la app compila bien |
| La demo no veía los cambios de la librería | Ejecutar `ng build ui-lib` antes de `ng serve` |
| Errores `Cannot find module` y `unknown` en `app.ts` | El servicio no se había creado en la ruta correcta; se creó `services/rick-morty-state.ts` |
| 394 errores en `app.ts` | Se había pegado HTML dentro del archivo TypeScript; se reemplazó solo con TypeScript |
| `app.ts` con código duplicado | Se borró todo el contenido y se pegó una sola vez |
| Chrome traducía la página y cambiaba los nombres | `lang="es"` en `index.html` |
| Commits mezclados (botón y card) | Desde ahí, un commit por componente |

## Cómo ejecutar

Ver el `README.md`.