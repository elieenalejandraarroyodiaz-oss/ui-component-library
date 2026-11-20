# UI Component Library — Angular + Tailwind

Librería de componentes Angular (`ui-lib`) y una aplicación demo (`demo-app`) que la consume para explorar la **Rick and Morty API**.

## Arquitectura

```
my-workspace/
├── projects/
│   ├── ui-lib/        → Librería: ui-button, ui-card, ui-select, ui-table
│   └── demo-app/      → App que consume la librería
│       └── src/app/
│           ├── models/     → Interfaces Character, Episode, Location
│           └── services/   → RickMortyState (estado con signals + HTTP)
├── angular.json
└── package.json
```

- **Componentes standalone** con `ChangeDetectionStrategy.OnPush` y prefijo `ui-`.
- **Signals API**: `input()`, `output()` y `model()` (sin `@Input` / `@Output`).
- **Public API**: todo se exporta desde `projects/ui-lib/src/public-api.ts`. La demo importa desde `'ui-lib'`.
- **Estado centralizado**: `RickMortyState` guarda recurso, filtro, registros, loading y error en signals. Los componentes no hacen llamadas HTTP.
- **TypeScript estricto**, sin `any`.
- **Estilos**: Tailwind CSS v3.

## Instalación y ejecución

```bash
npm install
ng build ui-lib
ng serve demo-app
```

Abrir `http://localhost:4200`. La demo lee la librería compilada desde `dist/`, por eso se ejecuta `ng build ui-lib` antes (y cada vez que cambie la librería).

## API de los componentes

### `<ui-button>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| input | `label` | `string` | Texto visible |
| input | `variant` | `'primary' \| 'secondary' \| 'danger'` | Estilo visual |
| input | `size` | `'sm' \| 'md' \| 'lg'` | Tamaño |
| input | `disabled` | `boolean` | Bloquea la interacción |
| input | `loading` | `boolean` | Muestra spinner y bloquea el clic |
| output | `clicked` | `void` | Se emite solo si no está disabled ni loading |

```html
<ui-button label="Guardar" variant="primary" size="md" (clicked)="guardar()" />
<ui-button label="Enviando" [loading]="true" />
```

### `<ui-card>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| input | `title` | `string` | Título del header |
| input | `subtitle` | `string \| null` | Subtítulo opcional |
| input | `elevation` | `'flat' \| 'raised' \| 'outlined'` | Estilo del contenedor |
| output | `headerClicked` | `void` | Clic en el header |
| slot | `ng-content` | — | Contenido del body |

```html
<ui-card title="Rick Sanchez" subtitle="Alive" elevation="outlined" (headerClicked)="abrir()">
  <p>Contenido arbitrario</p>
</ui-card>
```

### `<ui-select>`

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| input | `options` | `SelectOption[]` | Lista `{ label, value }` |
| input | `label` | `string` | Etiqueta sobre el select |
| input | `placeholder` | `string` | Texto sin selección |
| input | `loading` | `boolean` | Muestra skeleton |
| input | `disabled` | `boolean` | Bloquea la interacción |
| model | `value` | `string \| null` | Two-way binding del valor |
| output | `selectionChange` | `SelectOption` | Emite el objeto completo |

```ts
interface SelectOption { label: string; value: string; }
```

```html
<ui-select label="Recurso" [options]="opciones" [(value)]="recurso" (selectionChange)="alCambiar($event)" />
```

### `<ui-table>` (genérico)

| Tipo | Nombre | Tipo TS | Descripción |
|---|---|---|---|
| input | `columns` | `TableColumn[]` | Columnas `{ key, header }` |
| input | `rows` | `T[]` | Datos a renderizar |
| input | `loading` | `boolean` | Muestra filas skeleton |
| input | `emptyMessage` | `string` | Mensaje cuando no hay filas |
| input | `errorMessage` | `string \| null` | Error de red visible en la tabla |
| output | `actionTriggered` | `TableAction<T>` | `{ action: 'view' \| 'delete', row: T }` |

```html
<ui-table
  [columns]="columnas"
  [rows]="filas()"
  [loading]="cargando()"
  [errorMessage]="error()"
  emptyMessage="Sin resultados"
  (actionTriggered)="onAction($event)"
/>
```

La tabla no conoce el dominio: solo renderiza y emite. El componente padre interpreta cada acción.

## Decisiones de diseño

- **Estado en un servicio con signals** (`RickMortyState`): señales privadas expuestas con `asReadonly()`, para que solo el servicio pueda modificar el estado.
- **Cancelación de peticiones**: al cambiar de recurso o filtro se cancela la petición anterior, para que una respuesta vieja no pise a la nueva.
- **Error 404 de la API = lista vacía**: la API responde 404 cuando un filtro no encuentra resultados; se muestra el estado vacío y no un error de red.
- **Filtro por status solo en Characters**: la API solo lo admite en ese recurso, por lo que el select de filtro se deshabilita en Episodes y Locations, y se reinicia al cambiar de recurso.
- **Tabla genérica** (`Table<T extends object>`) y lectura de celdas con `Record<string, unknown>`, sin `any`.
- **Modal con `ui-card`**: el contenido se proyecta con `ng-content` según el tipo de recurso.
- **Eliminar con confirmación**: la tabla emite `{ action: 'delete', row }`; la demo pide confirmación y quita el registro solo del estado local.
- **Tema visual**: paleta verde portal sobre fondo negro verdoso, tipografías *Bangers* (títulos) e *Inter* (texto), inspirado en la serie sin usar assets con derechos.

## Documentación de código

Todos los inputs, outputs y métodos públicos están documentados con JSDoc. El proceso de desarrollo, el uso de IA y los retos están en `DEVELOPMENT_LOG.md`.