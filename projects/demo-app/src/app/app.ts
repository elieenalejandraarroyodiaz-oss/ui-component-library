import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from 'ui-lib';

@Component({
  selector: 'app-root',
  imports: [Button],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly clics = signal(0);

  protected sumar(): void {
    this.clics.update((n) => n + 1);
  }
}