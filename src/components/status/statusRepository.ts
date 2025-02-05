import { Connection, RowDataPacket } from "mysql2/promise";
import { StatusInterface } from "./Status";
import DB from "../../infra/db";

export type StatusRepositoryInterface = StatusRepository;

export default class StatusRepository {
  // Função para inserir um novo status
  async insertStatus(status: StatusInterface): Promise<number> {
    try {
      const query =
        "INSERT INTO tb_status (type, name, description, enabled) VALUES (?, ?, ?, ?)";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [
        status.getType(),
        status.getName(),
        status.getDescription(),
        status.getEnabled(),
      ]);

      if (result && (result as any).insertId) {
        return (result as any).insertId;
      } else {
        return 0;
      }
    } catch (err) {
      console.error("Erro ao inserir status:", err);
      return 0;
    }
  }
  async selectNameStatusByID(id: number): Promise<string> {
      const query = "SELECT name FROM tb_status WHERE id = ?";
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
        return "Erro ao buscar nome do plano"; 
      }
    }
  // Função para buscar um status pelo ID
  async selectStatusByID(id: number): Promise<StatusInterface[]> {
    try {
      const query = "SELECT * FROM tb_status WHERE id = ?";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query, [id]);
      return rows as StatusInterface[];
    } catch (err) {
      console.error("Erro ao buscar status:", err);
      return [];
    }
  }

  // Função para verificar se um status já está registrado pelo nome
  async isStatusRegistered(
    name: string,
    statusId?: string
  ): Promise<boolean> {
    try {
      let query = "SELECT * FROM tb_status WHERE name = ?";
      let queryParams = [name];

      if (statusId) {
        query += " AND id != ?";
        queryParams.push(statusId);
      }

      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, queryParams);

      return Array.isArray(result) && result.length > 0;
    } catch (err) {
      console.error("Erro ao verificar status:", err);
      return false;
    }
  }

  async selectAllStatuses(): Promise<StatusInterface[]> {
    try {
      const query = "SELECT * FROM tb_status";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query);
      return rows as StatusInterface[];
    } catch (err) {
      console.error("Erro ao buscar status:", err);
      return [];
    }
  }

  static async selectIDFromStatus(name: string): Promise<number> {
    try {
      const query = "SELECT * FROM tb_status WHERE name = ?";
      const conexao = await new DB().getConexao();
      const [results]: [RowDataPacket[], any] = await conexao.query(query, [name]);

      if (results.length > 0) {
        const result = results[0]; 
        if (result.id != null) {
          return result.id;
        }
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Erro ao buscar status no banco:", error);
      return 0;
    }
    return 0;
  }

  // Função para excluir um status pelo ID
  public async deleteStatusByID(id: number): Promise<boolean> {
    console.log("DELETANDO STATUS DE ID " + id);
    const query = `DELETE FROM tb_status WHERE id = ?;`;
    const [results] = await (await new DB().getConexao()).query(query, [id]);
    console.log(results);
    if ([results].length > 0) {
      return true;
    }
    return false;
  }

  // Função para atualizar um status
  async updateStatus(
    id: number,
    type: number,
    name: string,
    description: string,
    enabled: boolean
  ): Promise<boolean> {
    try {
      const query = `
        UPDATE tb_status 
        SET type = ?, name = ?, description = ?, enabled = ? 
        WHERE id = ?
      `;
      console.log("ATUALIZANDO NO BANCO DE DADOS\n", query);
      const conexao = await new DB().getConexao();
      const [results] = await conexao.query(query, [
        type,
        name,
        description,
        enabled,
        id,
      ]);
      console.log(results);
      if ([results].length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      return false;
    }
  }
  async selectStatusByName(name: string): Promise<StatusInterface[]> {
    try {
      const query = "SELECT * FROM tb_status WHERE name = ?";
      const conexao = await new DB().getConexao();
      const [rows] = await conexao.query(query, [name]);
      return rows as StatusInterface[];
    } catch (err) {
      console.error("Erro ao buscar status pelo nome:", err);
      return [];
    }
  }
}
