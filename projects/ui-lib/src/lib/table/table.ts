import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Definición de una columna de la tabla. */
export interface TableColumn {
  /** Nombre de la propiedad del registro que se muestra. */
  key: string;
  /** Texto del encabezado. */
  header: string;
}

/** Acciones que la tabla puede emitir. */
export type TableActionType = 'view' | 'delete';

/** Acción emitida por la tabla junto con el registro afectado. */
export interface TableAction<T> {
  action: TableActionType;
  row: T;
}

/**
 * Tabla genérica: renderiza columnas y filas, y emite acciones.
 * No conoce el dominio de los datos.
 *
 * @example
 * <ui-table [columns]="columnas" [rows]="filas" (actionTriggered)="onAction($event)" />
 */
@Component({
  selector: 'ui-table',
  standalone: true,
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends object> {
  /** Definición de columnas { key, header }. */
  readonly columns = input<TableColumn[]>([]);

  /** Datos a renderizar. */
  readonly rows = input<T[]>([]);

  /** Muestra filas skeleton en lugar de datos. */
  readonly loading = input<boolean>(false);

  /** Mensaje cuando rows está vacío. */
  readonly emptyMessage = input<string>('No hay resultados');

  /** Mensaje de error de red visible en la tabla. */
  readonly errorMessage = input<string | null>(null);

  /** Emite { action, row } al pulsar Ver o Eliminar. */
  readonly actionTriggered = output<TableAction<T>>();

  /** Filas falsas para el skeleton. */
  protected readonly skeletonRows: number[] = [1, 2, 3, 4, 5];

  /** Obtiene el valor de una celda como texto. */
  protected cellValue(row: T, key: string): string {
    const value = (row as Record<string, unknown>)[key];
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  /** Emite la acción solicitada. */
  protected trigger(action: TableActionType, row: T): void {
    this.actionTriggered.emit({ action, row });
  }
}