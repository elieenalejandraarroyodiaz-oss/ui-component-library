import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RickMortyState } from './services/rick-morty-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly state = inject(RickMortyState);

  constructor() {
    this.state.load();
  }
}