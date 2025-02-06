import { Router, Request, Response } from "express";
import path from "path";
import CompanyRepository from "../components/tenants/EmpresaRepository";
import Empresa from "../components/tenants/Empresa";
const router = Router();
const envPath = path.resolve(__dirname, "../.env");
require("dotenv").config({ path: envPath });

// Buscar todas as empresas
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const companies = await new CompanyRepository().selectAllCompanies();
    return res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Buscar empresas com paginação
router.get("/paged", async (req: Request, res: Response): Promise<any> => {
  const { page, limit } = req.query;
  const pageNumber = page ? parseInt(page as string) : 1;
  const limitNumber = limit ? parseInt(limit as string) : 10;

  try {
    const companies = await new CompanyRepository().selectAllCompaniesPaged(
      pageNumber,
      limitNumber
    );
    const totalCompanies = await new CompanyRepository().countTotalCompanies();

    return res.status(200).json({
      companies,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCompanies,
        totalPages: Math.ceil(totalCompanies / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Registrar uma nova empresa
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const companyData = req.body;
  try {
    console.log("DADOS DA EMPRESA A REGISTRAR\n", companyData);

    const company = new Empresa(companyData);
    if (await new CompanyRepository().findCompany(company)) {
      return res.status(400).json({
        message:
          "Não foi possível continuar o registro, pois já existe uma empresa com esse CNPJ e nome",
      });
    }
    const idInserted = await new CompanyRepository().insertCompany(company);
    console.log("ID INSERIDO " + idInserted);
    if (idInserted != 0) {
      console.log("Empresa registrada com sucesso!");
      company.setId(idInserted);
      return res.status(201).json({ message: "Empresa criada", company });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi possível criar a empresa" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Buscar empresa por ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const companyId = req.params.id;
  try {
    const company = await new CompanyRepository().selectCompanyByID(
      Number(companyId)
    );
    if (company) {
      return res.status(200).json(company);
    } else {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Atualizar empresa
router.put("/update/:id", async (req: Request, res: Response): Promise<any> => {
  const companyId = req.params.id;
  const {
    razaoSocial,
    nomeFantasia,
    cnpj,
    telefone,
    email,
    endereco,
    cep,
    cidade,
    ddd,
    estado,
    pais,
    dataLimiteFaturamento,
    dataLimitePagamento,
    inscricaoEstadual,
    inscricaoMunicipal,
    contribuinteIcms,
    operacaoTriangular,
    aceitaQuarteirizacao,
    cepomContratoSocial,
    demonstrativoFinanceiro,
    referenciasComerciais,
    referenciasBancarias,
    termoContribuinteIcms,
    anexos,
    minutaPreviaContrato,
    modeloNotaFiscal,
  } = req.body;

  try {
    const existingCompany = await new CompanyRepository().selectCompanyByID(
      Number(companyId)
    );
    if (!existingCompany) {
      return res
        .status(404)
        .json({ message: "Empresa com id " + companyId + " não encontrada" });
    }

    const isUpdated = await new CompanyRepository().updateCompany(
      Number(companyId),
      existingCompany
    );

    if (isUpdated) {
      const updatedCompany = await new CompanyRepository().selectCompanyByID(
        Number(companyId)
      );
      return res.status(200).json({
        message: "Empresa atualizada com sucesso",
        company: updatedCompany[0],
      });
    } else {
      return res.status(400).json({ message: "Falha ao atualizar a empresa" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Deletar empresa
router.delete(
  "/delete/:id",
  async (req: Request, res: Response): Promise<any> => {
    const companyId = req.params.id;
    try {
      const existingCompany = await new CompanyRepository().selectCompanyByID(
        Number(companyId)
      );
      if (!existingCompany) {
        return res
          .status(404)
          .json({ message: "Empresa com id " + companyId + " não encontrada" });
      }
      const result = await new CompanyRepository().deleteCompanyByID(
        Number(companyId)
      );

      if (result) {
        return res
          .status(200)
          .json({ message: "Empresa deletada com sucesso" });
      } else {
        return res.status(404).json({ message: "Empresa não encontrada" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

// Deletar múltiplas empresas
router.delete(
  "/delete-multiple",
  async (req: Request, res: Response): Promise<any> => {
    const companyIds: number[] = req.body.ids; // Esperando um array de IDs no corpo da requisição

    if (!companyIds || companyIds.length === 0) {
      return res.status(400).json({ message: "Nenhum ID fornecido" });
    }

    try {
      // Verificar se todas as empresas existem
      const isAllCompaniesExist =
        await new CompanyRepository().isAllCompaniesExist(companyIds);

      if (!isAllCompaniesExist) {
        return res
          .status(404)
          .json({ message: "Algumas empresas não foram encontradas" });
      }

      // Deletar as empresas encontradas
      const result = await new CompanyRepository().deleteCompaniesByIDs(
        companyIds
      );

      if (result) {
        return res.status(200).json({
          message: `${companyIds.length} empresas deletadas com sucesso`,
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
