import { Router, Request, Response } from "express";
import StatusRepository from "../components/status/statusRepository"; // Repositório de status
import Status from "../components/status/Status"; // Modelo de status

import path from "path";

const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

// Rota para buscar todos os status
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const statuses = await new StatusRepository().selectAllStatuses();
    return res.status(200).json(statuses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para registrar um novo status
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const statusData = req.body;
  try {
    console.log("DADOS DO STATUS A REGISTRAR\n", statusData);

    const status = new Status(statusData);

    const statusRegistered = await new StatusRepository().isStatusRegistered(
      status.getName()
    );

    if (statusRegistered) {
      return res.status(400).json({ message: "Status já registrado!" });
    }

    const idInserted = await new StatusRepository().insertStatus(status);

    if (idInserted != 0) {
      console.log("Status registrado com sucesso!");
      status.setId(idInserted);
      return res.status(201).json({ message: "Status criado", status });
    } else {
      return res.status(400).json({ message: "Não foi possível criar o status" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para buscar um status pelo ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const statusId = req.params.id;
  try {
    const status = await new StatusRepository().selectStatusByID(
      Number(statusId)
    );
    if (status.length > 0) {
      return res.status(200).json(status[0]);
    } else {
      return res.status(404).json({ message: "Status não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para buscar um status pelo nome
router.get("/name/:name", async (req: Request, res: Response): Promise<any> => {
  const statusName = req.params.name;
  try {
    const status = await new StatusRepository().selectStatusByName(
      statusName
    );
    if (status.length > 0) {
      return res.status(200).json(status);
    } else {
      return res.status(404).json({ message: "Status não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para verificar se um status já está registrado
router.post("/check", async (req: Request, res: Response): Promise<any> => {
  const { name } = req.body;
  try {
    const isRegistered = await new StatusRepository().isStatusRegistered(name);
    if (isRegistered) {
      return res.status(200).json({ message: "Status já registrado" });
    } else {
      return res.status(404).json({ message: "Status não registrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para deletar um status pelo ID
router.delete("/delete/:id", async (req: Request, res: Response): Promise<any> => {
  const statusId = req.params.id;

  try {
    const result = await new StatusRepository().deleteStatusByID(
      Number(statusId)
    );

    if (result) {
      return res.status(200).json({ message: "Status deletado com sucesso" });
    } else {
      return res.status(404).json({ message: "Status não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota para atualizar um status
router.put("/update/:id", async (req: Request, res: Response): Promise<any> => {
  const statusId = req.params.id;
  const { type, name, description, enabled } = req.body;
  console.log("----------------ATUALIZANDO-------------------");
  console.log(statusId);
  console.log(req.body);
  try {
    // Verificar se o status existe
    const existingStatus = await new StatusRepository().selectStatusByID(
      Number(statusId)
    );
    console.log(existingStatus);
    if (existingStatus.length === 0) {
      return res.status(404).json({ message: "Status não encontrado" });
    }

    // Verificar se os novos dados (nome) já estão registrados
    const statusRegistered = await new StatusRepository().isStatusRegistered(
      name,
      statusId
    );
    if (statusRegistered) {
      return res
        .status(400)
        .json({ message: "Nome já registrado para outro status" });
    }

    // Atualizar o status no banco de dados
    const isUpdated = await new StatusRepository().updateStatus(
      Number(statusId),
      type,
      name,
      description,
      enabled
    );

    if (isUpdated) {
      return res.status(200).json({ message: "Status atualizado com sucesso" });
    } else {
      return res.status(400).json({ message: "Falha ao atualizar o status" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
