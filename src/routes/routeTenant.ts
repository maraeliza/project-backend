import { Router, Request, Response } from "express";
import TenantRepository from "../components/tenants/tenantRepository"; 
import Tenant from "../components/tenants/Tenant";

import path from "path";

const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });


// Buscar todos os tenants
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const tenants = await new TenantRepository().selectAllTenants();
    return res.status(200).json(tenants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Registrar um novo tenant
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const tenantData = req.body;
  try {
    console.log("DADOS DO TENANT A REGISTRAR\n", tenantData);

    const tenant = new Tenant(tenantData);
    if(await new TenantRepository().findTenant(tenant)){
      return res
      .status(400)
      .json({ message: "Não foi possível continuar o registro, pois já existe uma empresa com esse CNPJ e nome" });;
    }
    const idInserted = await new TenantRepository().insertTenant(tenant);
    console.log("ID INSERIDO "+idInserted)
    if (idInserted != 0) {
      console.log("Tenant registrado com sucesso!");
      tenant.setId(idInserted);
      return res.status(201).json({ message: "Tenant criado", tenant });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi possível criar o tenant" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Buscar tenant por ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const tenantId = req.params.id;
  try {
    const tenant = await new TenantRepository().selectTenantByID(Number(tenantId));
    if (tenant) {
      return res.status(200).json(tenant);
    } else {
      return res.status(404).json({ message: "Tenant não encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Atualizar tenant
router.put("/update/:id", async (req: Request, res: Response): Promise<any> => {
  const tenantId = req.params.id;
  const {
    planId,
    countryId,
    statusId,
    signature,
    expiration,
    name,
    cellphone,
    CNPJ,
    address
  } = req.body;

  try {
    const existingTenant = await new TenantRepository().selectTenantByID(
      Number(tenantId)
    );
    if (!existingTenant) {
      return res.status(404).json({ message: "Tenant não encontrado" });
    }

    // Realiza a atualização do tenant
    const isUpdated = await new TenantRepository().updateTenant(
      Number(tenantId),
      planId,
      countryId,
      statusId,
      signature,
      expiration,
      name,
      cellphone,
      CNPJ,
      address
    );

    if (isUpdated) {
      // Busca o tenant atualizado após a modificação
      const updatedTenant = await new TenantRepository().selectTenantByID(
        Number(tenantId)
      );
      return res.status(200).json({
        message: "Tenant atualizado com sucesso",
        tenant: updatedTenant[0],
      });
    } else {
      return res.status(400).json({ message: "Falha ao atualizar o tenant" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Deletar tenant
router.delete(
  "/delete/:id",
  async (req: Request, res: Response): Promise<any> => {
    const tenantId = req.params.id;
    try {
      const result = await new TenantRepository().deleteTenantByID(Number(tenantId));

      if (result) {
        return res.status(200).json({ message: "Tenant deletado com sucesso" });
      } else {
        return res.status(404).json({ message: "Tenant não encontrado" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

export default router;
