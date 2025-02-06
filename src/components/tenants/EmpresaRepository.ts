import DB from "../../infra/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import Empresa from "./Empresa";

export interface CompanyRepositoryInterface {
  selectAllCompanies(): Promise<any>;
  insertCompany(company: any): Promise<number>;
  selectCompanyByID(id: number): Promise<any>;
  updateCompany(id: number, company: any): Promise<boolean>;
  deleteCompanyByID(id: number): Promise<boolean>;
}

export default class CompanyRepository implements CompanyRepositoryInterface {
  async selectAllCompanies(): Promise<RowDataPacket[]> {
    const query = "SELECT * FROM tb_companies";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query);
    return result;
  }

  async insertCompany(company: any): Promise<number> {
    const query =
      "INSERT INTO tb_companies (razao_social, nome_fantasia, cnpj, telefone, email, rede_social, endereco, cep, cidade, ddd, estado, pais, data_limite_faturamento, data_limite_pagamento, inscricao_estadual, inscricao_municipal, contribuinte_icms, operacao_triangular, aceita_quarteirizacao, cepom_contrato_social, demonstrativo_financeiro, referencias_comerciais, referencias_bancarias, termo_contribuinte_icms, anexos, minuta_previa_contrato, modelo_nota_fiscal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const conexao = await new DB().getConexao();

    const [result] = await conexao.query(query, [
      company.razao_social,
      company.nome_fantasia,
      company.cnpj,
      company.telefone,
      company.email,
      company.rede_social,
      company.endereco,
      company.cep,
      company.cidade,
      company.ddd,
      company.estado,
      company.pais,
      company.data_limite_faturamento,
      company.data_limite_pagamento,
      company.inscricao_estadual,
      company.inscricao_municipal,
      company.contribuinte_icms,
      company.operacao_triangular,
      company.aceita_quarteirizacao,
      company.cepom_contrato_social,
      company.demonstrativo_financeiro,
      company.referencias_comerciais,
      company.referencias_bancarias,
      company.termo_contribuinte_icms,
      company.anexos,
      company.minuta_previa_contrato,
      company.modelo_nota_fiscal,
    ]);

    if (result && (result as any).insertId) {
      return (result as any).insertId;
    } else {
      return 0;
    }
  }

  async selectCompanyByID(id: number): Promise<any> {
    const query = "SELECT * FROM tb_companies WHERE id = ?";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query(query, [id]);
    return result;
  }

  async updateCompany(id: number, company: Empresa): Promise<boolean> {
    const query =
      "UPDATE tb_companies SET razao_social = ?, nome_fantasia = ?, cnpj = ?, telefone = ?, email = ?, rede_social = ?, endereco = ?, cep = ?, cidade = ?, ddd = ?, estado = ?, pais = ?, data_limite_faturamento = ?, data_limite_pagamento = ?, inscricao_estadual = ?, inscricao_municipal = ?, contribuinte_icms = ?, operacao_triangular = ?, aceita_quarteirizacao = ?, cepom_contrato_social = ?, demonstrativo_financeiro = ?, referencias_comerciais = ?, referencias_bancarias = ?, termo_contribuinte_icms = ?, anexos = ?, minuta_previa_contrato = ?, modelo_nota_fiscal = ? WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [
      company.getRazaoSocial(),
      company.getNomeFantasia(),
      company.cnpj,
      company.telefone,
      company.email,
      company.rede_social,
      company.endereco,
      company.cep,
      company.cidade,
      company.ddd,
      company.estado,
      company.pais,
      company.data_limite_faturamento,
      company.data_limite_pagamento,
      company.inscricao_estadual,
      company.inscricao_municipal,
      company.contribuinte_icms,
      company.operacao_triangular,
      company.aceita_quarteirizacao,
      company.cepom_contrato_social,
      company.demonstrativo_financeiro,
      company.referencias_comerciais,
      company.referencias_bancarias,
      company.termo_contribuinte_icms,
      company.anexos,
      company.minuta_previa_contrato,
      company.modelo_nota_fiscal,
      id,
    ]);

    const resultSetHeader = result[0] as ResultSetHeader;
    return resultSetHeader.affectedRows > 0;
  }

  async deleteCompanyByID(id: number): Promise<boolean> {
    const query = "DELETE FROM tb_companies WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [id]);

    const resultSetHeader = result[0] as ResultSetHeader;
    return resultSetHeader.affectedRows > 0;
  }

  async deleteCompaniesByIDs(ids: number[]): Promise<boolean> {
    const query = "DELETE FROM tb_companies WHERE id IN (?)";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [ids]);

    const resultSetHeader = result[0] as ResultSetHeader;
    return resultSetHeader.affectedRows > 0;
  }

  public async isAllCompaniesExist(ids: number[]): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_companies WHERE id IN (?)";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [ids]);
      return Array.isArray(result) && result.length === ids.length;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  public async findCompanyByCNPJ(cnpj: string): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_companies WHERE cnpj = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [cnpj]);
      return Array.isArray(result) && result.length > 0;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  async selectAllCompaniesPaged(
    page: number = 0,
    limit: number = 10
  ): Promise<any> {
    page += 1;
    limit = Math.max(1, limit);
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM tb_companies LIMIT ? OFFSET ?`;
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query, [
      limit,
      offset,
    ]);

    return result;
  }

  async countTotalCompanies(): Promise<number> {
    const query = "SELECT COUNT(*) as total FROM tb_companies";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query<RowDataPacket[]>(query);
    return result[0].total;
  }
  public async findCompany(company: Empresa): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_companies WHERE cnpj = ? OR nome_fantasia = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [
        company.cnpj,
        company.getNomeFantasia(),
      ]);
      return Array.isArray(result) && result.length > 0;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }
 
}
