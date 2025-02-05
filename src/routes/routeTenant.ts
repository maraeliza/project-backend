import { Router, Request, Response } from "express";
import TenantRepository from "../components/tenants/tenantRepository";
import Tenant from "../components/tenants/Tenant";

import path from "path";
import TenantService from "../components/tenants/Service";
import TenantServicePDF from "../components/tenants/ServicePDF";

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
router.get("/companies-by-plan", async (req: Request, res: Response) => {
  try {
    const data = await new TenantRepository().getTenantsByPlan();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar empresas por plano" });
  }
});

router.get(
  "/companies-by-signature-date",
  async (req: Request, res: Response) => {
    try {
      const data = await new TenantRepository().getTenantsBySignatureDate();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar empresas por plano" });
    }
  }
);
router.get("/paged", async (req: Request, res: Response): Promise<any> => {
  const { page, limit } = req.query;
  const pageNumber = page ? parseInt(page as string) : 1;
  const limitNumber = limit ? parseInt(limit as string) : 10;

  try {
    const tenants = await new TenantRepository().selectAllTenantsPaged(pageNumber, limitNumber);
    const totalTenants = await new TenantRepository().countTotalTenants();

    return res.status(200).json({
      tenants,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalTenants,
        totalPages: Math.ceil(totalTenants / limitNumber),
      },
    });
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
    if (await new TenantRepository().findTenant(tenant)) {
      return res.status(400).json({
        message:
          "Não foi possível continuar o registro, pois já existe uma empresa com esse CNPJ e nome",
      });
    }
    const idInserted = await new TenantRepository().insertTenant(tenant);
    console.log("ID INSERIDO " + idInserted);
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
router.get("/export-excel", async (req, res) => {
  try {
    console.log("EXPORTANDO EM EXCEL");
    const excelBuffer = await new TenantService().generateExcel();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tenants.xlsx");
    res.send(excelBuffer);
  } catch (error) {
    console.error("Erro ao gerar o Excel:", error);
    res.status(500).send("Erro ao gerar o arquivo Excel");
  }
});
router.get("/export-pdf", async (req, res) => {
  try {
    const pdfBuffer = await new TenantServicePDF().generatePDF();
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tenants.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    res.status(500).send("Erro ao gerar o arquivo PDF");
  }
});


// Buscar tenant por ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const tenantId = req.params.id;
  try {
    const tenant = await new TenantRepository().selectTenantByID(
      Number(tenantId)
    );
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
    address,
  } = req.body;

  try {
    const existingTenant = await new TenantRepository().findTenantByID(
      Number(tenantId)
    );
    if (!existingTenant) {
      return res
        .status(404)
        .json({ message: "Empresa com id " + tenantId + " não encontrada" });
    }

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
      const existingTenant = await new TenantRepository().findTenantByID(
        Number(tenantId)
      );
      if (!existingTenant) {
        return res
          .status(404)
          .json({ message: "Empresa com id " + tenantId + " não encontrada" });
      }
      const result = await new TenantRepository().deleteTenantByID(
        Number(tenantId)
      );

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

// Deletar múltiplos tenants
router.delete(
  "/delete-multiple",
  async (req: Request, res: Response): Promise<any> => {
    const tenantIds: number[] = req.body.ids; // Esperando um array de IDs no corpo da requisição

    if (!tenantIds || tenantIds.length === 0) {
      return res.status(400).json({ message: "Nenhum ID fornecido" });
    }

    try {
      // Verificar se todos os tenants existem
      const isAllTenantsExist = await new TenantRepository().isAllTenantsExist(
        tenantIds
      );

      if (!isAllTenantsExist) {
        return res
          .status(404)
          .json({ message: "Algumas empresas não foram encontradas" });
      }

      // Deletar os tenants encontrados
      const result = await new TenantRepository().deleteTenantsByIDs(tenantIds);

      if (result) {
        return res.status(200).json({
          message: `${tenantIds.length} empresas deletadas com sucesso`,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Erro ao tentar deletar as empresas" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

export default router;
