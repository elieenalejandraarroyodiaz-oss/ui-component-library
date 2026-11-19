import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Estilos visuales disponibles para el contenedor de la card. */
export type CardElevation = 'flat' | 'raised' | 'outlined';

/**
 * Tarjeta reutilizable con header (título y subtítulo) y body proyectado.
 *
 * @example
 * <ui-card title="Rick Sanchez" subtitle="Alive" (headerClicked)="abrir()">
 *   <p>Contenido arbitrario</p>
 * </ui-card>
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  /** Título del header de la card. */
  readonly title = input<string>('');

  /** Subtítulo opcional bajo el título. */
  readonly subtitle = input<string | null>(null);

  /** Estilo visual del contenedor. */
  readonly elevation = input<CardElevation>('raised');

  /** Se emite al hacer clic en el header. */
  readonly headerClicked = output<void>();

  /** Clases de Tailwind según la elevación. */
  protected readonly classes = computed(() => {
    const base = 'overflow-hidden rounded-xl bg-green-950 text-slate-100';

    const elevations: Record<CardElevation, string> = {
      flat: 'border border-transparent',
      raised: 'border border-green-800 shadow-lg shadow-black/40',
      outlined: 'border-2 border-lime-400',
    };

    return `${base} ${elevations[this.elevation()]}`;
  });

  /** Maneja el clic en el header. */
  protected onHeaderClick(): void {
    this.headerClicked.emit();
  }
}