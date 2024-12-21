import mysql from 'mysql2/promise';
import path from "path";
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;


export default class Database {
  private conexao: mysql.Connection | null = null; // Certifique-se de usar 'mysql2.Connection'

  // Método para inicializar a conexão
  public async getConexao(): Promise<mysql.Connection> {
    if (!this.conexao) {
      this.conexao = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
      });
    }
    return this.conexao;
  }
}
