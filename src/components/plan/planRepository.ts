import Plan, { PlanInterface } from "./Plan";
import DB from "../../infra/db";
import { RowDataPacket } from "mysql2";
export interface PlanRepositoryInterface {
  selectAllPlans(): Promise<any>;
  insertPlan(plan: Plan): Promise<number>;
  selectPlanByID(id: number): Promise<any>;
  updatePlan(
    id: number,
    name: string,
    description: string,
    price: number
  ): Promise<boolean>;
  deletePlanByID(id: number): Promise<boolean>;
}

export default class PlanRepository implements PlanRepositoryInterface {
  async selectAllPlans(): Promise<any> {
    const query = "SELECT * FROM tb_plans";
    const conexao = await new DB().getConexao();
    const [result] = await conexao.query(query);
    return result;
  }

  async insertPlan(plan: Plan): Promise<number> {
    const query =
      "INSERT INTO tb_plans (name, description, price) VALUES (?, ?, ?)";
    const conexao = await new DB().getConexao();

    const [result] = await conexao.query(query, [
      plan.getName(),
      plan.getDescription(),
      plan.getPrice(),
    ]);

    if (result && (result as any).insertId) {
      return (result as any).insertId;
    } else {
      return 0;
    }
  }

  async selectPlanByID(id: number): Promise<PlanInterface[]> {
    const query = "SELECT * FROM tb_plans WHERE id = ?";
    try {
      const conexao = await new DB().getConexao();
      const [result] = await conexao.query(query, [id]);
      console.log(result);
      return result as PlanInterface[];
    } catch (err) {
      console.log(err);
      return [] as PlanInterface[];
    }
  }
  async selectNamePlanByID(id: number): Promise<string> {
    const query = "SELECT name FROM tb_plans WHERE id = ?";
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

  async updatePlan(
    id: number,
    name: string,
    description: string,
    price: number
  ): Promise<boolean> {
    const query =
      "UPDATE tb_plans SET name = ?, description = ?, price = ? WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [name, description, price, id]);
    return [result].length > 0;
  }

  async deletePlanByID(id: number): Promise<boolean> {
    const query = "DELETE FROM tb_plans WHERE id = ?";
    const conexao = await new DB().getConexao();
    const result = await conexao.query(query, [id]);
    return [result].length > 0;
  }
}
