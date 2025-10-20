import {
  FpshGateway,
  PermissionsParams,
  MakeAppointmentBody,
  MakeCampaignAppointmentBody,
  EditAppointmentBody,
  CancelAppointmentParams,
  AppointmentType,
  GetAvailableLocationsParams,
  GetAllBlocksParams,
  GetBlocksByDateParams,
} from "@/ports/fpsh-gateway";
import { fpshApi } from "@/infra/axios-fsph";
import { DonationPlace, GetAllBlocksResponse, GetAvailableCitiesApiResponse, GetBlocksByDateResponse } from "@/types/externalAPIs/fpsh";

export class AxiosFpshGateway implements FpshGateway {
  private normalizePermissions(p: AppointmentType): PermissionsParams {
    if (p === "D") {
      return { perm_individual: "1", perm_medula: "0", perm_campanha: "0" };
    }
    if (p === "M") {
      return { perm_individual: "0", perm_medula: "1", perm_campanha: "0" };
    }
    if (p === "C") {
      return { perm_individual: "0", perm_medula: "0", perm_campanha: "1" };
    }
    return { perm_individual: "0", perm_medula: "0", perm_campanha: "0" };
  }

  private permTuple(p: AppointmentType): [string, string, string] {
    const n = this.normalizePermissions(p);
    return [n.perm_individual, n.perm_medula, n.perm_campanha];
  }

  async getDonorProfile(cpf: string): Promise<unknown> {

    try {

    const { data } = await fpshApi.get(`/apiagendamento/doador/getinfo/${cpf}`);

    return data;
    }catch (error) {
      return []
    }
  }

  async getDonorAppointments(cpf: string): Promise<unknown> {

    try {
      const response = await fpshApi.get(
        `/apiagendamento/doador/agendamentos/${cpf}`
      );

      return response

    } catch (error) {
      return []
    }

  }

  async getAvailableCities(
    params: AppointmentType
  ): Promise<GetAvailableCitiesApiResponse> {
    const [pi, pm, pc] = this.permTuple(params);
    const { data } = await fpshApi.get(
      `/apiagendamento/cidades/${pi}/${pm}/${pc}`
    );
    return data;
  }

  async getAvailableLocations(
    params: GetAvailableLocationsParams
  ): Promise<DonationPlace[]> {
    const [pi, pm, pc] = this.permTuple(params.tipo_atendimento);
    const { id_cidade } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/local/${id_cidade}/${pi}/${pm}/${pc}`
    );
    return data.data;
  }

  async getAllBlocks(
    params: GetAllBlocksParams
  ): Promise<GetAllBlocksResponse> {
    const [pi, pm, pc] = this.permTuple(params.tipo_atendimento);
    const { id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarAllDate/${id_local}/${pi}/${pm}/${pc}`
    );
    return data.data;
  }

  async getBlocksByDate(
    params: GetBlocksByDateParams
  ): Promise<GetBlocksByDateResponse> {
    const [pi, pm, pc] = this.permTuple(params.tipo_atendimento);
    const { dateSelected, id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarByDate/${dateSelected}/${id_local}/${pi}/${pm}/${pc}`
    );
    return data.data;
  }

  async makeAnAppointment(body: MakeAppointmentBody): Promise<unknown> {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const { data } = await fpshApi.post(
      "/apiagendamento/agendamento/marcar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  }

  async makeCampaignAppointment(
    body: MakeCampaignAppointmentBody
  ): Promise<unknown> {
    const { data } = await fpshApi.post(
      "/apiagendamento/campanha/marcar",
      body
    );
    return data;
  }

  async editAppointment(body: EditAppointmentBody): Promise<unknown> {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const { data } = await fpshApi.patch(
      "/apiagendamento/agendamento/editar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  }

  async cancelAppointment(params: CancelAppointmentParams): Promise<unknown> {
    const { protocol } = params;
    const { data } = await fpshApi.delete(
      `/apiagendamento/agendamento/desmarcar/${protocol}`
    );
    return data;
  }
}
