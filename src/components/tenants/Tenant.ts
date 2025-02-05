import TenantRepository from "./tenantRepository";

export type TenantInterface = Tenant;

export default class Tenant {
  private id: number = 0;
  private planId: number = 0;
  public plan_id: number = 0;
  private countryId: number = 0;
  private statusId: number = 0;
  public signature: Date = new Date();
  private expiration: Date = new Date();
  private name: string = "";
  private cellphone: string | null = null;
  private CNPJ: string = "";
  private address: string | null = null;

  constructor({
    planId,
    countryId,
    statusId,
    signature,
    expiration,
    name,
    cellphone,
    CNPJ,
    address,
  }: TenantInterface) {
    this.setPlanId(planId);
    this.setCountryId(countryId);
    this.setStatusId(statusId);
    this.setSignature(signature);
    this.setExpiration(expiration);
    this.setName(name);
    this.setCellphone(cellphone);
    this.setCNPJ(CNPJ);
    this.setAddress(address);
  }

  async register(): Promise<number> {
    try {
      return await new TenantRepository().insertTenant(this);
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    if (id < 0) {
      throw new Error("O ID deve ser maior ou igual a zero.");
    }
    this.id = id;
  }

  public getPlanId(): number {
    return this.planId;
  }

  public setPlanId(planId: number): void {
    if (planId <= 0) {
      throw new Error("O ID do plano deve ser maior que zero.");
    }
    this.planId = planId;
  }

  public getCountryId(): number {
    return this.countryId;
  }

  public setCountryId(countryId: number): void {
    if (countryId <= 0) {
      throw new Error("O ID do país deve ser maior que zero.");
    }
    this.countryId = countryId;
  }

  public getStatusId(): number {
    return this.statusId;
  }

  public setStatusId(statusId: number): void {
    if (statusId <= 0) {
      throw new Error("O ID do status deve ser maior que zero.");
    }
    this.statusId = statusId;
  }

  public getSignature(): Date {
    return this.signature;
  }

  public setSignature(signature: Date): void {
    if (!(signature instanceof Date)) {
      console.log("A data de assinatura deve ser uma data válida.");
    }
    this.signature = signature;
  }

  public getExpiration(): Date {
    return this.expiration;
  }

  public setExpiration(expiration: Date): void {
    if (!(expiration instanceof Date)) {
      console.log("A data de expiração deve ser uma data válida.");
    }
    this.expiration = expiration;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    if (name.trim().length === 0) {
      throw new Error("O nome do tenant não pode ser vazio.");
    }
    this.name = name;
  }

  public getCellphone(): string | null {
    return this.cellphone;
  }

  public setCellphone(cellphone: string | null): void {
    this.cellphone = cellphone;
  }

  public getCNPJ(): string {
    return this.CNPJ;
  }

  public setCNPJ(CNPJ: string): void {
    const apenasNumeros = CNPJ.replace(/\D/g, "");
    if (apenasNumeros.length !== 14) {
      throw new Error("O CNPJ deve ter 14 caracteres.");
    }
    this.CNPJ = apenasNumeros;
  }

  public getAddress(): string | null {
    return this.address;
  }

  public setAddress(address: string | null): void {
    this.address = address;
  }
}
