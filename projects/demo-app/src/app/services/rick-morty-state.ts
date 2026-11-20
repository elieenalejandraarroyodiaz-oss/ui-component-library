import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiRecord, ApiResponse, ResourceType } from '../models/rick-morty.models';

/**
 * Estado del Explorer de recursos.
 * Guarda el estado en signals y es el único que llama a la API.
 */
@Injectable({ providedIn: 'root' })
export class RickMortyState {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api';
  private request: Subscription | null = null;

  private readonly _resource = signal<ResourceType>('character');
  private readonly _status = signal<string | null>(null);
  private readonly _records = signal<ApiRecord[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  /** Recurso activo (character, episode o location). */
  readonly resource = this._resource.asReadonly();

  /** Filtro de status activo (alive, dead, unknown) o null. */
  readonly status = this._status.asReadonly();

  /** Registros del recurso activo. */
  readonly records = this._records.asReadonly();

  /** true mientras hay una petición en curso. */
  readonly loading = this._loading.asReadonly();

  /** Mensaje de error de red, o null. */
  readonly error = this._error.asReadonly();

  /** Cambia el recurso, reinicia el filtro y vuelve a consultar. */
  setResource(resource: ResourceType): void {
    this._resource.set(resource);
    this._status.set(null);
    this.load();
  }

  /** Cambia el filtro de status y vuelve a consultar. */
  setStatus(status: string): void {
    this._status.set(status);
    this.load();
  }

  /** Consulta la API según el recurso y el filtro actuales. */
  load(): void {
    this.request?.unsubscribe();
    this._loading.set(true);
    this._error.set(null);

    let url = `${this.baseUrl}/${this._resource()}`;
    const status = this._status();
    if (this._resource() === 'character' && status) {
      url += `?status=${status}`;
    }

    this.request = this.http.get<ApiResponse<ApiRecord>>(url).subscribe({
      next: (response) => {
        this._records.set(response.results);
        this._loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this._records.set([]);
        // La API responde 404 cuando el filtro no encuentra nada: no es un fallo de red.
        if (err.status !== 404) {
          this._error.set('No se pudo conectar con la API. Intenta de nuevo.');
        }
        this._loading.set(false);
      },
    });
  }
}