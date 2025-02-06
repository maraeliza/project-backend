import PDFDocument from 'pdfkit';
import TenantRepository from './tenantRepository';
import TenantService from './Service';
import TenantDB from './TenantDB';

export default class TenantServicePDF {
  private tenantRepository: TenantRepository;

  constructor() {
    this.tenantRepository = new TenantRepository();
  }

  public async generatePDF(): Promise<Buffer> {
    const tenants = await this.tenantRepository.selectAllTenants() as TenantDB[];
    const tenantService = new TenantService();

    // Criação de um novo documento PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    // Criação de um buffer para armazenar o PDF gerado
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Adiciona título no PDF
    doc.fontSize(20).text('Relatório de Empresas', {
      align: 'center',
      underline: true,
    }).moveDown(2);

    // Adiciona os dados dos tenants
    await tenants.forEach(async(tenant: TenantDB) => {
      const planName = await tenantService.getPlanName(tenant.plan_id);
      const countryName = await tenantService.getCountryName(tenant.country_id);
      const statusName = await tenantService.getStatusName(tenant.status_id);

      doc
        .fontSize(14)
        .text(`Empresa: ${tenant.name}`, { underline: true })
        .moveDown(1)
        .text(`Status: ${statusName}`)
        .text(`Plano: ${planName}`)
        .text(`CNPJ: ${tenant.CNPJ}`)
        .text(`Celular: ${tenant.cellphone}`)
        .text(`Endereço: ${tenant.address}`)
        .text(`País: ${countryName}`)
        .text(`Data de Assinatura: ${tenant.signature.toLocaleDateString()}`)
        .text(`Data de Expiração: ${tenant.expiration.toLocaleDateString()}`)
        .moveDown(2);
    });

    // Finaliza o PDF
    doc.end();

    // Retorna o PDF gerado como um Buffer
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', (err) => reject(err));
    });
  }
}
