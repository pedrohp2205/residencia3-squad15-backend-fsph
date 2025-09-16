import {
  FpshGateway,
  PermissionsParams,
  MakeAppointmentBody,
  MakeCampaignAppointmentBody,
  EditAppointmentBody,
  CancelAppointmentParams,
} from "@/ports/fpsh-gateway";
import { fpshApi } from "@/infra/axios-fsph";

export class AxiosFpshGateway implements FpshGateway {
  private normalizePermissions(p: PermissionsParams): PermissionsParams {
    if (p.perm_individual === "1") {
      return { perm_individual: "1", perm_medula: "0", perm_campanha: "0" };
    }
    if (p.perm_medula === "1") {
      return { perm_individual: "0", perm_medula: "1", perm_campanha: "0" };
    }
    if (p.perm_campanha === "1") {
      return { perm_individual: "0", perm_medula: "0", perm_campanha: "1" };
    }
    return { perm_individual: "0", perm_medula: "0", perm_campanha: "0" };
  }

  private permTuple(p: PermissionsParams): [string, string, string] {
    const n = this.normalizePermissions(p);
    return [n.perm_individual, n.perm_medula, n.perm_campanha];
  }

  async getUserProfile(cpf: string): Promise<unknown> {
    const { data } = await fpshApi.get(`/apiagendamento/doador/getinfo/${cpf}`);
    return data;
  }

  async getUserAppointments(cpf: string): Promise<unknown> {
    const { data } = await fpshApi.get(
      `/apiagendamento/agendamento/agendamentos/${cpf}`
    );
    return data;
  }

  async getAvailableCities(params: PermissionsParams): Promise<unknown> {
    const [pi, pm, pc] = this.permTuple(params);
    const { data } = await fpshApi.get(
      `/apiagendamento/cidades/${pi}/${pm}/${pc}`
    );
    return data;
  }

  async getAvailableLocations(
    params: { id_cidade: string } & PermissionsParams
  ): Promise<unknown> {
    const [pi, pm, pc] = this.permTuple(params);
    const { id_cidade } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/local/${id_cidade}/${pi}/${pm}/${pc}`
    );
    return data;
  }

  async getAllBlocks(
    params: { id_local: string } & PermissionsParams
  ): Promise<unknown> {
    const [pi, pm, pc] = this.permTuple(params);
    const { id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarAllDate/${id_local}/${pi}/${pm}/${pc}`
    );
    return data;
  }

  async getBlocksByDate(
    params: { dateSelected: string; id_local: string } & PermissionsParams
  ): Promise<unknown> {
    const [pi, pm, pc] = this.permTuple(params);
    const { dateSelected, id_local } = params;
    const { data } = await fpshApi.get(
      `/apiagendamento/blocoagendamento/listarByDate/${dateSelected}/${id_local}/${pi}/${pm}/${pc}`
    );
    return data;
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
