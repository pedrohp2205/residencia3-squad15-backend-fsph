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
import { DonationPlace, GetAvailableCitiesApiResponse, TimeBlock, TimeBlockDate } from "@/types/externalAPIs/fpsh";
import dayjs from "dayjs";

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

  private toYMD(input: string | Date) {
    const d = dayjs(input);
    if (!d.isValid()) throw new Error("Data de nascimento inválida");
    return d.format("YYYY-MM-DD"); // tente assim primeiro
    // Se ainda der 400, troque para: return d.format("DD/MM/YYYY");
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
      const { data } = await fpshApi.get(
        `/apiagendamento/doador/agendamentos/${cpf}`
      );

      return data.data

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
  ): Promise<TimeBlock[]> {
    const [pi, pm, pc] = this.permTuple(params.tipo_atendimento);
    const { id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarAllDate/${id_local}/${pi}/${pm}/${pc}`
    );
    return data.data;
  }

  async getBlocksByDate(
    params: GetBlocksByDateParams
  ): Promise<TimeBlockDate[]> {
    const [pi, pm, pc] = this.permTuple(params.tipo_atendimento);
    const { dateSelected, id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarByDate/${dateSelected}/${id_local}/${pi}/${pm}/${pc}`
    );
    return data.data;
  }

  async makeAnAppointment(body: MakeAppointmentBody): Promise<unknown> {

    const formData = new FormData();
    formData.append("doador_nome", String(body.donorName));
    formData.append("doador_email", String(body.donorEmail));
    formData.append("doador_cpf", String(body.donorCpf));
    formData.append("doador_telefone", String(body.donorPhone));
    formData.append("doador_sexo", String(body.donorGender)); 
    formData.append("tipo", String(body.type));
    formData.append("id_bloco_doacao", String(body.donationBlockId));
    formData.append("doador_dt_nascimento", this.toYMD(body.donorBirthDate));


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
