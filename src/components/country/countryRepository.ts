import { Connection, RowDataPacket } from "mysql2/promise";
import { CountryInterface } from "./Country";
import DB from "../../infra/db";

export type CountryRepositoryInterface = CountryRepository;

export default class CountryRepository {
  async insertCountry(country: CountryInterface): Promise<number> {
    try {
      const query =
        "INSERT INTO tb_countries (name, iso_code, logo_url) VALUES (?, ?, ?)";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [
        country.getName(),
        country.getIsoCode(),
        country.getLogoUrl(),
      ]);

      if (result && (result as any).insertId) {
        return (result as any).insertId; 
      } else {
        return 0; 
      }
    } catch (err) {
      console.error("Erro ao inserir país:", err);
      return 0;
    }
  }

  // Função para buscar um país pelo ID
  async selectCountryByID(id: number): Promise<CountryInterface[]> {
    try {
      const query = "SELECT * FROM tb_countries WHERE id = ?";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query, [id]);
      console.log("PAIS SELECIONADO")
      console.log(rows)
      return rows as CountryInterface[];
    } catch (err) {
      console.error("Erro ao buscar país:", err);
      return [];
    }
  }

  async isCountryRegistered(
    name: string,
    iso_code: string,
    countryId?: string
  ): Promise<boolean> {
    try {
      let query = "SELECT * FROM tb_countries WHERE name = ? OR iso_code = ?";
      let queryParams = [name, iso_code];

      if (countryId) {
        query += " AND id != ?";
        queryParams.push(countryId);
      }

      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, queryParams);

      return Array.isArray(result) && result.length > 0;
    } catch (err) {
      console.error("Erro ao verificar país:", err);
      return false;
    }
  }

  async selectCountryByName(name: string): Promise<CountryInterface[]> {
    try {
      const query = "SELECT * FROM tb_countries WHERE name = ?";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query, [name]);
      return rows as CountryInterface[];
    } catch (err) {
      console.error("Erro ao buscar país pelo nome:", err);
      return [];
    }
  }
  async selectAllCountries(): Promise<CountryInterface[]> {
    try {
      const query = "SELECT * FROM tb_countries";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query);
      return rows as CountryInterface[];
    } catch (err) {
      console.error("Erro ao buscar país pelo nome:", err);
      return [];
    }
  }
  // Função estática para buscar o ID do país pelo nome ou código ISO
  static async selectIDFromCountry(
    name: string,
    iso_code: string
  ): Promise<number> {
    try {
      const query = "SELECT * FROM tb_countries WHERE name = ? OR iso_code = ?";
      const conexao = await new DB().getConexao();
      const [results]: [RowDataPacket[], any] = await conexao.query(query, [
        name,
        iso_code,
      ]);

      if (results.length > 0) {
        const result = results[0]; // Primeiro elemento do array
        if (result.id != null) {
          return result.id;
        }
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Erro ao buscar país no banco:", error);
      return 0;
    }
    return 0;
  }
  public async deleteCountryByID(id: number): Promise<boolean> {
    console.log("DELETANDO PAIS DE ID " + id);
    const query = `DELETE FROM tb_countries WHERE id = ?;`;
    const [results] = await (await new DB().getConexao()).query(query, [id]);
    console.log(results);
    if ([results].length > 0) {
      return true;
    }
    return false;
  }
  async selectNameCountryByID(id: number): Promise<string> {
      const query = "SELECT name FROM tb_countries WHERE id = ?";
      try {
        const conexao = await new DB().getConexao();
        const [result] = await conexao.query<RowDataPacket[]>(query, [id]);
  
        if (result.length > 0) {
          return result[0].name; 
        } else {
          return "N/A"; 
        }
      } catch (err) {
        console.log(err);
        return "Erro ao buscar nome do país"; 
      }
    }

  async updateCountry(
    id: number,
    name: string,
    iso_code: string,
    logo_url: string
  ): Promise<boolean> {
    try {
      const query = `
        UPDATE tb_countries 
        SET name = ?, iso_code = ?, logo_url = ? 
        WHERE id = ?
      `;
      console.log("ATUALIZANDO NO BANCO DE DADOS\n", query);
      const conexao = await new DB().getConexao();
      const [results] = await conexao.query(query, [
        name,
        iso_code,
        logo_url,
        id,
      ]);
      console.log(results);
      if ([results].length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Erro ao atualizar país:", err);
      return false;
    }
  }
}
