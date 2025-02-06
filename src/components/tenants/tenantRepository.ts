import Tenant from "./Tenant";
import DB from "../../infra/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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
  async selectAllTenants(): Promise<RowDataPacket[]> {
    const query = "SELECT * FROM tb_tenants";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query);
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
    console.log(result);
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

    const resultSetHeader = result[0] as ResultSetHeader;
    console.log(
      `${id}=ID\nFOI POSSÍVEL ATUALIZAR ITEM? ${
        resultSetHeader.affectedRows > 0
      }`
    );

    return resultSetHeader.affectedRows > 0;
  }

  async deleteTenantByID(id: number): Promise<boolean> {
    const query = "DELETE FROM tb_tenants WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [id]);
    console.log(id + "=ID\nFOI POSSIVEL DELETAR ITEM? " + [result].length);
    const resultSetHeader = result[0] as ResultSetHeader;
    console.log(
      `${id}=ID\nFOI POSSÍVEL ATUALIZAR ITEM? ${
        resultSetHeader.affectedRows > 0
      }`
    );

    return resultSetHeader.affectedRows > 0;
  }
  async deleteTenantsByIDs(ids: number[]): Promise<boolean> {
    const query = "DELETE FROM tb_tenants WHERE id IN (?)";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [ids]);

    const resultSetHeader = result[0] as ResultSetHeader;
    console.log(
      `IDs: ${ids.join(", ")}\nFOI POSSÍVEL DELETAR ITENS? ${
        resultSetHeader.affectedRows > 0
      }`
    );

    return resultSetHeader.affectedRows > 0;
  }
  public async isAllTenantsExist(ids: number[]): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_tenants WHERE id IN (?)";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [ids]);
      return Array.isArray(result) && result.length === ids.length;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  public async findTenantByID(id: number): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_tenants WHERE id = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [id]);
      return Array.isArray(result) && result.length > 0;
    } catch (erro) {
      console.log(erro);
      return false;
    }
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
  async getTenantsByPlan(): Promise<{ planName: string; count: number }[]> {
    const query = `
      SELECT p.name as planName, COUNT(t.id) as count
      FROM tb_tenants t
      JOIN tb_plans p ON t.plan_id = p.id
      GROUP BY p.name;
    `;
    const conexao = await new DB().getConexao();
    const [rows] = await conexao.query<RowDataPacket[]>(query);
    return rows.map((row) => ({
      planName: row.planName,
      count: row.count,
    }));
  }

  async getTenantsBySignatureDate(): Promise<
    { date: string; count: number }[]
  > {
    const query = `
      SELECT DATE(t.signature) as date, COUNT(t.id) as count
      FROM tb_tenants t
      GROUP BY DATE(t.signature)
      ORDER BY DATE(t.signature);
    `;
    const conexao = await new DB().getConexao();
    const [rows] = await conexao.query<RowDataPacket[]>(query);
    return rows.map((row) => ({
      date: row.date,
      count: row.count,
    }));
  }
  async selectAllTenantsPaged(
    page: number = 0,
    limit: number = 10
  ): Promise<any> {
    page+=1;
    limit = Math.max(1, limit);
    const offset = (page-1) * limit;
    
    const query = `SELECT * FROM tb_tenants LIMIT ? OFFSET ?`;
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query, [limit, offset]);
   
    return result;
  }
  async countTotalTenants(): Promise<number> {
    const query = "SELECT COUNT(*) as total FROM tb_tenants";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query);
    return result[0].total;
  }
}
