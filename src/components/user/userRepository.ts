import { Connection, RowDataPacket } from "mysql2/promise";
import { UserAuth, UserInterface } from "./userModel";
import DB from "../../infra/db";

export type UserRepositoryInterface = UserRepository;

export default class UserRepository {
  private conexao: Connection | null = null;

  constructor() {
    this.inicializarConexao();
  }

  private async inicializarConexao(): Promise<void> {
    try {
      const db = new DB();
      this.conexao = await db.getConexao();
    } catch (error) {
      console.error(
        "Erro ao inicializar a conexão com o banco de dados:",
        error
      );
    }
  }

  private async getConexao(): Promise<Connection> {
    if (!this.conexao) {
      throw new Error("Conexão com o banco de dados não foi inicializada.");
    }
    return this.conexao;
  }

  async insertUserBanco(user: UserInterface): Promise<boolean> {
    console.log("inserindo no banco")
    const isRegistered = await this.isUserRegistered(
      user.getCpf(),
      user.getEmail()
    );
    if (isRegistered) {
      console.log("usuário já existente")
      return false;
    }

    try {
      const query =
        "INSERT INTO tb_users (cpf, email, nome, cnpj, senha) VALUES (?, ?, ?, ?,?)";
      const conexao = await this.getConexao();
      await conexao.query(query, [
        user.getCpf(),
        user.getEmail(),
        user.getNome(),
        user.getCnpj(),
        user.getSenha(),
      ]);
      return true;
    } catch (err) {
      console.error("Erro ao inserir usuário:", err);
      return false;
    }
  }

  async selectUserByID(id: number): Promise<UserInterface[]> {
    try {
      const query = "SELECT * FROM tb_users where id = ?";
      const conexao = await this.getConexao();
      const [rows] = await conexao.query(query, [id]);
      return rows as UserInterface[];
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      return [];
    }
  }

  async isUserRegistered(cpf: number, email: string): Promise<boolean> {
    try {
      const query = "SELECT * FROM tb_users WHERE cpf = ? OR email = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [cpf, email]);

      return Array.isArray(result) && result.length > 0;
    } catch (err) {
      console.error("Erro ao verificar usuário:", err);
      return false;
    }
  }
  static async selectIDFromUser(cpf: number, cnpj: number): Promise<number> {
    try {
      const query = "SELECT * FROM tb_users WHERE cpf = ? AND cnpj = ?";
      const conexao = await new DB().getConexao();
      const [results]: [RowDataPacket[], any] = await conexao.query(query, [
        cpf,
        cnpj,
      ]);
      if (results.length > 0) {
        const result = results[0]; // Primeiro elemento do array
        if (result.id != null) {
          console.log("ID DO ELEMENTO NO BANCO: " + result.id);
          return result.id;
        }
      } else {
        console.log("Nenhum resultado encontrado.");
        return 0;
      }
    } catch (error) {
      console.error("Erro ao buscar usuário no banco:", error);
      return 0;
    }
    return 0;
  }

  public async findUser(user: UserAuth): Promise<boolean> {
    try {
      const query =
        "SELECT * FROM tb_users WHERE cpf = ? AND senha = ? and cnpj = ?";
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [
        user.cpf,
        user.senha,
        user.cnpj,
      ]);
      return Array.isArray(result) && result.length > 0;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }
}
