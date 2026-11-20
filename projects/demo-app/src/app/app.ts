import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Card, Select, SelectOption, Table, TableAction, TableColumn } from 'ui-lib';
import { ApiRecord, ResourceType } from './models/rick-morty.models';
import { RickMortyState } from './services/rick-morty-state';

@Component({
  selector: 'app-root',
  imports: [Card, Select, Table],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly state = inject(RickMortyState);

  protected readonly resourceOptions: SelectOption[] = [
    { label: 'Characters', value: 'character' },
    { label: 'Episodes', value: 'episode' },
    { label: 'Locations', value: 'location' },
  ];

  protected readonly statusOptions: SelectOption[] = [
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Unknown', value: 'unknown' },
  ];

  /** Columnas distintas según el recurso activo. */
  protected readonly columns = computed<TableColumn[]>(() => {
    switch (this.state.resource()) {
      case 'episode':
        return [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Nombre' },
          { key: 'air_date', header: 'Fecha' },
          { key: 'episode', header: 'Código' },
        ];
      case 'location':
        return [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Nombre' },
          { key: 'type', header: 'Tipo' },
          { key: 'dimension', header: 'Dimensión' },
        ];
      default:
        return [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Nombre' },
          { key: 'status', header: 'Estado' },
          { key: 'species', header: 'Especie' },
        ];
    }
  });

  /** Solo los personajes se pueden filtrar por status en la API. */
  protected readonly filterDisabled = computed(() => this.state.resource() !== 'character');

  /** Registro abierto en el modal, o null si está cerrado. */
  protected readonly selected = signal<ApiRecord | null>(null);

  /** Registro seleccionado, estrechado a cada tipo (null si no corresponde). */
  protected readonly character = computed(() => {
    const r = this.selected();
    return r !== null && 'species' in r ? r : null;
  });
  protected readonly episode = computed(() => {
    const r = this.selected();
    return r !== null && 'air_date' in r ? r : null;
  });
  protected readonly location = computed(() => {
    const r = this.selected();
    return r !== null && 'dimension' in r ? r : null;
  });

  /** Temporal: para comprobar la acción de eliminar. */
  protected readonly lastAction = signal('(nada todavía)');

  constructor() {
    this.state.load();
  }

  protected onResourceChange(option: SelectOption): void {
    this.state.setResource(option.value as ResourceType);
  }

  protected onStatusChange(option: SelectOption): void {
    this.state.setStatus(option.value);
  }

  protected onTableAction(event: TableAction<ApiRecord>): void {
    if (event.action === 'view') {
      this.selected.set(event.row);
    } else {
      this.lastAction.set(`delete → ${event.row.name}`);
    }
  }

  protected closeModal(): void {
    this.selected.set(null);
  }
}