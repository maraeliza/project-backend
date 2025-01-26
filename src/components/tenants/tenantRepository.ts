import Tenant from "./Tenant";
import DB from "../../infra/db";

export interface TenantRepositoryInterface {
  selectAllTenants(): Promise<any>;
  insertTenant(tenant: Tenant): Promise<number>;
  selectTenantByID(id: number): Promise<any>;
  updateTenant(
    id: number,
    planId: number,
    countryId: number,
    statusId: number,
    signature: Date,
    expiration: Date,
    name: string,
    cellphone: string | null,
    CNPJ: string,
    address: string | null
  ): Promise<boolean>;
  deleteTenantByID(id: number): Promise<boolean>;
}

export default class TenantRepository implements TenantRepositoryInterface {
  async selectAllTenants(): Promise<any> {
    const query = "SELECT * FROM tb_tenants";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query(query);
    return result;
  }

  async insertTenant(tenant: Tenant): Promise<number> {
    const query =
      "INSERT INTO tb_tenants (plan_id, country_id, status_id, signature, expiration, name, cellphone, CNPJ, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const conexao = await new DB().getConexao();

   
    const [result] = await conexao.query(query, [
      tenant.getPlanId(),
      tenant.getCountryId(),
      tenant.getStatusId(),
      tenant.getSignature(),
      tenant.getExpiration(),
      tenant.getName(),
      tenant.getCellphone(),
      tenant.getCNPJ(),
      tenant.getAddress(),
    ]);

    console.log("TENANT INSERIDO  ");
    console.log(result);

    if (result && (result as any).insertId) {
      return (result as any).insertId; 
    } else {
      return 0; 
    }
  }

  async selectTenantByID(id: number): Promise<any> {
    const query = "SELECT * FROM tb_tenants WHERE id = ?";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query(query, [id]);
    return [result][0];
  }

  async updateTenant(
    id: number,
    planId: number,
    countryId: number,
    statusId: number,
    signature: Date,
    expiration: Date,
    name: string,
    cellphone: string | null,
    CNPJ: string,
    address: string | null
  ): Promise<boolean> {
    const query =
      "UPDATE tb_tenants SET plan_id = ?, country_id = ?, status_id = ?, signature = ?, expiration = ?, name = ?, cellphone = ?, CNPJ = ?, address = ? WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [
      planId,
      countryId,
      statusId,
      signature,
      expiration,
      name,
      cellphone,
      CNPJ,
      address,
      id,
    ]);
    return [result].length > 0;
  }

  async deleteTenantByID(id: number): Promise<boolean> {
    const query = "DELETE FROM tb_tenants WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [id]);
    console.log(id + "=ID\nFOI POSSIVEL DELETAR ITEM? " + [result].length);
    return [result].length > 0;
  }
  public async findTenant(tenant: Tenant): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_tenants WHERE cnpj = ? OR name = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [
        tenant.getCNPJ(),
        tenant.getName(),
      ]);
      return Array.isArray(result) && result.length > 0;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }
}
