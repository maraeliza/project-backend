export type TenantInterface = TenantDB;

export default class TenantDB {
  public id: number = 0;
  public plan_id: number = 0;
  public country_id: number = 0;
  public status_id: number = 0;
  public signature: Date = new Date();
  public expiration: Date = new Date();
  public name: string = "";
  public cellphone: string | null = null;
  public CNPJ: string = "";
  public address: string | null = null;

  constructor({
    id,
    plan_id,
    country_id,
    status_id,
    signature,
    expiration,
    name,
    cellphone,
    CNPJ,
    address,
  }: TenantInterface) {
    this.id = id;
    this.plan_id = plan_id;
    this.country_id = country_id;
    this.status_id = status_id;
    this.signature = signature;
    this.expiration = expiration;
    this.name = name;
    this.cellphone = cellphone;
    this.CNPJ = CNPJ;
    this.address = address;
  }
}
