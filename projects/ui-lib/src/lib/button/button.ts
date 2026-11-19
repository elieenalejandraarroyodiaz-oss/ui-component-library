import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Estilos visuales disponibles para el botón. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** Tamaños disponibles para el botón. */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Botón reutilizable de la librería.
 *
 * @example
 * <ui-button label="Guardar" variant="primary" (clicked)="guardar()" />
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  /** Texto visible del botón. */
  readonly label = input<string>('');

  /** Estilo visual del botón. */
  readonly variant = input<ButtonVariant>('primary');

  /** Tamaño del botón. */
  readonly size = input<ButtonSize>('md');

  /** Bloquea la interacción. */
  readonly disabled = input<boolean>(false);

  /** Muestra un spinner y bloquea el clic. */
  readonly loading = input<boolean>(false);

  /** Se emite al hacer clic, solo si no está disabled ni loading. */
  readonly clicked = output<void>();

  /** true si el botón no debe responder a clics. */
  protected readonly isBlocked = computed(() => this.disabled() || this.loading());

  /** Clases de Tailwind según variant y size. */
  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ' +
      'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-lime-400 text-green-950 hover:bg-lime-300 active:bg-lime-500 focus-visible:ring-lime-300',
      secondary:
        'bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-800 focus-visible:ring-slate-400',
      danger:
        'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-300',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });

  /** Maneja el clic: emite solo si el botón no está bloqueado. */
  protected onClick(): void {
    if (!this.isBlocked()) {
      this.clicked.emit();
    }
  }
}