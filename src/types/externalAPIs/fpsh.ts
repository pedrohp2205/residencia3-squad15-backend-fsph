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
