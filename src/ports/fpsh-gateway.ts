export interface PermissionsParams {
  perm_individual: string;
  perm_medula: string;
  perm_campanha: string;
}

export type AppointmentType = "D" | "M";

export type Gender = "M" | "F" | "O";

export interface MakeAppointmentBody {
  donorName: string;
  donorBirthDate: string;
  donorEmail: string;
  donorCpf: string;
  donorPhone: string;
  donorGender: Gender;
  type: AppointmentType;
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

export interface EditAppointmentBody {
  donorBirthDate?: string;
  donorCpf: string;
  type?: AppointmentType;
  donationBlockId?: string;
  protocol: string;
}

export interface CancelAppointmentParams {
  protocol: string;
}

export interface FpshGateway {
  getUserProfile(cpf: string): Promise<unknown>;
  getUserAppointments(cpf: string): Promise<unknown>;
  getAvailableCities(params: PermissionsParams): Promise<unknown>;
  getAvailableLocations(
    params: { id_cidade: string } & PermissionsParams
  ): Promise<unknown>;
  getAllBlocks(
    params: { id_local: string } & PermissionsParams
  ): Promise<unknown>;
  getBlocksByDate(
    params: { dateSelected: string; id_local: string } & PermissionsParams
  ): Promise<unknown>;
  makeAnAppointment(body: MakeAppointmentBody): Promise<unknown>;
  makeCampaignAppointment(body: MakeCampaignAppointmentBody): Promise<unknown>;
  editAppointment(body: EditAppointmentBody): Promise<unknown>;
  cancelAppointment(params: CancelAppointmentParams): Promise<unknown>;
}
