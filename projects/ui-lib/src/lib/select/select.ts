import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

/** Opción individual del select. */
export interface SelectOption {
  /** Texto visible. */
  label: string;
  /** Valor interno. */
  value: string;
}

/**
 * Select reutilizable con two-way binding.
 *
 * @example
 * <ui-select label="Recurso" [options]="opciones" [(value)]="recurso" />
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  /** Lista de opciones { label, value }. */
  readonly options = input<SelectOption[]>([]);

  /** Etiqueta visible sobre el select. */
  readonly label = input<string>('');

  /** Texto cuando no hay selección. */
  readonly placeholder = input<string>('Selecciona una opción');

  /** Estado de carga (muestra un skeleton). */
  readonly loading = input<boolean>(false);

  /** Bloquea la interacción. */
  readonly disabled = input<boolean>(false);

  /** Valor seleccionado (two-way binding). */
  readonly value = model<string | null>(null);

  /** Emite el objeto completo de la opción elegida. */
  readonly selectionChange = output<SelectOption>();

  /** Maneja el cambio en el select nativo. */
  protected onChange(event: Event): void {
    const newValue = (event.target as HTMLSelectElement).value;
    const option = this.options().find((o) => o.value === newValue);
    if (option) {
      this.value.set(option.value);
      this.selectionChange.emit(option);
    }
  }
}