/** Estados posibles de un personaje. */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/** Recursos que se pueden consultar en la API. */
export type ResourceType = 'character' | 'episode' | 'location';

/** Referencia a otro recurso (origen, ubicación). */
export interface NamedResource {
  name: string;
  url: string;
}

/** Personaje de Rick and Morty. */
export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: string;
  origin: NamedResource;
  location: NamedResource;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** Episodio de la serie. */
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

/** Ubicación de la serie. */
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

/** Cualquier registro que puede mostrar la tabla. */
export type ApiRecord = Character | Episode | Location;

/** Información de paginación de la API. */
export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Respuesta genérica de la API para cualquier recurso. */
export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}