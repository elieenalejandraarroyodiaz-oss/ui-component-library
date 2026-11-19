import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Table, TableAction, TableColumn } from 'ui-lib';

interface Persona {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-root',
  imports: [Table],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly columnas: TableColumn[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre' },
    { key: 'status', header: 'Estado' },
  ];
  protected readonly filas = signal<Persona[]>([
    { id: 1, name: 'Rick Sanchez', status: 'Alive' },
    { id: 2, name: 'Morty Smith', status: 'Alive' },
  ]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly ultima = signal('(nada todavía)');

  protected alAccionar(a: TableAction<Persona>): void {
    this.ultima.set(`${a.action} → ${a.row.name}`);
  }

  protected alternarCarga(): void {
    this.cargando.update((v) => !v);
  }

  protected alternarError(): void {
    this.error.update((e) => (e ? null : 'No se pudo conectar con la API'));
  }

  protected vaciar(): void {
    this.filas.set([]);
  }
}