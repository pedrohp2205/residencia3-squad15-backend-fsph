export interface GetAvailableCitiesApiResponse {
  status: number;
  data: City[];
  msg: string | null;
  token: string | null;
}

export interface City {
  id: number;
  nome: string;
  estado: string;
}


export interface DonationPlace {
  id: number
  local: string
  id_cidade: number
  endereco: string
}

export interface GetAvailableDonationPlacesResponse {
  places: DonationPlace[]
}

export interface TimeBlock {
  id: number
  id_local: number
  min_hora: string        // hora inicial (HH:mm:ss)
  max_hora: string        // hora final (HH:mm:ss)
  data: string            // ISO string ex: "2025-10-20T00:00:00.000Z"
  qt_maxima: number       // quantidade máxima
  perm_medula: number     // 0 ou 1
  perm_campanha: number   // 0 ou 1
  perm_individual: number // 0 ou 1
  vagas_restantes: number
  local: string
  cidade: string
  estado: string
  endereco: string
}

export interface GetBlocksByDateResponse {
  timeBlocks: TimeBlock[]
}


export interface TimeBlockDate {
  data: string 
}

export interface GetAllBlocksResponse {
  timeBlocks: TimeBlockDate[]
}
