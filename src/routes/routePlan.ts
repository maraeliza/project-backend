import { Router, Request, Response } from "express";
import PlanRepository from "../components/plan/planRepository"; // Repositório de planos
import Plan from "../components/plan/Plan"; // Modelo de plano
import jwt from "jsonwebtoken";
import path from "path";

const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const SECRET = process.env.SECRET_KEY_JWT || "";


// Buscar todos os planos
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const plans = await new PlanRepository().selectAllPlans();
    return res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Registrar um novo plano
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const planData = req.body;
  try {
    console.log("DADOS DO PLANO A REGISTRAR\n", planData);

    const plan = new Plan(planData);

    const idInserted = await new PlanRepository().insertPlan(plan);
    console.log("ID INSERIDO "+idInserted)
    if (idInserted != 0) {
      console.log("Plano registrado com sucesso!");
      plan.setId(idInserted);
      return res.status(201).json({ message: "Plano criado", plan });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi possível criar o plano" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Buscar plano por ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const planId = req.params.id;
  try {
    const plan = await new PlanRepository().selectPlanByID(Number(planId));
    if (plan) {
      return res.status(200).json(plan);
    } else {
      return res.status(404).json({ message: "Plano não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Atualizar plano
router.put("/update/:id", async (req: Request, res: Response): Promise<any> => {
  const planId = req.params.id;
  const { name, description, price } = req.body;

  try {
    const existingPlan = await new PlanRepository().selectPlanByID(
      Number(planId)
    );
    if (!existingPlan) {
      return res.status(404).json({ message: "Plano não encontrado" });
    }

    // Realiza a atualização do plano
    const isUpdated = await new PlanRepository().updatePlan(
      Number(planId),
      name,
      description,
      price
    );

    if (isUpdated) {
      // Busca o plano atualizado após a modificação
      const updatedPlan = await new PlanRepository().selectPlanByID(
        Number(planId)
      );
      console.log(updatedPlan)
      return res.status(200).json({
        message: "Plano atualizado com sucesso",
        plan: updatedPlan[0],
      });
    } else {
      return res.status(400).json({ message: "Falha ao atualizar o plano" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Deletar plano
router.delete(
  "/delete/:id",
  async (req: Request, res: Response): Promise<any> => {
    const planId = req.params.id;
    try {
      const result = await new PlanRepository().deletePlanByID(Number(planId));

      if (result) {
        return res.status(200).json({ message: "Plano deletado com sucesso" });
      } else {
        return res.status(404).json({ message: "Plano não encontrado" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

export default router;
