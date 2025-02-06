import ExcelJS from "exceljs";
import PlanRepository from "../plan/planRepository";
import CountryRepository from "../country/countryRepository";
import StatusRepository from "../status/statusRepository";
import TenantRepository from "./tenantRepository";


export default class TenantService {
  private tenantRepository: TenantRepository;

  constructor() {
    this.tenantRepository = new TenantRepository();
  }

  // Função para buscar o nome do plano, país e status
  public async getPlanName(planId: number): Promise<string> {
    return await new PlanRepository().selectNamePlanByID(planId);
  }

  public async getCountryName(countryId: number): Promise<string> {
    return await new CountryRepository().selectNameCountryByID(countryId);
  }

  public async getStatusName(statusId: number): Promise<string> {
    return await new StatusRepository().selectNameStatusByID(statusId);
  }

  // Função para gerar o relatório Excel
  public async generateExcel(): Promise<any> {
    const tenants = await this.tenantRepository.selectAllTenants();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tenants");

    worksheet.columns = [
      { header: "ID", key: "id", width: 5 },
      { header: "Name", key: "name", width: 20 },
      { header: "Status", key: "statusName", width: 10 },
      { header: "Plan", key: "planName", width: 10 },
      { header: "CNPJ", key: "CNPJ", width: 17 },
      { header: "Cellphone", key: "cellphone", width: 15 },
      { header: "Address", key: "address", width: 30 },
      { header: "Country", key: "countryName", width: 10 },
      { header: "Signature Date", key: "signature", width: 13 },
      { header: "Expiration Date", key: "expiration", width: 14 },
    ];

    for (const tenant of tenants) {
      const planName = await this.getPlanName(tenant.plan_id);
      const countryName = await this.getCountryName(tenant.country_id);
      const statusName = await this.getStatusName(tenant.status_id);

      worksheet.addRow({
        id: tenant.id,
        name: tenant.name,
        cellphone: tenant.cellphone,
        CNPJ: tenant.CNPJ,
        address: tenant.address,
        planName: planName,
        countryName: countryName,
        statusName: statusName,
        signature: tenant.signature,
        expiration: tenant.expiration,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
