import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Select, SelectOption } from 'ui-lib';

@Component({
  selector: 'app-root',
  imports: [Select],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly opciones: SelectOption[] = [
    { label: 'Characters', value: 'character' },
    { label: 'Episodes', value: 'episode' },
    { label: 'Locations', value: 'location' },
  ];
  protected readonly recurso = signal<string | null>('character');
  protected readonly ultimo = signal<string>('(nada todavía)');

  protected alCambiar(opt: SelectOption): void {
    this.ultimo.set(opt.label);
  }
}