import { DonationPlace, GetAllBlocksResponse, GetAvailableCitiesApiResponse, GetBlocksByDateResponse } from "@/types/externalAPIs/fpsh";

export interface PermissionsParams {
  perm_individual: string;
  perm_medula: string;
  perm_campanha: string;
}

export type AppointmentType = "D" | "M" | "C"; // D: Doação, M: Medula, C: Campanha

export type Gender = "M" | "F" | "O";

type AppointmentTypeWithoutCampaign = Omit<AppointmentType, "C">;


export interface GetBlocksByDateParams {
  id_local: bigint;
  tipo_atendimento: AppointmentType;
  dateSelected: string;
}

export type GetAllBlocksParams = Omit<GetBlocksByDateParams, "dateSelected">;

export interface MakeAppointmentBody {
  donorName: string;
  donorBirthDate: string;
  donorEmail: string;
  donorCpf: string;
  donorPhone: string;
  donorGender: Gender;
  type: AppointmentTypeWithoutCampaign;
  donationBlockId: string;
  authorizationPath?: string;
}

export interface MakeCampaignAppointmentBody {
  responsibleName: string;
  responsibleBirthDate: string;
  responsibleEmail: string;
  responsibleCpf: string;
  responsiblePhone: string;
  shift: string;
  date: string;
  donorsQuantity: number;
  responsibleGender: Gender;
}



export interface GetAvailableLocationsParams {
  id_cidade: bigint
  tipo_atendimento: AppointmentType
}


export interface EditAppointmentBody {
  donorBirthDate?: string;
  donorCpf: string;
  type?: AppointmentTypeWithoutCampaign;
  donationBlockId?: string;
  protocol: string;
}

export interface CancelAppointmentParams {
  protocol: string;
}

export interface FpshGateway {
  getDonorProfile(cpf: string): Promise<unknown>;
  getDonorAppointments(cpf: string): Promise<unknown>;
  getAvailableCities(
    params: AppointmentType
  ): Promise<GetAvailableCitiesApiResponse>;
  getAvailableLocations(params: GetAvailableLocationsParams): Promise<DonationPlace[]>;
  getAllBlocks(
    params: GetAllBlocksParams
  ): Promise<GetAllBlocksResponse>;
  getBlocksByDate(
    params: GetBlocksByDateParams
  ): Promise<GetBlocksByDateResponse>;
  makeAnAppointment(body: MakeAppointmentBody): Promise<unknown>;
  makeCampaignAppointment(body: MakeCampaignAppointmentBody): Promise<unknown>;
  editAppointment(body: EditAppointmentBody): Promise<unknown>;
  cancelAppointment(params: CancelAppointmentParams): Promise<unknown>;
}
