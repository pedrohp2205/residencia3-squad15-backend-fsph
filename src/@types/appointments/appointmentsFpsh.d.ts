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
